package com.jobfree.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.jobfree.dto.servicio.ServicioCreateDTO;
import com.jobfree.dto.servicio.ServicioDTO;
import com.jobfree.exception.profesional.ProfesionalNotFoundException;
import com.jobfree.mapper.ServicioMapper;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.SubcategoriaServicio;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Plan;
import com.jobfree.service.ProfesionalInfoService;
import com.jobfree.service.ServicioOfrecidoService;
import com.jobfree.service.SubcategoriaServicioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/servicios")
public class ServicioOfrecidoController {

    private final ServicioOfrecidoService servicioService;
    private final SubcategoriaServicioService subcategoriaService;
    private final ProfesionalInfoService profesionalService;

    public ServicioOfrecidoController(ServicioOfrecidoService servicioService,
                                      SubcategoriaServicioService subcategoriaService,
                                      ProfesionalInfoService profesionalService) {
        this.servicioService = servicioService;
        this.subcategoriaService = subcategoriaService;
        this.profesionalService = profesionalService;
    }

    /**
     * Obtiene todos los servicios con paginación (incluye activos e inactivos).
     * Parámetros: page (default 0), size (default 20), sort.
     *
     * @return página de servicios
     */
    @GetMapping
    public ResponseEntity<Page<ServicioDTO>> listarServicios(Pageable pageable) {
        Page<ServicioDTO> page = servicioService.listarServiciosPaginado(pageable)
                .map(ServicioMapper::toDTO);
        return ResponseEntity.ok(page);
    }

    /**
     * Obtiene únicamente los servicios activos con paginación.
     * Parámetros: page (default 0), size (default 20), sort.
     *
     * @return página de servicios activos
     */
    @GetMapping("/activos")
    public ResponseEntity<Page<ServicioDTO>> listarActivos(Pageable pageable) {
        Page<ServicioDTO> page = servicioService.listarActivosPaginado(pageable)
                .map(ServicioMapper::toDTO);
        return ResponseEntity.ok(page);
    }

    /**
     * Obtiene servicios activos por subcategoría con paginación.
     *
     * @param subcategoriaId identificador de la subcategoría
     * @param pageable       parámetros de paginación
     * @return página de servicios
     */
    @GetMapping("/subcategoria/{subcategoriaId}")
    public ResponseEntity<Page<ServicioDTO>> obtenerPorSubcategoria(
            @PathVariable Long subcategoriaId,
            Pageable pageable) {

        Page<ServicioDTO> page = servicioService
                .obtenerPorSubcategoria(subcategoriaId, pageable)
                .map(ServicioMapper::toDTO);

        return ResponseEntity.ok(page);
    }

    /**
     * Obtiene un servicio por su ID.
     *
     * @param id identificador del servicio
     * @return servicio encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<ServicioDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(
                ServicioMapper.toDTO(servicioService.obtenerPorId(id))
        );
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/profesional-usuario/{usuarioId}/activos")
    public ResponseEntity<List<ServicioDTO>> obtenerActivosPorUsuarioProfesional(@PathVariable Long usuarioId) {
        List<ServicioDTO> dtos = servicioService.obtenerActivosPorUsuarioProfesional(usuarioId)
                .stream()
                .map(ServicioMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * Devuelve los servicios del profesional autenticado.
     *
     * @return lista de servicios propios
     */
    @PreAuthorize("hasRole('PROFESIONAL')")
    @GetMapping("/mios")
    public ResponseEntity<List<ServicioDTO>> obtenerMisServicios() {
        Usuario usuario = getUsuarioAutenticado();
        try {
            ProfesionalInfo profesional = profesionalService.obtenerPorUsuario(usuario.getId());
            List<ServicioDTO> dtos = servicioService.obtenerPorProfesional(profesional.getId())
                    .stream()
                    .map(ServicioMapper::toDTO)
                    .toList();
            return ResponseEntity.ok(dtos);
        } catch (ProfesionalNotFoundException e) {
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Crea un nuevo servicio.
     * Solo usuarios con rol PROFESIONAL pueden acceder.
     *
     * @param dto datos del servicio a crear
     * @return servicio creado
     */
    @PreAuthorize("hasRole('PROFESIONAL')")
    @PostMapping
    public ResponseEntity<ServicioDTO> crearServicio(@Valid @RequestBody ServicioCreateDTO dto) {

        Usuario usuario = getUsuarioAutenticado();

        ProfesionalInfo profesional;
        try {
            profesional = profesionalService.obtenerPorUsuario(usuario.getId());
        } catch (ProfesionalNotFoundException e) {
            ProfesionalInfo nuevo = new ProfesionalInfo();
            nuevo.setDescripcion("Perfil en construcción");
            nuevo.setExperiencia(0);
            nuevo.setPlan(Plan.BASICO);
            nuevo.setUsuario(usuario);
            profesional = profesionalService.guardarPerfil(nuevo);
        }

        SubcategoriaServicio subcategoria = subcategoriaService.obtenerPorId(dto.getSubcategoriaId());

        ServicioOfrecido nuevo = servicioService.crearServicio(
                ServicioMapper.toEntity(dto, profesional, subcategoria)
        );

        // Construimos el DTO con el usuario ya cargado (evita problemas de lazy loading).
        // El 'usuario' viene del contexto JWT, así que ya está completamente inicializado.
        ServicioDTO respuesta = new ServicioDTO(
                nuevo.getId(),
                nuevo.getTitulo(),
                nuevo.getDescripcion(),
                nuevo.getDuracionMin(),
                nuevo.getPrecioHora(),
                nuevo.isActiva(),
                subcategoria.getId(),
                subcategoria.getNombre(),
                subcategoria.getImagen(),
                profesional.getId(),
                usuario.getId(),
                usuario.getNombreCompleto(),
                usuario.getCiudad(),
                usuario.getFotoUrl(),
                profesional.getValoracionMedia(),
                profesional.getNumeroValoraciones()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    /**
     * Actualiza un servicio existente.
     * Solo el propietario puede modificarlo.
     *
     * @param id  identificador del servicio
     * @param dto nuevos datos del servicio
     * @return servicio actualizado
     */
    @PreAuthorize("hasRole('PROFESIONAL')")
    @PatchMapping("/{id}")
    public ResponseEntity<ServicioDTO> actualizarServicio(
            @PathVariable Long id,
            @Valid @RequestBody ServicioCreateDTO dto) {

        Usuario usuario = getUsuarioAutenticado();

        ProfesionalInfo profesional = profesionalService.obtenerPorUsuario(usuario.getId());
        SubcategoriaServicio subcategoria = subcategoriaService.obtenerPorId(dto.getSubcategoriaId());

        ServicioOfrecido actualizado = servicioService.actualizarServicio(
                id,
                ServicioMapper.toEntity(dto, profesional, subcategoria),
                usuario.getId()
        );

        return ResponseEntity.ok(ServicioMapper.toDTO(actualizado));
    }

    /**
     * Activa un servicio.
     * Solo el propietario puede activarlo.
     *
     * @param id identificador del servicio
     * @return servicio activado
     */
    @PreAuthorize("hasRole('PROFESIONAL')")
    @PatchMapping("/{id}/activar")
    public ResponseEntity<ServicioDTO> activar(@PathVariable Long id) {

        Usuario usuario = getUsuarioAutenticado();

        return ResponseEntity.ok(
                ServicioMapper.toDTO(
                        servicioService.activarServicio(id, usuario.getId())
                )
        );
    }

    /**
     * Desactiva un servicio.
     * Solo el propietario puede desactivarlo.
     *
     * @param id identificador del servicio
     * @return servicio desactivado
     */
    @PreAuthorize("hasRole('PROFESIONAL')")
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<ServicioDTO> desactivar(@PathVariable Long id) {

        Usuario usuario = getUsuarioAutenticado();

        return ResponseEntity.ok(
                ServicioMapper.toDTO(
                        servicioService.desactivarServicio(id, usuario.getId())
                )
        );
    }

    /**
     * Elimina un servicio.
     * Solo el propietario puede eliminarlo.
     *
     * @param id identificador del servicio
     * @return respuesta sin contenido
     */
    @PreAuthorize("hasRole('PROFESIONAL')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Long id) {

        Usuario usuario = getUsuarioAutenticado();

        servicioService.eliminarServicio(id, usuario.getId());

        return ResponseEntity.noContent().build();
    }

    /**
     * Obtiene el usuario autenticado del contexto de seguridad.
     *
     * @return usuario autenticado
     */
    private Usuario getUsuarioAutenticado() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
