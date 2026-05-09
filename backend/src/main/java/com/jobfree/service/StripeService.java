package com.jobfree.service;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;

import jakarta.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Pago;
import com.jobfree.model.enums.EstadoPago;

import java.math.BigDecimal;

@Service
public class StripeService {

    private static final Logger log = LoggerFactory.getLogger(StripeService.class);

    @Value("${stripe.api.key}")
    private String apiKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Value("${stripe.simulacion.activa:false}")
    private boolean simulacionActiva;

    private final PagoService pagoService;

    public StripeService(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostConstruct
    public void init() {
        if (simulacionActiva) {
            log.warn("Stripe en MODO SIMULACIÓN — los pagos se confirman sin llamar a Stripe");
            return;
        }
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("STRIPE_SECRET_KEY no está definida — la aplicación no puede arrancar sin ella");
        }
        if (webhookSecret == null || webhookSecret.isBlank()) {
            throw new IllegalStateException("STRIPE_WEBHOOK_SECRET no está definida — la aplicación no puede arrancar sin ella");
        }
        Stripe.apiKey = apiKey;
        log.info("Stripe SDK inicializado");
    }

    /**
     * Crea un PaymentIntent en Stripe para el importe del pago dado.
     * Devuelve el client_secret para que el frontend complete el pago.
     */
    public String crearPaymentIntent(Pago pago) {
        // Stripe opera en centavos (importe × 100)
        long importeCentavos = pago.getImporte()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(importeCentavos)
                    .setCurrency("eur")
                    .putMetadata("pagoId", String.valueOf(pago.getId()))
                    .putMetadata("reservaId", String.valueOf(pago.getReserva().getId()))
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            log.info("PaymentIntent {} creado para pago {}", intent.getId(), pago.getId());
            return intent.getClientSecret();
        } catch (StripeException e) {
            log.error("Error creando PaymentIntent para pago {}: {}", pago.getId(), e.getMessage());
            throw new RuntimeException("Error al iniciar el pago con Stripe: " + e.getMessage(), e);
        }
    }

    /**
     * Procesa el evento enviado por el webhook de Stripe.
     * Actualiza el estado del pago en la BD según el resultado.
     */
    public void procesarWebhook(String payload, String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.warn("Firma de webhook inválida: {}", e.getMessage());
            throw new SecurityException("Firma de webhook inválida");
        }

        log.info("Webhook Stripe recibido: tipo={} eventId={}", event.getType(), event.getId());

        switch (event.getType()) {
            case "payment_intent.succeeded" -> manejarPagoExitoso(event);
            case "payment_intent.payment_failed" -> manejarPagoFallido(event);
            default -> log.debug("Evento Stripe ignorado: tipo={} eventId={}", event.getType(), event.getId());
        }
    }

    private void manejarPagoExitoso(Event event) {
        PaymentIntent intent = deserializarIntent(event);
        String pagoIdStr = intent.getMetadata().get("pagoId");

        if (pagoIdStr != null) {
            Long pagoId = Long.parseLong(pagoIdStr);
            pagoService.actualizarEstado(pagoId, EstadoPago.PAGADO);
            log.info("Pago {} marcado como PAGADO — stripeEventId={} intentId={}", pagoId, event.getId(), intent.getId());
            return;
        }

        // Recuperación por reservaId cuando pagoId no está en la metadata
        String reservaIdStr = intent.getMetadata().get("reservaId");
        if (reservaIdStr != null) {
            Long reservaId = Long.parseLong(reservaIdStr);
            pagoService.actualizarEstadoPorReserva(reservaId, EstadoPago.PAGADO);
            log.warn("Pago marcado PAGADO vía reservaId={} (pagoId ausente en metadata) — intentId={} eventId={}",
                    reservaId, intent.getId(), event.getId());
            return;
        }

        // Sin ningún identificador: no podemos actualizar nada — Stripe reintentará
        log.error("Webhook payment_intent.succeeded sin pagoId ni reservaId en metadata — intentId={} eventId={}",
                intent.getId(), event.getId());
        throw new RuntimeException(
                "Metadata insuficiente en webhook succeeded — el estado del pago no se actualizó. eventId=" + event.getId());
    }

    private void manejarPagoFallido(Event event) {
        PaymentIntent intent = deserializarIntent(event);
        String pagoIdStr = intent.getMetadata().get("pagoId");

        if (pagoIdStr != null) {
            Long pagoId = Long.parseLong(pagoIdStr);
            pagoService.actualizarEstado(pagoId, EstadoPago.PENDIENTE);
            log.warn("Pago {} falló en Stripe — stripeEventId={} intentId={}", pagoId, event.getId(), intent.getId());
            return;
        }

        // Recuperación por reservaId
        String reservaIdStr = intent.getMetadata().get("reservaId");
        if (reservaIdStr != null) {
            Long reservaId = Long.parseLong(reservaIdStr);
            pagoService.actualizarEstadoPorReserva(reservaId, EstadoPago.PENDIENTE);
            log.warn("Pago revertido a PENDIENTE vía reservaId={} (pagoId ausente en metadata) — intentId={} eventId={}",
                    reservaId, intent.getId(), event.getId());
            return;
        }

        log.error("Webhook payment_intent.payment_failed sin pagoId ni reservaId en metadata — intentId={} eventId={}",
                intent.getId(), event.getId());
        throw new RuntimeException(
                "Metadata insuficiente en webhook failed — el estado del pago no se actualizó. eventId=" + event.getId());
    }

    private PaymentIntent deserializarIntent(Event event) {
        return (PaymentIntent) event.getDataObjectDeserializer().getObject()
                .orElseThrow(() -> {
                    log.error("No se pudo deserializar PaymentIntent del webhook — eventId={} tipo={}",
                            event.getId(), event.getType());
                    return new RuntimeException(
                            "No se pudo deserializar el PaymentIntent — eventId=" + event.getId());
                });
    }
}
