package com.jobfree.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.pago.PagoCreateDTO;
import com.jobfree.dto.pago.PagoDTO;
import com.jobfree.mapper.PagoMapper;
import com.jobfree.model.entity.Pago;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.EstadoPago;
import com.jobfree.service.PagoService;
import com.jobfree.service.ReservaService;
import com.jobfree.service.StripeService;
import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/pagos")
public class PagoController {

	private final PagoService pagoService;
	private final ReservaService reservaService;
	private final StripeService stripeService;

	public PagoController(PagoService pagoService, ReservaService reservaService, StripeService stripeService) {
		this.pagoService = pagoService;
		this.reservaService = reservaService;
		this.stripeService = stripeService;
	}

	/**
	 * Obtiene todos los pagos del sistema (solo ADMIN).
	 *
	 * @return lista de pagos en formato DTO
	 */
	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public ResponseEntity<List<PagoDTO>> listarPagos() {
		List<PagoDTO> dtos = pagoService.listarPagos().stream().map(PagoMapper::toDTO).toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Obtiene un pago por su identificador.
	 *
	 * @param id identificador del pago
	 * @return pago encontrado en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/{id}")
	public ResponseEntity<PagoDTO> obtenerPorId(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		return ResponseEntity.ok(PagoMapper.toDTO(pagoService.obtenerPorIdSeguro(id, usuario)));
	}

	/**
	 * Obtiene el pago asociado a una reserva si el usuario autenticado tiene acceso
	 * a dicha reserva.
	 *
	 * @param reservaId identificador de la reserva
	 * @return pago encontrado en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/reservas/{reservaId}")
	public ResponseEntity<PagoDTO> obtenerPorReserva(@PathVariable Long reservaId) {

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		return ResponseEntity.ok(PagoMapper.toDTO(pagoService.obtenerPorReserva(reservaId, usuario)));
	}

	/**
	 * Confirma un pago pendiente, cambiando su estado a PAGADO.
	 *
	 * @param id identificador del pago
	 * @return pago actualizado en formato DTO
	 */
	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/{id}/confirmar")
	public ResponseEntity<PagoDTO> confirmarPago(@PathVariable Long id) {
		return ResponseEntity.ok(PagoMapper.toDTO(pagoService.confirmarPagoManualAdmin(id)));
	}

	/**
	 * Crea un pago en estado PENDIENTE. En un entorno real, este endpoint
	 * representaría la creación de una intención de pago (payment intent).
	 *
	 * @param dto datos necesarios para crear el pago
	 * @return pago creado en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@PostMapping
	public ResponseEntity<PagoDTO> crearPago(@Valid @RequestBody PagoCreateDTO dto) {
		Usuario usuario = getUsuarioAutenticado();

		Reserva reserva = reservaService.obtenerPorIdSeguro(dto.getReservaId(), usuario);

		Pago nuevo = pagoService.guardarPago(PagoMapper.toEntity(dto, reserva), usuario);

		return ResponseEntity.status(HttpStatus.CREATED).body(PagoMapper.toDTO(nuevo));
	}

	/**
	 * Crea un PaymentIntent de Stripe y devuelve el client_secret al frontend
	 * para que complete el pago con Stripe Elements / Stripe.js.
	 *
	 * @param id identificador del pago ya creado en el sistema
	 * @return client_secret de Stripe
	 */
	@PreAuthorize("isAuthenticated()")
	@PostMapping("/{id}/stripe/payment-intent")
	public ResponseEntity<Map<String, String>> crearPaymentIntent(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		Pago pago = pagoService.obtenerParaPaymentIntent(id, usuario);
		String clientSecret = stripeService.crearPaymentIntent(pago);
		// Detectar si el PI ya fue completado (reload tras pago, webhook no procesado aún)
		String piId = pagoService.obtenerPorId(id).getStripePaymentIntentId();
		if (piId != null && stripeService.verificarPaymentIntentExitoso(piId)) {
			pagoService.actualizarEstado(id, EstadoPago.PAGADO);
			return ResponseEntity.ok(Map.of("clientSecret", clientSecret, "yaPagado", "true"));
		}
		return ResponseEntity.ok(Map.of("clientSecret", clientSecret, "yaPagado", "false"));
	}

	/**
	 * Confirmación directa del pago tras el éxito en Stripe.js.
	 * Verifica con la API de Stripe que el PaymentIntent está en estado "succeeded"
	 * antes de marcar el pago como PAGADO en la BD. Actúa como fallback al webhook.
	 */
	@PreAuthorize("isAuthenticated()")
	@PostMapping("/{id}/confirmar-stripe")
	public ResponseEntity<PagoDTO> confirmarStripe(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		Pago pago = pagoService.obtenerPorIdSeguro(id, usuario);

		if (!pago.getReserva().getCliente().getId().equals(usuario.getId())) {
			throw new IllegalArgumentException("Solo el cliente puede confirmar este pago");
		}
		if (pago.getEstado() == EstadoPago.PAGADO) {
			return ResponseEntity.ok(PagoMapper.toDTO(pago));
		}

		String piId = pago.getStripePaymentIntentId();
		if (piId == null || piId.isBlank()) {
			throw new IllegalArgumentException("No se ha iniciado el proceso de pago con Stripe");
		}
		if (!stripeService.verificarPaymentIntentExitoso(piId)) {
			throw new IllegalArgumentException("El pago no está completado en Stripe");
		}

		Pago pagado = pagoService.actualizarEstado(id, EstadoPago.PAGADO);
		return ResponseEntity.ok(PagoMapper.toDTO(pagado));
	}

	/**
	 * Webhook de Stripe — recibe eventos de pago y actualiza el estado en la BD.
	 * Este endpoint debe estar permitido sin autenticación (JWT) y con la firma de Stripe.
	 *
	 * @param payload   cuerpo raw del webhook
	 * @param sigHeader cabecera Stripe-Signature
	 */
	@PostMapping("/stripe/webhook")
	public ResponseEntity<Void> stripeWebhook(
			@RequestBody String payload,
			@RequestHeader("Stripe-Signature") String sigHeader) {

		stripeService.procesarWebhook(payload, sigHeader);
		return ResponseEntity.ok().build();
	}

	private Usuario getUsuarioAutenticado() {
		return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
}
