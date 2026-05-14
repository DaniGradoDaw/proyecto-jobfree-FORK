package com.jobfree.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.model.entity.Usuario;
import com.jobfree.service.SuscripcionService;

@RestController
@RequestMapping("/suscripciones")
public class SuscripcionController {

    private final SuscripcionService suscripcionService;

    public SuscripcionController(SuscripcionService suscripcionService) {
        this.suscripcionService = suscripcionService;
    }

    @PreAuthorize("hasRole('PROFESIONAL')")
    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> crearCheckout(@RequestBody Map<String, String> body) {
        String plan = body.get("plan");
        String periodicidad = body.get("periodicidad");
        if (plan == null || periodicidad == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "plan y periodicidad son obligatorios"));
        }
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(suscripcionService.crearCheckoutSession(plan, periodicidad, usuario));
    }

    @PreAuthorize("hasRole('PROFESIONAL')")
    @PostMapping("/cancelar")
    public ResponseEntity<Map<String, String>> cancelar() {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        suscripcionService.cancelarSuscripcion(usuario);
        return ResponseEntity.ok(Map.of("message", "Suscripción cancelada correctamente"));
    }

    @PreAuthorize("hasRole('PROFESIONAL')")
    @GetMapping("/mi-plan")
    public ResponseEntity<Map<String, Object>> miPlan() {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(suscripcionService.obtenerEstado(usuario));
    }

    @PreAuthorize("hasRole('PROFESIONAL')")
    @GetMapping("/verificar")
    public ResponseEntity<Map<String, Object>> verificar() {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(suscripcionService.verificarYSincronizar(usuario));
    }
}
