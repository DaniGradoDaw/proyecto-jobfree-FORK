package com.jobfree.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.resena.ResenaProfesionalCreateDTO;
import com.jobfree.dto.resena.ResenaProfesionalDTO;
import com.jobfree.mapper.ResenaProfesionalMapper;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.ResenaProfesional;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.ProfesionalInfoService;
import com.jobfree.service.ResenaProfesionalService;
import com.jobfree.service.ReservaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/resenas")
public class ResenaProfesionalController {

    private final ResenaProfesionalService resenaService;
    private final ProfesionalInfoService profesionalService;
    private final ReservaService reservaService;

    public ResenaProfesionalController(ResenaProfesionalService resenaService,
                                       ProfesionalInfoService profesionalService,
                                       ReservaService reservaService) {
        this.resenaService     = resenaService;
        this.profesionalService = profesionalService;
        this.reservaService    = reservaService;
    }

    /** Reseñas recibidas por un profesional (público) */
    @GetMapping("/profesionales/{profesionalId}")
    public ResponseEntity<List<ResenaProfesionalDTO>> listarPorProfesional(@PathVariable Long profesionalId) {
        List<ResenaProfesionalDTO> dtos = resenaService.listarPorProfesional(profesionalId)
                .stream().map(ResenaProfesionalMapper::toDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    /** Media de reseñas de un profesional (público) */
    @GetMapping("/profesionales/{profesionalId}/media")
    public ResponseEntity<Double> obtenerMedia(@PathVariable Long profesionalId) {
        return ResponseEntity.ok(resenaService.obtenerMediaProfesional(profesionalId));
    }

    /** Reseñas escritas por el cliente autenticado */
    @PreAuthorize("hasRole('CLIENTE')")
    @GetMapping("/mias")
    public ResponseEntity<List<ResenaProfesionalDTO>> listarMias() {
        Usuario cliente = getUsuarioAutenticado();
        List<ResenaProfesionalDTO> dtos = resenaService.listarPorCliente(cliente.getId())
                .stream().map(ResenaProfesionalMapper::toDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    /** Crear una reseña (solo CLIENTE) */
    @PreAuthorize("hasRole('CLIENTE')")
    @PostMapping
    public ResponseEntity<ResenaProfesionalDTO> crear(@Valid @RequestBody ResenaProfesionalCreateDTO dto) {
        Usuario cliente = getUsuarioAutenticado();
        ProfesionalInfo profesional = profesionalService.obtenerPorId(dto.getProfesionalId());

        Reserva reserva = null;
        if (dto.getReservaId() != null) {
            reserva = reservaService.obtenerPorIdSeguro(dto.getReservaId(), cliente);
        }

        ResenaProfesional nueva = resenaService.crear(
                reserva != null
                        ? ResenaProfesionalMapper.toEntity(dto, cliente, profesional, reserva)
                        : ResenaProfesionalMapper.toEntity(dto, cliente, profesional)
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(ResenaProfesionalMapper.toDTO(nueva));
    }

    /** Eliminar propia reseña (solo CLIENTE propietario) */
    @PreAuthorize("hasRole('CLIENTE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Usuario cliente = getUsuarioAutenticado();
        resenaService.eliminar(id, cliente.getId());
        return ResponseEntity.noContent().build();
    }

    private Usuario getUsuarioAutenticado() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
