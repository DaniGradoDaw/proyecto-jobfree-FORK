package com.jobfree.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.monedero.MonederoDTO;
import com.jobfree.dto.monedero.MovimientoMonederoDTO;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.MonederoService;
import com.jobfree.service.StripeService;

@RestController
@RequestMapping("/monedero")
public class MonederoController {

    private final MonederoService monederoService;
    private final StripeService   stripeService;

    public MonederoController(MonederoService monederoService, StripeService stripeService) {
        this.monederoService = monederoService;
        this.stripeService   = stripeService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<MonederoDTO> obtenerMonedero() {
        Usuario usuario = getUsuarioAutenticado();
        var monedero = monederoService.obtenerOCrear(usuario);
        return ResponseEntity.ok(new MonederoDTO(monedero.getId(), monedero.getSaldo()));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/movimientos")
    public ResponseEntity<List<MovimientoMonederoDTO>> listarMovimientos() {
        Usuario usuario = getUsuarioAutenticado();
        List<MovimientoMonederoDTO> dtos = monederoService.listarMovimientos(usuario).stream()
                .map(m -> new MovimientoMonederoDTO(
                        m.getId(),
                        m.getTipo().name(),
                        m.getConcepto(),
                        m.getImporte(),
                        m.getFecha()))
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /** Crea un PaymentIntent de Stripe para recargar el monedero. */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/recargar")
    public ResponseEntity<Map<String, String>> iniciarRecarga(@RequestBody Map<String, Object> body) {
        Usuario usuario = getUsuarioAutenticado();
        BigDecimal importe = new BigDecimal(body.get("importe").toString());
        if (importe.compareTo(BigDecimal.ONE) < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "El importe mínimo es 1 €"));
        }
        Map<String, String> resultado = stripeService.crearPaymentIntentRecarga(importe, usuario.getId());
        return ResponseEntity.ok(resultado);
    }

    /** Verifica con Stripe que el pago se completó y acredita el saldo. */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/confirmar-recarga/{piId}")
    public ResponseEntity<MonederoDTO> confirmarRecarga(@PathVariable String piId,
                                                        @RequestBody Map<String, Object> body) {
        Usuario usuario = getUsuarioAutenticado();
        if (!stripeService.verificarPaymentIntentExitoso(piId)) {
            return ResponseEntity.badRequest().body(null);
        }
        BigDecimal importe = new BigDecimal(body.get("importe").toString());
        var monedero = monederoService.acreditar(usuario, importe, "Recarga de monedero");
        return ResponseEntity.ok(new MonederoDTO(monedero.getId(), monedero.getSaldo()));
    }

    /** Devuelve los datos bancarios guardados (IBAN + titular). */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/cuenta-bancaria")
    public ResponseEntity<Map<String, String>> getCuentaBancaria() {
        Usuario usuario = getUsuarioAutenticado();
        var monedero = monederoService.obtenerOCrear(usuario);
        if (monedero.getIban() == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(Map.of(
                "iban",    monedero.getIban(),
                "titular", monedero.getTitular() != null ? monedero.getTitular() : ""
        ));
    }

    /** Retira saldo del monedero a la cuenta bancaria configurada. */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/retirar")
    public ResponseEntity<MonederoDTO> retirar(@RequestBody Map<String, Object> body) {
        Usuario usuario = getUsuarioAutenticado();
        BigDecimal importe = new BigDecimal(body.get("importe").toString());
        var monedero = monederoService.retirar(usuario, importe);
        return ResponseEntity.ok(new MonederoDTO(monedero.getId(), monedero.getSaldo()));
    }

    /** Guarda o actualiza el IBAN y titular del monedero. */
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/cuenta-bancaria")
    public ResponseEntity<Void> saveCuentaBancaria(@RequestBody Map<String, String> body) {
        Usuario usuario = getUsuarioAutenticado();
        String iban    = body.getOrDefault("iban", "").toUpperCase().replaceAll("\\s+", "");
        String titular = body.getOrDefault("titular", "");
        if (iban.length() < 15 || iban.length() > 34) {
            return ResponseEntity.badRequest().build();
        }
        monederoService.guardarCuentaBancaria(usuario, iban, titular);
        return ResponseEntity.ok().build();
    }

    private Usuario getUsuarioAutenticado() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
