package com.jobfree.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.reporte.ReporteCreateDTO;
import com.jobfree.dto.reporte.ReporteDTO;
import com.jobfree.model.entity.Reporte;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.ReporteService;

@RestController
@RequestMapping("/reportes")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<Void> crear(@RequestBody ReporteCreateDTO dto) {
        Usuario usuario = getUsuarioAutenticado();
        reporteService.crearReporte(dto.getReportadoId(), dto.getMensajesJson(), usuario.getId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ReporteDTO>> listar() {
        List<ReporteDTO> dtos = reporteService.listarTodos().stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/resolver")
    public ResponseEntity<ReporteDTO> resolver(@PathVariable Long id) {
        return ResponseEntity.ok(toDTO(reporteService.resolver(id)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        reporteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private ReporteDTO toDTO(Reporte r) {
        return new ReporteDTO(
                r.getId(),
                r.getReportador().getId(),
                r.getReportador().getNombreCompleto(),
                r.getReportador().getFotoUrl(),
                r.getReportado().getId(),
                r.getReportado().getNombreCompleto(),
                r.getReportado().getFotoUrl(),
                r.getMensajesJson(),
                r.isResuelto(),
                r.getFecha(),
                r.getReportado().isActivo()
        );
    }

    private Usuario getUsuarioAutenticado() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
