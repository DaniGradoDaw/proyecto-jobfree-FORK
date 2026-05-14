package com.jobfree.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jobfree.dto.profesional.ProfesionalCreateDTO;
import com.jobfree.dto.profesional.ZonaServicioDTO;
import com.jobfree.exception.profesional.ProfesionalInvalidoException;
import com.jobfree.exception.profesional.ProfesionalNotFoundException;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.entity.ZonaServicio;
import com.jobfree.model.enums.Plan;
import com.jobfree.model.enums.Rol;
import com.jobfree.repository.ProfesionalInfoRepository;
import com.jobfree.util.GeoUtils;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProfesionalInfoService {

    private final ProfesionalInfoRepository profesionalInfoRepository;
    private final GeocodingService geocodingService;

    public ProfesionalInfoService(ProfesionalInfoRepository profesionalInfoRepository,
                                  GeocodingService geocodingService) {
        this.profesionalInfoRepository = profesionalInfoRepository;
        this.geocodingService = geocodingService;
    }

    public List<ProfesionalInfo> listarPerfiles() {
        return profesionalInfoRepository.findAll();
    }

    public Page<ProfesionalInfo> listarPerfilesPaginado(Pageable pageable) {
        return profesionalInfoRepository.findAll(pageable);
    }

    public ProfesionalInfo obtenerPorId(Long id) {
        return profesionalInfoRepository.findById(id)
                .orElseThrow(() -> new ProfesionalNotFoundException(id));
    }

    public ProfesionalInfo guardarPerfil(ProfesionalInfo perfil) {
        if (perfil.getUsuario() == null) {
            throw new ProfesionalInvalidoException("El usuario es obligatorio");
        }
        if (profesionalInfoRepository.findByUsuarioId(perfil.getUsuario().getId()).isPresent()) {
            throw new ProfesionalInvalidoException("El usuario ya tiene un perfil profesional");
        }
        if (perfil.getCif() != null && !perfil.getCif().isBlank()) {
            String cifNormalizado = perfil.getCif().trim().toUpperCase();
            if (profesionalInfoRepository.existsByCif(cifNormalizado)) {
                throw new ProfesionalInvalidoException("El CIF ya está registrado");
            }
            perfil.setCif(cifNormalizado);
        }
        perfil.setPlan(Plan.BASICO);
        // Geocodificar si hay ciudad o código postal
        intentarGeocodificar(perfil, perfil.getUsuario().getCiudad(), perfil.getCodigoPostal(), false);
        return profesionalInfoRepository.save(perfil);
    }

    public ProfesionalInfo actualizarPerfil(Long id, ProfesionalCreateDTO dto, Usuario usuario) {
        ProfesionalInfo existente = obtenerPorId(id);
        if (!existente.getUsuario().getId().equals(usuario.getId())) {
            throw new ProfesionalInvalidoException("No puedes modificar este perfil");
        }
        if (dto.getDescripcion() != null && !dto.getDescripcion().isBlank()) {
            existente.setDescripcion(dto.getDescripcion());
        }
        if (dto.getExperiencia() != null && dto.getExperiencia() >= 0) {
            existente.setExperiencia(dto.getExperiencia());
        }
        if (dto.getNombreEmpresa() != null) {
            existente.setNombreEmpresa(dto.getNombreEmpresa());
        }
        if (dto.getCif() != null && !dto.getCif().isBlank()) {
            String cifNormalizado = dto.getCif().trim().toUpperCase();
            if (!cifNormalizado.equals(existente.getCif()) && profesionalInfoRepository.existsByCif(cifNormalizado)) {
                throw new ProfesionalInvalidoException("El CIF ya está registrado");
            }
            existente.setCif(cifNormalizado);
        }
        boolean codigoPostalCambio = dto.getCodigoPostal() != null
                && !dto.getCodigoPostal().equals(existente.getCodigoPostal());

        if (dto.getCodigoPostal() != null) {
            existente.setCodigoPostal(dto.getCodigoPostal());
        }

        if (codigoPostalCambio) {
            String ciudad = existente.getUsuario().getCiudad();
            intentarGeocodificar(existente, ciudad, dto.getCodigoPostal(), false);
        }

        return profesionalInfoRepository.save(existente);
    }

    /**
     * Actualiza las zonas de servicio del profesional (nombre + coordenadas reales).
     */
    public ProfesionalInfo actualizarCiudadesServicio(Long id, List<ZonaServicioDTO> zonas, Usuario usuario) {
        ProfesionalInfo existente = obtenerPorId(id);
        if (!existente.getUsuario().getId().equals(usuario.getId())) {
            throw new ProfesionalInvalidoException("No puedes modificar este perfil");
        }
        existente.getZonasServicio().clear();
        if (zonas != null) {
            zonas.stream()
                    .filter(z -> z != null && z.getNombre() != null && !z.getNombre().isBlank())
                    .map(z -> new ZonaServicio(z.getNombre().trim(), z.getLatitud(), z.getLongitud()))
                    .forEach(existente.getZonasServicio()::add);
        }
        return profesionalInfoRepository.save(existente);
    }

    /**
     * Devuelve profesionales cuya ubicación principal o alguna zona de servicio
     * está dentro del radio indicado, ordenados por la distancia mínima al punto dado.
     */
    public List<ProfesionalInfo> buscarCercanos(double lat, double lng, double radioKm) {
        double latDelta = radioKm / 111.0;
        double cosLat = Math.cos(Math.toRadians(lat));
        double lngDelta = Math.abs(cosLat) < 0.000001 ? 180.0 : radioKm / (111.0 * cosLat);

        return profesionalInfoRepository.findCercanosConZonas(
                        lat - latDelta, lat + latDelta,
                        lng - lngDelta, lng + lngDelta)
                .stream()
                .filter(p -> calcularMinDistanciaKm(lat, lng, p) <= radioKm)
                .sorted(Comparator.comparingDouble(p -> calcularMinDistanciaKm(lat, lng, p)))
                .toList();
    }

    /** Distancia mínima desde el punto a la ubicación principal o cualquier zona del profesional. */
    public double calcularMinDistanciaKm(double lat, double lng, ProfesionalInfo p) {
        double min = Double.MAX_VALUE;
        if (p.getLatitud() != null && p.getLongitud() != null) {
            min = GeoUtils.calcularDistanciaKm(lat, lng, p.getLatitud(), p.getLongitud());
        }
        for (ZonaServicio z : p.getZonasServicio()) {
            if (z.getLatitud() != null && z.getLongitud() != null) {
                min = Math.min(min, GeoUtils.calcularDistanciaKm(lat, lng, z.getLatitud(), z.getLongitud()));
            }
        }
        return min;
    }

    public ProfesionalInfo obtenerPorUsuario(Long usuarioId) {
        return profesionalInfoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ProfesionalNotFoundException(usuarioId));
    }

    /**
     * Devuelve el perfil profesional del usuario o lo crea si el usuario es profesional
     * y aún no tiene fila asociada en profesional_info.
     */
    public ProfesionalInfo obtenerOCrearPorUsuario(Usuario usuario) {
        return profesionalInfoRepository.findByUsuarioId(usuario.getId())
                .orElseGet(() -> {
                    if (!Rol.PROFESIONAL.equals(usuario.getRol())) {
                        throw new ProfesionalNotFoundException(usuario.getId());
                    }

                    ProfesionalInfo perfil = new ProfesionalInfo();
                    perfil.setUsuario(usuario);
                    perfil.setDescripcion("Perfil en construcción");
                    perfil.setExperiencia(0);
                    perfil.setPlan(Plan.BASICO);
                    intentarGeocodificar(perfil, usuario.getCiudad(), null, false);
                    return profesionalInfoRepository.save(perfil);
                });
    }

    public void eliminarPerfil(Long id) {
        ProfesionalInfo perfil = obtenerPorId(id);
        profesionalInfoRepository.delete(perfil);
    }

    /**
     * Recalcula la ubicación del profesional cuando cambia la ciudad del usuario.
     */
    public void sincronizarUbicacionPorCambioDeCiudad(Long usuarioId, String ciudad) {
        profesionalInfoRepository.findByUsuarioId(usuarioId).ifPresent(perfil ->
            intentarGeocodificar(perfil, ciudad, perfil.getCodigoPostal(), true)
        );
    }

    // ── privado ───────────────────────────────────────────────────────────────

    private void intentarGeocodificar(ProfesionalInfo perfil, String ciudad, String codigoPostal, boolean limpiarSiFalla) {
        if ((ciudad == null || ciudad.isBlank()) && (codigoPostal == null || codigoPostal.isBlank())) {
            if (limpiarSiFalla) {
                perfil.setLatitud(null);
                perfil.setLongitud(null);
            }
            return;
        }
        double[] coords = geocodingService.geocodificar(ciudad, codigoPostal);
        if (coords != null) {
            perfil.setLatitud(coords[0]);
            perfil.setLongitud(coords[1]);
        } else if (limpiarSiFalla) {
            perfil.setLatitud(null);
            perfil.setLongitud(null);
        }
    }
}
