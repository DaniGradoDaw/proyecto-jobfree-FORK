package com.jobfree.service;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.param.RefundCreateParams;
import com.stripe.net.RequestOptions;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentRetrieveParams;

import jakarta.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Pago;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.enums.EstadoPago;
import com.jobfree.model.enums.Plan;
import com.jobfree.repository.ProfesionalInfoRepository;

import java.math.BigDecimal;

@Service
public class StripeService {

    private static final Logger log = LoggerFactory.getLogger(StripeService.class);

    @Value("${stripe.api.key}")
    private String apiKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    private final PagoService pagoService;
    private final ProfesionalInfoRepository profesionalInfoRepository;

    public StripeService(PagoService pagoService, ProfesionalInfoRepository profesionalInfoRepository) {
        this.pagoService = pagoService;
        this.profesionalInfoRepository = profesionalInfoRepository;
    }

    @PostConstruct
    public void init() {
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

            RequestOptions reqOptions = RequestOptions.builder()
                    .setIdempotencyKey("pago-pi-" + pago.getId())
                    .build();
            PaymentIntent intent = PaymentIntent.create(params, reqOptions);
            log.info("PaymentIntent {} creado para pago {}", intent.getId(), pago.getId());
            pagoService.guardarStripePaymentIntentId(pago.getId(), intent.getId());
            return intent.getClientSecret();
        } catch (StripeException e) {
            log.error("Error creando PaymentIntent para pago {}: {}", pago.getId(), e.getMessage());
            throw new RuntimeException("Error al iniciar el pago con Stripe: " + e.getMessage(), e);
        }
    }

    /**
     * Emite un reembolso completo para el PaymentIntent asociado al pago.
     * Lanza RuntimeException si Stripe rechaza el reembolso.
     */
    public String crearReembolso(Pago pago) {
        String piId = pago.getStripePaymentIntentId();
        if (piId == null || piId.isBlank()) {
            throw new RuntimeException("No hay PaymentIntent asociado al pago #" + pago.getId());
        }
        try {
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(piId)
                    .putMetadata("pagoId",    String.valueOf(pago.getId()))
                    .putMetadata("reservaId", String.valueOf(pago.getReserva().getId()))
                    .build();

            RequestOptions opts = RequestOptions.builder()
                    .setIdempotencyKey("reembolso-" + pago.getId())
                    .build();

            Refund refund = Refund.create(params, opts);
            log.info("Reembolso {} creado para pago {} — PaymentIntent {}", refund.getId(), pago.getId(), piId);
            return refund.getId();
        } catch (StripeException e) {
            log.error("Error creando reembolso para pago {}: {}", pago.getId(), e.getMessage());
            throw new RuntimeException("Error al procesar el reembolso con Stripe: " + e.getMessage(), e);
        }
    }

    /**
     * Crea un PaymentIntent para recargar el monedero del usuario.
     * Devuelve un mapa con clientSecret y paymentIntentId.
     */
    public java.util.Map<String, String> crearPaymentIntentRecarga(BigDecimal importe, Long usuarioId) {
        long importeCentavos = importe.multiply(BigDecimal.valueOf(100)).longValue();
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(importeCentavos)
                    .setCurrency("eur")
                    .putMetadata("tipo", "RECARGA_MONEDERO")
                    .putMetadata("usuarioId", String.valueOf(usuarioId))
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true).build())
                    .build();
            PaymentIntent intent = PaymentIntent.create(params);
            log.info("PaymentIntent recarga {} creado para usuario {}", intent.getId(), usuarioId);
            return java.util.Map.of("clientSecret", intent.getClientSecret(), "paymentIntentId", intent.getId());
        } catch (StripeException e) {
            log.error("Error creando PaymentIntent de recarga para usuario {}: {}", usuarioId, e.getMessage());
            throw new RuntimeException("Error al iniciar la recarga con Stripe: " + e.getMessage(), e);
        }
    }

    /**
     * Comprueba con la API de Stripe si el PaymentIntent ha sido completado con éxito.
     * Usado como fallback cuando el webhook no ha procesado el evento todavía.
     */
    public boolean verificarPaymentIntentExitoso(String piId) {
        try {
            PaymentIntent intent = PaymentIntent.retrieve(piId, PaymentIntentRetrieveParams.builder().build(), null);
            boolean exitoso = "succeeded".equals(intent.getStatus());
            log.info("Verificación directa PaymentIntent {}: status={}", piId, intent.getStatus());
            return exitoso;
        } catch (StripeException e) {
            log.error("Error verificando PaymentIntent {}: {}", piId, e.getMessage());
            return false;
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
            case "checkout.session.completed" -> manejarCheckoutCompletado(event);
            case "customer.subscription.deleted" -> manejarSuscripcionEliminada(event);
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

    private void manejarCheckoutCompletado(Event event) {
        Session session = (Session) event.getDataObjectDeserializer().getObject()
                .orElseThrow(() -> new RuntimeException("No se pudo deserializar la sesión del webhook — eventId=" + event.getId()));

        String mode = session.getMode();
        if (!"subscription".equals(mode)) {
            return; // solo nos interesan checkout de suscripción aquí
        }

        String profesionalIdStr = session.getMetadata().get("profesionalId");
        String planStr = session.getMetadata().get("plan");
        String subscriptionId = session.getSubscription();

        if (profesionalIdStr == null || planStr == null) {
            log.error("Webhook checkout.session.completed sin metadata profesionalId/plan — sessionId={}", session.getId());
            return;
        }

        Long profesionalId = Long.parseLong(profesionalIdStr);
        profesionalInfoRepository.findById(profesionalId).ifPresent(perfil -> {
            try {
                Plan plan = Plan.valueOf(planStr);
                perfil.setPlan(plan);
                perfil.setStripeSubscriptionId(subscriptionId);
                if (perfil.getStripeCustomerId() == null && session.getCustomer() != null) {
                    perfil.setStripeCustomerId(session.getCustomer());
                }
                profesionalInfoRepository.save(perfil);
                log.info("Profesional {} actualizado a plan {} vía checkout — subscriptionId={}", profesionalId, plan, subscriptionId);
            } catch (IllegalArgumentException e) {
                log.error("Plan desconocido '{}' en metadata del webhook — profesionalId={}", planStr, profesionalId);
            }
        });
    }

    private void manejarSuscripcionEliminada(Event event) {
        Subscription subscription = (Subscription) event.getDataObjectDeserializer().getObject()
                .orElseThrow(() -> new RuntimeException("No se pudo deserializar la suscripción del webhook — eventId=" + event.getId()));

        String subscriptionId = subscription.getId();
        profesionalInfoRepository.findByStripeSubscriptionId(subscriptionId).ifPresent(perfil -> {
            perfil.setPlan(Plan.BASICO);
            perfil.setStripeSubscriptionId(null);
            profesionalInfoRepository.save(perfil);
            log.info("Suscripción {} eliminada — profesional {} revertido a BASICO", subscriptionId, perfil.getId());
        });
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
