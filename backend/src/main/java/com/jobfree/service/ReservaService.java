package com.jobfree.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.jobfree.exception.pago.PagoInvalidoException;
import com.jobfree.exception.reserva.ReservaInvalidaException;
import com.jobfree.exception.reserva.ReservaNotFoundException;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.EstadoPago;
import com.jobfree.model.enums.EstadoReserva;
import com.jobfree.repository.ReservaRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ReservaService {

	private static final Logger log = LoggerFactory.getLogger(ReservaService.class);

	private final ReservaRepository   reservaRepository;
	private final ConversacionService conversacionService;
	private final NotificacionService notificacionService;
	private final PagoService         pagoService;
	private final StripeService       stripeService;
	private final MonederoService     monederoService;

	public ReservaService(ReservaRepository reservaRepository,
	                      ConversacionService conversacionService,
	                      NotificacionService notificacionService,
	                      PagoService pagoService,
	                      StripeService stripeService,
	                      MonederoService monederoService) {
		this.reservaRepository   = reservaRepository;
		this.conversacionService = conversacionService;
		this.notificacionService = notificacionService;
		this.pagoService         = pagoService;
		this.stripeService       = stripeService;
		this.monederoService     = monederoService;
	}

	public List<Reserva> listarReservas() {
		return reservaRepository.findAllWithDetails();
	}

	public Reserva obtenerPorId(Long id) {
		return reservaRepository.findByIdWithDetails(id)
				.orElseThrow(() -> new ReservaNotFoundException(id));
	}

	public Reserva obtenerPorIdSeguro(Long id, Usuario usuario) {
		Reserva reserva = obtenerPorId(id);

		Long clienteId     = reserva.getCliente().getId();
		Long profesionalId = reserva.getServicio().getProfesional().getUsuario().getId();

		if (!usuario.getId().equals(clienteId) && !usuario.getId().equals(profesionalId)) {
			throw new ReservaInvalidaException("No tienes acceso a esta reserva");
		}

		return reserva;
	}

	/** Reservas del cliente autenticado */
	public List<Reserva> misReservas(Usuario cliente) {
		return reservaRepository.findByClienteIdOrderByFechaCreacionDesc(cliente.getId());
	}

	/** Solicitudes recibidas por el profesional autenticado */
	public List<Reserva> misSolicitudes(Usuario profesional) {
		return reservaRepository.findByServicioProfesionalUsuarioIdOrderByFechaCreacionDesc(profesional.getId());
	}

	public Reserva crearReserva(Reserva reserva) {
		return crearReserva(reserva, null);
	}

	public Reserva crearReserva(Reserva reserva, BigDecimal precioHoraPersonalizado) {
		validarReserva(reserva);

		ServicioOfrecido servicio = reserva.getServicio();
		validarServicio(servicio);
		validarFecha(reserva);

		if (reservaRepository.existsByServicioAndFechaInicio(reserva.getServicio(), reserva.getFechaInicio())) {
			throw new ReservaInvalidaException("Ya existe una reserva para este servicio en esa fecha");
		}

		reserva.setEstado(EstadoReserva.PENDIENTE);

		BigDecimal horas = BigDecimal.valueOf(servicio.getDuracionMin())
				.divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

		if (horas.compareTo(BigDecimal.ONE) < 0) {
			horas = BigDecimal.ONE;
		}

		BigDecimal precioHora = (precioHoraPersonalizado != null && precioHoraPersonalizado.compareTo(BigDecimal.ZERO) > 0)
				? precioHoraPersonalizado
				: servicio.getPrecioHora();

		reserva.setPrecioTotal(
				precioHora.multiply(horas).setScale(2, RoundingMode.HALF_UP));

		Reserva guardada = reservaRepository.save(reserva);
		log.info("Reserva {} creada por cliente {} para servicio {}", guardada.getId(), reserva.getCliente().getId(), servicio.getId());
		conversacionService.obtenerOCrearPorReserva(guardada);

		// Avisar al profesional de la nueva solicitud
		Usuario profesional = servicio.getProfesional().getUsuario();
		notificacionService.crear(
				"Nueva solicitud de " + guardada.getCliente().getNombre() +
				" para el servicio «" + servicio.getTitulo() + "».",
				profesional
		);

		return guardada;
	}

	/** Solo el profesional puede confirmar/aceptar */
	public Reserva confirmarReserva(Reserva reserva, Usuario usuario) {
		Long profesionalId = reserva.getServicio().getProfesional().getUsuario().getId();
		if (!usuario.getId().equals(profesionalId)) {
			throw new ReservaInvalidaException("Solo el profesional puede aceptar una solicitud");
		}

		if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
			throw new ReservaInvalidaException("Solo se pueden confirmar reservas pendientes");
		}

		reserva.setEstado(EstadoReserva.CONFIRMADA);
		Reserva guardada = reservaRepository.save(reserva);
		log.info("Reserva {} confirmada por profesional {}", guardada.getId(), usuario.getId());

		notificacionService.crear(
				"Tu solicitud para «" + guardada.getServicio().getTitulo() + "» ha sido aceptada.",
				guardada.getCliente()
		);

		return guardada;
	}

	/** El profesional puede rechazar; usa el estado CANCELADA */
	public Reserva rechazarReserva(Reserva reserva, Usuario usuario) {
		Long profesionalId = reserva.getServicio().getProfesional().getUsuario().getId();
		if (!usuario.getId().equals(profesionalId)) {
			throw new ReservaInvalidaException("Solo el profesional puede rechazar una solicitud");
		}

		if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
			throw new ReservaInvalidaException("Solo se pueden rechazar reservas pendientes");
		}

		reserva.setEstado(EstadoReserva.CANCELADA);
		Reserva guardada = reservaRepository.save(reserva);

		notificacionService.crear(
				"Tu solicitud para «" + guardada.getServicio().getTitulo() + "» fue rechazada por el profesional.",
				guardada.getCliente()
		);

		return guardada;
	}

	public Reserva cancelarReserva(Reserva reserva) {
		if (reserva.getEstado() == EstadoReserva.COMPLETADA) {
			throw new ReservaInvalidaException("No se puede cancelar una reserva completada");
		}
		if (reserva.getEstado() == EstadoReserva.CANCELADA) {
			throw new ReservaInvalidaException("La reserva ya está cancelada");
		}

		// Si el pago está confirmado, acreditar el importe en el monedero del cliente
		pagoService.buscarPorReservaId(reserva.getId()).ifPresent(pago -> {
			if (pago.getEstado() == EstadoPago.PAGADO) {
				String concepto = "Reembolso: " + reserva.getServicio().getTitulo();
				monederoService.acreditar(reserva.getCliente(), pago.getImporte(), concepto);
				pagoService.actualizarEstado(pago.getId(), EstadoPago.REEMBOLSADO);
				log.info("Reembolso de {} € acreditado en monedero del cliente {} al cancelar reserva {}",
						pago.getImporte(), reserva.getCliente().getId(), reserva.getId());
			}
		});

		reserva.setEstado(EstadoReserva.CANCELADA);
		Reserva guardada = reservaRepository.save(reserva);

		notificacionService.crear(
				"Tu reserva de «" + guardada.getServicio().getTitulo() + "» ha sido cancelada.",
				guardada.getCliente()
		);
		notificacionService.crear(
				"La reserva de «" + guardada.getServicio().getTitulo() + "» ha sido cancelada.",
				guardada.getServicio().getProfesional().getUsuario()
		);

		return guardada;
	}

	public Reserva actualizarProgreso(Reserva reserva, int progreso, String notas, Usuario usuario) {
		Long profesionalId = reserva.getServicio().getProfesional().getUsuario().getId();
		if (!usuario.getId().equals(profesionalId)) {
			throw new ReservaInvalidaException("Solo el profesional puede actualizar el progreso");
		}
		if (reserva.getEstado() != EstadoReserva.CONFIRMADA) {
			throw new ReservaInvalidaException("Solo se puede actualizar el progreso de reservas confirmadas");
		}
		reserva.setProgreso(progreso);
		if (notas != null) {
			reserva.setNotasProgreso(notas);
		}
		Reserva guardada = reservaRepository.save(reserva);
		if (progreso == 50 || progreso == 100) {
			notificacionService.crear(
					"El profesional ha actualizado el progreso de «" + guardada.getServicio().getTitulo() +
					"» al " + guardada.getProgreso() + "%.",
					guardada.getCliente()
			);
		}
		return guardada;
	}

	/** El profesional marca el trabajo como completado */
	public Reserva completarReserva(Reserva reserva, Usuario usuario) {
		Long profesionalId = reserva.getServicio().getProfesional().getUsuario().getId();
		if (!usuario.getId().equals(profesionalId)) {
			throw new ReservaInvalidaException("Solo el profesional puede marcar el trabajo como completado");
		}

		if (reserva.getEstado() != EstadoReserva.CONFIRMADA) {
			throw new ReservaInvalidaException("Solo se pueden completar reservas confirmadas");
		}

		if (reserva.getPago() == null || reserva.getPago().getEstado() != EstadoPago.PAGADO) {
			throw new ReservaInvalidaException("Solo se pueden completar reservas pagadas");
		}

		reserva.setProgreso(100);
		reserva.setEstado(EstadoReserva.COMPLETADA);
		Reserva guardada = reservaRepository.save(reserva);

		// Acreditar el importe al monedero del profesional
		Usuario profesionalUsuario = guardada.getServicio().getProfesional().getUsuario();
		String concepto = "Cobro por: " + guardada.getServicio().getTitulo();
		monederoService.acreditar(profesionalUsuario, guardada.getPrecioTotal(), concepto);
		log.info("Cobro de {} € acreditado en monedero del profesional {} al completar reserva {}",
				guardada.getPrecioTotal(), profesionalUsuario.getId(), guardada.getId());

		notificacionService.crear(
				"El profesional ha marcado «" + guardada.getServicio().getTitulo() +
				"» como completado. ¡Deja tu valoración!",
				guardada.getCliente()
		);

		return guardada;
	}

	public Reserva completarReservaAdmin(Reserva reserva) {
		if (reserva.getEstado() != EstadoReserva.CONFIRMADA) {
			throw new ReservaInvalidaException("Solo se pueden completar reservas confirmadas");
		}
		if (reserva.getPago() == null || reserva.getPago().getEstado() != EstadoPago.PAGADO) {
			throw new ReservaInvalidaException("Solo se pueden completar reservas pagadas");
		}
		reserva.setEstado(EstadoReserva.COMPLETADA);
		Reserva guardada = reservaRepository.save(reserva);

		Usuario profesionalUsuario = guardada.getServicio().getProfesional().getUsuario();
		monederoService.acreditar(profesionalUsuario, guardada.getPrecioTotal(), "Cobro por: " + guardada.getServicio().getTitulo());

		notificacionService.crear(
				"El administrador ha marcado «" + guardada.getServicio().getTitulo() + "» como completado. ¡Deja tu valoración!",
				guardada.getCliente()
		);
		return guardada;
	}

	public void eliminarReserva(Reserva reserva) {
		reservaRepository.delete(reserva);
	}

	private void validarReserva(Reserva reserva) {
		if (reserva.getCliente() == null) {
			throw new ReservaInvalidaException("El cliente es obligatorio");
		}
		if (reserva.getServicio() == null) {
			throw new ReservaInvalidaException("El servicio es obligatorio");
		}
	}

	private void validarServicio(ServicioOfrecido servicio) {
		if (servicio == null) {
			throw new ReservaInvalidaException("El servicio es obligatorio");
		}
		if (!servicio.isActiva()) {
			throw new ReservaInvalidaException("El servicio no está disponible");
		}
		if (servicio.getDuracionMin() == null || servicio.getDuracionMin() <= 0) {
			throw new ReservaInvalidaException("Duración del servicio no válida");
		}
		if (servicio.getPrecioHora() == null || servicio.getPrecioHora().compareTo(BigDecimal.ZERO) <= 0) {
			throw new ReservaInvalidaException("Precio del servicio no válido");
		}
	}

	private void validarFecha(Reserva reserva) {
		LocalDateTime ahora = LocalDateTime.now();
		if (reserva.getFechaInicio() == null) {
			reserva.setFechaInicio(ahora);
		} else if (reserva.getFechaInicio().isBefore(ahora)) {
			throw new ReservaInvalidaException("La fecha no puede ser pasada");
		}
	}
}
