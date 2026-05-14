package com.jobfree.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Plan;
import com.jobfree.repository.ProfesionalInfoRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import com.stripe.model.SubscriptionCollection;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerSearchParams;
import com.stripe.param.SubscriptionCancelParams;
import com.stripe.param.SubscriptionListParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.model.checkout.Session;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class SuscripcionService {

    private static final Logger log = LoggerFactory.getLogger(SuscripcionService.class);

    private final ProfesionalInfoRepository profesionalInfoRepository;

    @Value("${stripe.precio.pro.mensual:}")
    private String precioProfesionalMensual;

    @Value("${stripe.precio.pro.anual:}")
    private String precioProfesionalAnual;

    @Value("${stripe.precio.premium.mensual:}")
    private String precioPremiumMensual;

    @Value("${stripe.precio.premium.anual:}")
    private String precioPremiumAnual;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public SuscripcionService(ProfesionalInfoRepository profesionalInfoRepository) {
        this.profesionalInfoRepository = profesionalInfoRepository;
    }

    public Map<String, String> crearCheckoutSession(String planStr, String periodicidad, Usuario usuario) {
        ProfesionalInfo perfil = profesionalInfoRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Perfil profesional no encontrado"));

        String priceId = resolverPrecioId(planStr, periodicidad);
        if (priceId == null || priceId.isBlank()) {
            throw new RuntimeException("El plan o periodicidad indicados no están configurados");
        }

        try {
            String customerId = obtenerOCrearCustomer(perfil, usuario);

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                    .setCustomer(customerId)
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setPrice(priceId)
                            .setQuantity(1L)
                            .build())
                    .setSuccessUrl(frontendUrl + "/dashboard/profesional/plan?success=true")
                    .setCancelUrl(frontendUrl + "/dashboard/profesional/plan?cancelled=true")
                    .putMetadata("profesionalId", String.valueOf(perfil.getId()))
                    .putMetadata("plan", planStr.toUpperCase())
                    .build();

            Session session = Session.create(params);
            log.info("Checkout session creada: {} para profesional {}", session.getId(), perfil.getId());
            return Map.of("checkoutUrl", session.getUrl());
        } catch (StripeException e) {
            log.error("Error creando checkout session para profesional {}: {}", perfil.getId(), e.getMessage());
            throw new RuntimeException("Error al iniciar el pago con Stripe: " + e.getMessage(), e);
        }
    }

    public void cancelarSuscripcion(Usuario usuario) {
        ProfesionalInfo perfil = profesionalInfoRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Perfil profesional no encontrado"));

        String subscriptionId = perfil.getStripeSubscriptionId();
        if (subscriptionId == null || subscriptionId.isBlank()) {
            throw new RuntimeException("No tienes una suscripción activa");
        }

        try {
            Subscription subscription = Subscription.retrieve(subscriptionId);
            subscription.cancel(SubscriptionCancelParams.builder().build());
            perfil.setPlan(Plan.BASICO);
            perfil.setStripeSubscriptionId(null);
            profesionalInfoRepository.save(perfil);
            log.info("Suscripción {} cancelada para profesional {}", subscriptionId, perfil.getId());
        } catch (StripeException e) {
            log.error("Error cancelando suscripción {} para profesional {}: {}", subscriptionId, perfil.getId(), e.getMessage());
            throw new RuntimeException("Error al cancelar la suscripción: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> obtenerEstado(Usuario usuario) {
        ProfesionalInfo perfil = profesionalInfoRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Perfil profesional no encontrado"));

        return Map.of(
                "plan", perfil.getPlan().name(),
                "tieneStripeSubscription", perfil.getStripeSubscriptionId() != null && !perfil.getStripeSubscriptionId().isBlank()
        );
    }

    public Map<String, Object> verificarYSincronizar(Usuario usuario) {
        ProfesionalInfo perfil = profesionalInfoRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Perfil profesional no encontrado"));

        if (perfil.getStripeCustomerId() == null || perfil.getStripeCustomerId().isBlank()) {
            return obtenerEstado(usuario);
        }

        try {
            SubscriptionCollection subs = Subscription.list(
                    SubscriptionListParams.builder()
                            .setCustomer(perfil.getStripeCustomerId())
                            .setStatus(SubscriptionListParams.Status.ACTIVE)
                            .setLimit(1L)
                            .build());

            if (!subs.getData().isEmpty()) {
                Subscription sub = subs.getData().get(0);
                String priceId = sub.getItems().getData().get(0).getPrice().getId();
                Plan plan = resolverPlanDesdePrecio(priceId);
                if (plan != null) {
                    perfil.setPlan(plan);
                    perfil.setStripeSubscriptionId(sub.getId());
                    profesionalInfoRepository.save(perfil);
                    log.info("Plan sincronizado desde Stripe: profesional {} → {}", perfil.getId(), plan);
                }
            }
        } catch (StripeException e) {
            log.warn("No se pudo verificar suscripción para profesional {}: {}", perfil.getId(), e.getMessage());
        }

        return obtenerEstado(usuario);
    }

    private Plan resolverPlanDesdePrecio(String priceId) {
        if (priceId == null) return null;
        if (priceId.equals(precioProfesionalMensual) || priceId.equals(precioProfesionalAnual)) return Plan.PRO;
        if (priceId.equals(precioPremiumMensual) || priceId.equals(precioPremiumAnual)) return Plan.PREMIUM;
        return null;
    }

    private String obtenerOCrearCustomer(ProfesionalInfo perfil, Usuario usuario) throws StripeException {
        if (perfil.getStripeCustomerId() != null && !perfil.getStripeCustomerId().isBlank()) {
            return perfil.getStripeCustomerId();
        }

        // Buscar por email en Stripe antes de crear uno nuevo
        CustomerSearchParams searchParams = CustomerSearchParams.builder()
                .setQuery("email:'" + usuario.getEmail() + "'")
                .build();
        var resultados = Customer.search(searchParams);
        if (!resultados.getData().isEmpty()) {
            String existingId = resultados.getData().get(0).getId();
            perfil.setStripeCustomerId(existingId);
            profesionalInfoRepository.save(perfil);
            return existingId;
        }

        CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(usuario.getEmail())
                .setName(usuario.getNombreCompleto())
                .putMetadata("profesionalId", String.valueOf(perfil.getId()))
                .build();
        Customer customer = Customer.create(params);
        perfil.setStripeCustomerId(customer.getId());
        profesionalInfoRepository.save(perfil);
        log.info("Stripe Customer {} creado para profesional {}", customer.getId(), perfil.getId());
        return customer.getId();
    }

    private String resolverPrecioId(String plan, String periodicidad) {
        boolean anual = "anual".equalsIgnoreCase(periodicidad);
        return switch (plan.toUpperCase()) {
            case "PRO" -> anual ? precioProfesionalAnual : precioProfesionalMensual;
            case "PREMIUM" -> anual ? precioPremiumAnual : precioPremiumMensual;
            default -> null;
        };
    }
}
