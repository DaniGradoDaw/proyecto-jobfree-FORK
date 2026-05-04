package com.jobfree.security;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Limita intentos por minuto por IP en endpoints sensibles de autenticación.
 * Configurable con rate.limit.max-peticiones-por-minuto (por defecto 10).
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    // Solo rutas con método específico — evita limitar GETs de listado
    private static final Set<String> RUTAS_LIMITADAS = Set.of(
            "/auth/login",
            "/auth/forgot-password",
            "/auth/reset-password",
            "/usuarios/cliente",
            "/usuarios/profesional"
    );

    // Estas solo se limitan si el método es POST o PATCH
    private static final Set<String> RUTAS_ESCRITURA_LIMITADAS = Set.of(
            "/reservas",
            "/pagos"
    );

    @Value("${rate.limit.max-peticiones-por-minuto:10}")
    private int maxPeticionesPorMinuto;

    @Value("${rate.limit.confiar-x-forwarded-for:false}")
    private boolean confiarXForwardedFor;

    private final Map<String, BucketEntry> buckets = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if (RUTAS_LIMITADAS.stream().anyMatch(path::startsWith)) {
            return false;
        }

        boolean esEscritura = "POST".equalsIgnoreCase(method) || "PATCH".equalsIgnoreCase(method);
        if (esEscritura && RUTAS_ESCRITURA_LIMITADAS.stream().anyMatch(path::startsWith)) {
            return false;
        }

        return true;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String ip = obtenerIp(request);
        String clave = ip + ":" + request.getRequestURI();

        limpiarBucketsInactivos();
        BucketEntry entry = buckets.computeIfAbsent(clave, k -> new BucketEntry(crearBucket()));
        entry.actualizarUso();

        if (entry.bucket().tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"status\":429,\"error\":\"Demasiados intentos. Espera un minuto.\"}");
        }
    }

    private String obtenerIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (confiarXForwardedFor && forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private Bucket crearBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(maxPeticionesPorMinuto)
                        .refillGreedy(maxPeticionesPorMinuto, Duration.ofMinutes(1))
                .build())
                .build();
    }

    private void limpiarBucketsInactivos() {
        Instant limite = Instant.now().minus(Duration.ofMinutes(10));
        buckets.entrySet().removeIf(entry -> entry.getValue().ultimoUso().isBefore(limite));
    }

    private static class BucketEntry {
        private final Bucket bucket;
        private volatile Instant ultimoUso;

        BucketEntry(Bucket bucket) {
            this.bucket = bucket;
            this.ultimoUso = Instant.now();
        }

        Bucket bucket() {
            return bucket;
        }

        Instant ultimoUso() {
            return ultimoUso;
        }

        void actualizarUso() {
            ultimoUso = Instant.now();
        }
    }
}
