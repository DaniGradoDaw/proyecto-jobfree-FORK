package com.jobfree.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.jobfree.exception.pago.PagoInvalidoException;
import com.jobfree.exception.pago.PagoNotFoundException;
import com.jobfree.model.entity.Pago;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.EstadoPago;
import com.jobfree.model.enums.EstadoReserva;
import com.jobfree.model.enums.MetodoPago;
import com.jobfree.model.enums.Rol;
import com.jobfree.repository.PagoRepository;

import org.springframework.dao.DataIntegrityViolationException;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PagoService {

	private static final Logger log = LoggerFactory.getLogger(PagoService.class);

	// Transiciones válidas: desde estado actual → estados permitidos
	private static final java.util.Map<EstadoPago, Set<EstadoPago>> TRANSICIONES_VALIDAS = java.util.Map.of(
			EstadoPago.PENDIENTE,    Set.of(EstadoPago.PAGADO),
			EstadoPago.PAGADO,       Set.of(EstadoPago.REEMBOLSADO),
			EstadoPago.REEMBOLSADO,  Set.of()
	);

	private final PagoRepository      pagoRepository;
	private final NotificacionService notificacionService;

	public PagoService(PagoRepository pagoRepository, NotificacionService notificacionService) {
		this.pagoRepository      = pagoRepository;
		this.notificacionService = notificacionService;
	}

	public List<Pago> listarPagos() {
		return pagoRepository.findAll();
	}

	public Pago obtenerPorId(Long id) {
		return pagoRepository.findById(id).orElseThrow(() -> new PagoNotFoundException(id));
	}

	public Pago obtenerPorIdSeguro(Long id, Usuario usuario) {
		Pago pago = obtenerPorId(id);
		validarAccesoPago(pago, usuario);
		return pago;
	}

	public Pago obtenerParaPaymentIntent(Long id, Usuario usuario) {
		Pago pago = obtenerPorIdSeguro(id, usuario);
		if (!pago.getReserva().getCliente().getId().equals(usuario.getId())) {
			log.warn("Usuario {} intentó crear PaymentIntent de pago {} sin ser cliente", usuario.getId(), id);
			throw new PagoInvalidoException("Solo el cliente de la reserva puede iniciar el pago");
		}
		if (pago.getMetodo() != MetodoPago.TARJETA) {
			throw new PagoInvalidoException("Stripe solo está disponible para pagos con tarjeta");
		}
		if (pago.getEstado() != EstadoPago.PENDIENTE) {
			throw new PagoInvalidoException("Solo se puede iniciar Stripe para pagos pendientes");
		}
		return pago;
	}

	public Pago guardarPago(Pago pago, Usuario usuario) {
		if (pago.getReserva() == null) {
			throw new PagoInvalidoException("La reserva es obligatoria");
		}
		if (usuario == null || !pago.getReserva().getCliente().getId().equals(usuario.getId())) {
			log.warn("Usuario {} intentó crear pago para reserva {} sin ser cliente",
					usuario != null ? usuario.getId() : null, pago.getReserva().getId());
			throw new PagoInvalidoException("Solo el cliente de la reserva puede crear el pago");
		}
		if (pago.getImporte() == null || pago.getImporte().compareTo(BigDecimal.ZERO) <= 0) {
			throw new PagoInvalidoException("El importe debe ser mayor que 0");
		}
		if (pago.getReserva().getEstado() != EstadoReserva.CONFIRMADA) {
			throw new PagoInvalidoException("Solo se pueden pagar reservas aceptadas por el profesional");
		}
		if (pagoRepository.findByReservaId(pago.getReserva().getId()).isPresent()) {
			throw new PagoInvalidoException("La reserva ya tiene un pago asociado");
		}

		pago.setEstado(EstadoPago.PENDIENTE);
		try {
			Pago guardado = pagoRepository.save(pago);
			log.info("Pago {} creado para reserva {} — importe: {} €",
					guardado.getId(), pago.getReserva().getId(), guardado.getImporte());
			return guardado;
		} catch (DataIntegrityViolationException e) {
			// La constraint UNIQUE de reserva_id captura el caso en que dos peticiones
			// concurrentes pasen el findByReservaId().isPresent() al mismo tiempo.
			log.warn("Intento de crear pago duplicado para reserva {} (race condition capturado por constraint DB)",
					pago.getReserva().getId());
			throw new PagoInvalidoException("La reserva ya tiene un pago asociado");
		}
	}

	/**
	 * Confirmación manual reservada a administración. Los pagos de usuarios deben
	 * confirmarse por el webhook firmado de Stripe.
	 */
	public Pago confirmarPagoManualAdmin(Long id) {
		return confirmarPago(id);
	}

	private Pago confirmarPago(Long id) {
		Pago pago = obtenerPorId(id);

		if (pago.getEstado() == EstadoPago.PAGADO) {
			throw new PagoInvalidoException("El pago ya ha sido confirmado");
		}
		if (pago.getEstado() == EstadoPago.REEMBOLSADO) {
			throw new PagoInvalidoException("No se puede confirmar un pago reembolsado");
		}

		pago.setEstado(EstadoPago.PAGADO);
		Pago guardado = pagoRepository.save(pago);
		log.info("Pago {} confirmado — reserva {}", guardado.getId(), guardado.getReserva().getId());

		Usuario profesional = guardado.getReserva().getServicio().getProfesional().getUsuario();
		notificacionService.crear(
				"Pago #" + guardado.getId() + " confirmado por " + guardado.getImporte() + " €. " +
				"Reserva #" + guardado.getReserva().getId() + " lista para completar.",
				profesional
		);

		return guardado;
	}

	/**
	 * Actualiza el estado de un pago respetando las transiciones válidas.
	 * Solo permite: PENDIENTE → PAGADO → REEMBOLSADO.
	 * Usado principalmente por webhooks de Stripe.
	 */
	public void guardarStripePaymentIntentId(Long pagoId, String piId) {
		Pago pago = obtenerPorId(pagoId);
		pago.setStripePaymentIntentId(piId);
		pagoRepository.save(pago);
	}

	public Pago actualizarEstado(Long id, EstadoPago nuevoEstado) {
		Pago pago = obtenerPorId(id);
		EstadoPago estadoActual = pago.getEstado();
		if (estadoActual == nuevoEstado) {
			log.debug("Pago {} ya está en estado {}, sin cambios", id, estadoActual);
			return pago;
		}

		Set<EstadoPago> permitidos = TRANSICIONES_VALIDAS.getOrDefault(estadoActual, Set.of());
		if (!permitidos.contains(nuevoEstado)) {
			throw new PagoInvalidoException(
					"Transición inválida: " + estadoActual + " → " + nuevoEstado +
					". Permitidas desde " + estadoActual + ": " + permitidos);
		}

		pago.setEstado(nuevoEstado);
		Pago guardado = pagoRepository.save(pago);
		log.info("Pago {} cambiado de {} a {}", id, estadoActual, nuevoEstado);
		return guardado;
	}

	/**
	 * Fallback para webhooks de Stripe donde pagoId no está en metadata.
	 * Busca el pago por reservaId y delega en actualizarEstado.
	 */
	public Pago actualizarEstadoPorReserva(Long reservaId, EstadoPago nuevoEstado) {
		Pago pago = pagoRepository.findByReservaId(reservaId)
				.orElseThrow(() -> new PagoNotFoundException(reservaId));
		return actualizarEstado(pago.getId(), nuevoEstado);
	}

	public Pago obtenerPorReserva(Long reservaId, Usuario usuario) {
		Pago pago = pagoRepository.findByReservaId(reservaId)
				.orElseThrow(() -> new PagoNotFoundException(reservaId));

		Usuario cliente     = pago.getReserva().getCliente();
		Usuario profesional = pago.getReserva().getServicio().getProfesional().getUsuario();

		if (!cliente.getId().equals(usuario.getId()) && !profesional.getId().equals(usuario.getId())) {
			log.warn("Usuario {} intentó acceder al pago de reserva {} sin permisos", usuario.getId(), reservaId);
			throw new IllegalArgumentException("No tienes acceso a este pago");
		}

		return pago;
	}

	private void validarAccesoPago(Pago pago, Usuario usuario) {
		if (usuario == null) {
			throw new PagoInvalidoException("No tienes acceso a este pago");
		}
		if (Rol.ADMIN.equals(usuario.getRol())) {
			return;
		}

		Usuario cliente = pago.getReserva().getCliente();
		Usuario profesional = pago.getReserva().getServicio().getProfesional().getUsuario();

		if (!cliente.getId().equals(usuario.getId()) && !profesional.getId().equals(usuario.getId())) {
			log.warn("Usuario {} intentó acceder al pago {} sin permisos", usuario.getId(), pago.getId());
			throw new PagoInvalidoException("No tienes acceso a este pago");
		}
	}
}
