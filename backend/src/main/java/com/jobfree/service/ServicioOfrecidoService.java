package com.jobfree.service;

import java.math.BigDecimal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jobfree.exception.servicio.ServicioInvalidoException;
import com.jobfree.exception.servicio.ServicioNotFoundException;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.repository.ReservaRepository;
import com.jobfree.repository.ServicioOfrecidoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ServicioOfrecidoService {

    private static final Logger log = LoggerFactory.getLogger(ServicioOfrecidoService.class);

    private final ServicioOfrecidoRepository servicioRepository;
    private final ReservaRepository reservaRepository;

    public ServicioOfrecidoService(ServicioOfrecidoRepository servicioRepository,
                                   ReservaRepository reservaRepository) {
        this.servicioRepository = servicioRepository;
        this.reservaRepository = reservaRepository;
    }

    /**
     * Obtiene todos los servicios registrados en el sistema.
     *
     * @return lista completa de servicios
     */
    public List<ServicioOfrecido> listarServicios() {
        return servicioRepository.findAll();
    }

    /**
     * Obtiene un servicio por su identificador.
     *
     * @param id identificador del servicio
     * @return servicio encontrado
     * @throws ServicioNotFoundException si no existe el servicio
     */
    public ServicioOfrecido obtenerPorId(Long id) {
        return servicioRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ServicioNotFoundException(id));
    }

    /**
     * Crea un nuevo servicio validando sus datos básicos.
     *
     * @param servicio entidad con los datos del servicio
     * @return servicio persistido
     * @throws ServicioInvalidoException si los datos no son válidos
     */
    public ServicioOfrecido crearServicio(ServicioOfrecido servicio) {

        if (servicio.getTitulo() == null || servicio.getTitulo().isBlank()) {
            throw new ServicioInvalidoException("El título es obligatorio");
        }

        if (servicio.getDescripcion() == null || servicio.getDescripcion().isBlank()) {
            throw new ServicioInvalidoException("La descripción es obligatoria");
        }

        if (servicio.getDuracionMin() == null || servicio.getDuracionMin() <= 0) {
            throw new ServicioInvalidoException("Duración inválida");
        }

        if (servicio.getPrecioHora() == null || servicio.getPrecioHora().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ServicioInvalidoException("Precio inválido");
        }

        if (servicio.getProfesional() == null) {
            throw new ServicioInvalidoException("Profesional obligatorio");
        }

        if (servicio.getSubcategoria() == null) {
            throw new ServicioInvalidoException("Subcategoría obligatoria");
        }

        ServicioOfrecido guardado = servicioRepository.save(servicio);
        log.info("Servicio {} creado por profesional {}", guardado.getId(), servicio.getProfesional().getId());
        return guardado;
    }

    /**
     * Actualiza parcialmente un servicio existente.
     * Solo puede ser modificado por el usuario propietario del servicio.
     *
     * @param id        identificador del servicio
     * @param datos     nuevos datos a aplicar
     * @param usuarioId identificador del usuario autenticado
     * @return servicio actualizado
     * @throws ServicioNotFoundException si el servicio no existe
     * @throws ServicioInvalidoException si el usuario no es propietario
     */
    public ServicioOfrecido actualizarServicio(Long id, ServicioOfrecido datos, Long usuarioId) {

        ServicioOfrecido existente = obtenerPorId(id);

        validarPropietario(existente, usuarioId);

        if (datos.getTitulo() != null && !datos.getTitulo().isBlank()) {
            existente.setTitulo(datos.getTitulo());
        }

        if (datos.getDescripcion() != null && !datos.getDescripcion().isBlank()) {
            existente.setDescripcion(datos.getDescripcion());
        }

        if (datos.getDuracionMin() != null && datos.getDuracionMin() > 0) {
            existente.setDuracionMin(datos.getDuracionMin());
        }

        if (datos.getPrecioHora() != null && datos.getPrecioHora().compareTo(BigDecimal.ZERO) > 0) {
            existente.setPrecioHora(datos.getPrecioHora());
        }

        if (datos.getSubcategoria() != null) {
            existente.setSubcategoria(datos.getSubcategoria());
        }

        return servicioRepository.save(existente);
    }

    /**
     * Elimina un servicio existente.
     * Solo puede ser eliminado por su propietario.
     *
     * @param id        identificador del servicio
     * @param usuarioId identificador del usuario autenticado
     * @throws ServicioNotFoundException si el servicio no existe
     * @throws ServicioInvalidoException si el usuario no es propietario
     */
    public void eliminarServicio(Long id, Long usuarioId) {

        ServicioOfrecido servicio = obtenerPorId(id);

        validarPropietario(servicio, usuarioId);

        reservaRepository.deleteAll(reservaRepository.findByServicioId(id));
        servicioRepository.delete(servicio);
        log.info("Servicio {} eliminado por usuario {}", id, usuarioId);
    }

    /**
     * Obtiene los servicios activos de una categoría.
     *
     * @param categoriaId identificador de la categoría
     * @return lista de servicios activos
     */
    public List<ServicioOfrecido> obtenerPorCategoria(Long categoriaId) {
        return servicioRepository.findBySubcategoriaCategoriaIdAndActivaTrue(categoriaId);
    }

    /**
     * Obtiene los servicios activos de una subcategoría con paginación.
     *
     * @param subcategoriaId identificador de la subcategoría
     * @param pageable       parámetros de paginación
     * @return página de servicios
     */
    public Page<ServicioOfrecido> obtenerPorSubcategoria(Long subcategoriaId, Pageable pageable) {
        return servicioRepository.findBySubcategoriaIdAndActivaTrue(subcategoriaId, pageable);
    }

    /**
     * Obtiene todos los servicios activos.
     *
     * @return lista de servicios activos
     */
    public List<ServicioOfrecido> listarActivos() {
        return servicioRepository.findByActivaTrue();
    }

    /**
     * Obtiene servicios activos con paginación.
     *
     * @param pageable parámetros de paginación
     * @return página de servicios activos
     */
    public Page<ServicioOfrecido> listarActivosPaginado(Pageable pageable) {
        return servicioRepository.findByActivaTrue(pageable);
    }

    /**
     * Obtiene todos los servicios con paginación (incluye inactivos).
     *
     * @param pageable parámetros de paginación
     * @return página de servicios
     */
    public Page<ServicioOfrecido> listarServiciosPaginado(Pageable pageable) {
        return servicioRepository.findAll(pageable);
    }

    /**
     * Obtiene todos los servicios de un profesional concreto.
     *
     * @param profesionalId identificador del perfil profesional
     * @return lista de servicios del profesional
     */
    public List<ServicioOfrecido> obtenerPorProfesional(Long profesionalId) {
        return servicioRepository.findByProfesionalId(profesionalId);
    }

    public List<ServicioOfrecido> obtenerActivosPorUsuarioProfesional(Long usuarioId) {
        return servicioRepository.findByProfesionalUsuarioIdAndActivaTrue(usuarioId);
    }

    /**
     * Activa un servicio.
     * Solo puede ser activado por su propietario.
     *
     * @param id        identificador del servicio
     * @param usuarioId identificador del usuario autenticado
     * @return servicio activado
     * @throws ServicioInvalidoException si ya está activo o no es propietario
     */
    public ServicioOfrecido activarServicio(Long id, Long usuarioId) {

        ServicioOfrecido servicio = obtenerPorId(id);

        validarPropietario(servicio, usuarioId);

        if (servicio.isActiva()) {
            throw new ServicioInvalidoException("Ya está activo");
        }

        servicio.setActiva(true);
        return servicioRepository.save(servicio);
    }

    /**
     * Desactiva un servicio.
     * Solo puede ser desactivado por su propietario.
     *
     * @param id        identificador del servicio
     * @param usuarioId identificador del usuario autenticado
     * @return servicio desactivado
     * @throws ServicioInvalidoException si ya está desactivado o no es propietario
     */
    public ServicioOfrecido desactivarServicio(Long id, Long usuarioId) {

        ServicioOfrecido servicio = obtenerPorId(id);

        validarPropietario(servicio, usuarioId);

        if (!servicio.isActiva()) {
            throw new ServicioInvalidoException("Ya está desactivado");
        }

        servicio.setActiva(false);
        return servicioRepository.save(servicio);
    }

    /**
     * Verifica que el usuario autenticado sea el propietario del servicio.
     *
     * @param servicio  servicio a validar
     * @param usuarioId identificador del usuario autenticado
     * @throws ServicioInvalidoException si el usuario no es propietario
     */
    public ServicioOfrecido guardar(ServicioOfrecido servicio) {
        return servicioRepository.save(servicio);
    }

    public void eliminarServicioAdmin(Long id) {
        ServicioOfrecido servicio = obtenerPorId(id);
        reservaRepository.deleteAll(reservaRepository.findByServicioId(id));
        servicioRepository.delete(servicio);
        log.info("Servicio {} eliminado por admin", id);
    }

    private void validarPropietario(ServicioOfrecido servicio, Long usuarioId) {
        if (!servicio.getProfesional().getUsuario().getId().equals(usuarioId)) {
            throw new ServicioInvalidoException("No tienes permisos sobre este servicio");
        }
    }
}
