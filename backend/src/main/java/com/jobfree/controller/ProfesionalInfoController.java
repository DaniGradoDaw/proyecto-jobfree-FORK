package com.jobfree.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.profesional.ProfesionalCreateDTO;
import com.jobfree.dto.profesional.ProfesionalDTO;
import com.jobfree.dto.profesional.ProfesionalPrivadoDTO;
import com.jobfree.dto.profesional.UbicacionDTO;
import com.jobfree.mapper.ProfesionalMapper;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.ProfesionalInfoService;
import com.jobfree.util.GeoUtils;
import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/profesionales")
public class ProfesionalInfoController {

    private final ProfesionalInfoService profesionalInfoService;

    public ProfesionalInfoController(ProfesionalInfoService profesionalInfoService) {
        this.profesionalInfoService = profesionalInfoService;
    }

    /** Lista todos los perfiles profesionales con paginación. */
    @GetMapping
    public ResponseEntity<Page<ProfesionalDTO>> listarProfesionales(Pageable pageable) {
        Page<ProfesionalDTO> page = profesionalInfoService.listarPerfilesPaginado(pageable)
                .map(ProfesionalMapper::toDTO);
        return ResponseEntity.ok(page);
    }

    /**
     * Devuelve profesionales dentro de un radio (km) ordenados por distancia.
     *
     * <p>Parámetros: lat, lng (decimales WGS-84), radio (km, default 20).
     * Solo devuelve profesionales que tengan coordenadas guardadas.
     */
    @GetMapping("/cercanos")
    public ResponseEntity<List<ProfesionalDTO>> obtenerCercanos(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "20") double radio) {

        List<ProfesionalDTO> dtos = profesionalInfoService.buscarCercanos(lat, lng, radio)
                .stream()
                .map(p -> {
                    double distancia = GeoUtils.calcularDistanciaKm(lat, lng, p.getLatitud(), p.getLongitud());
                    return ProfesionalMapper.toDTOCercano(p, GeoUtils.redondear1Decimal(distancia));
                })
                .toList();

        return ResponseEntity.ok(dtos);
    }

    /** Obtiene un perfil por ID. */
    @GetMapping("/{id}")
    public ResponseEntity<ProfesionalDTO> obtenerPorId(@PathVariable Long id) {
        ProfesionalInfo p = profesionalInfoService.obtenerPorId(id);
        return ResponseEntity.ok(ProfesionalMapper.toDTO(p));
    }

    /** Obtiene el perfil del usuario autenticado. */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mio")
    public ResponseEntity<ProfesionalPrivadoDTO> obtenerMiPerfil() {
        Usuario usuario = usuarioActual();
        ProfesionalInfo p = profesionalInfoService.obtenerOCrearPorUsuario(usuario);
        return ResponseEntity.ok(ProfesionalMapper.toPrivateDTO(p));
    }

    /**
     * Actualiza las coordenadas GPS del profesional autenticado.
     * Llamado desde el botón "Detectar ubicación" del frontend.
     */
    @PreAuthorize("hasRole('PROFESIONAL')")
    @PatchMapping("/mio/ubicacion")
    public ResponseEntity<ProfesionalPrivadoDTO> actualizarUbicacion(@Valid @RequestBody UbicacionDTO dto) {
        Usuario usuario = usuarioActual();
        ProfesionalInfo perfil = profesionalInfoService.obtenerOCrearPorUsuario(usuario);
        ProfesionalInfo actualizado = profesionalInfoService.actualizarUbicacion(
                perfil.getId(), dto.getLatitud(), dto.getLongitud(), usuario);
        return ResponseEntity.ok(ProfesionalMapper.toPrivateDTO(actualizado));
    }

    /**
     * Elimina las coordenadas GPS del profesional autenticado.
     */
    @PreAuthorize("hasRole('PROFESIONAL')")
    @PatchMapping("/mio/ubicacion/limpiar")
    public ResponseEntity<ProfesionalPrivadoDTO> limpiarUbicacion() {
        Usuario usuario = usuarioActual();
        ProfesionalInfo perfil = profesionalInfoService.obtenerOCrearPorUsuario(usuario);
        ProfesionalInfo actualizado = profesionalInfoService.limpiarUbicacion(perfil.getId(), usuario);
        return ResponseEntity.ok(ProfesionalMapper.toPrivateDTO(actualizado));
    }

    /** Crea el perfil profesional del usuario autenticado. */
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<ProfesionalPrivadoDTO> crearPerfil(@Valid @RequestBody ProfesionalCreateDTO dto) {
        Usuario usuario = usuarioActual();
        ProfesionalInfo nuevo = profesionalInfoService.guardarPerfil(
                ProfesionalMapper.toEntity(dto, usuario));
        return ResponseEntity.status(HttpStatus.CREATED).body(ProfesionalMapper.toPrivateDTO(nuevo));
    }

    /** Actualiza el perfil profesional. */
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{id}")
    public ResponseEntity<ProfesionalPrivadoDTO> actualizarPerfil(
            @PathVariable Long id,
            @Valid @RequestBody ProfesionalCreateDTO dto) {
        Usuario usuario = usuarioActual();
        ProfesionalInfo actualizado = profesionalInfoService.actualizarPerfil(id, dto, usuario);
        return ResponseEntity.ok(ProfesionalMapper.toPrivateDTO(actualizado));
    }

    @Operation(hidden = true)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPerfil(@PathVariable Long id) {
        profesionalInfoService.eliminarPerfil(id);
        return ResponseEntity.noContent().build();
    }

    // ── privado ───────────────────────────────────────────────────────────────

    private Usuario usuarioActual() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
