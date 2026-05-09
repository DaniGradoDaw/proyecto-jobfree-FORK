package com.jobfree.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jobfree.dto.profesional.ProfesionalCreateDTO;
import com.jobfree.exception.profesional.ProfesionalInvalidoException;
import com.jobfree.exception.profesional.ProfesionalNotFoundException;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Usuario;
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
     * Actualiza las ciudades donde el profesional ofrece sus servicios.
     */
    public ProfesionalInfo actualizarCiudadesServicio(Long id, List<String> ciudades, Usuario usuario) {
        ProfesionalInfo existente = obtenerPorId(id);
        if (!existente.getUsuario().getId().equals(usuario.getId())) {
            throw new ProfesionalInvalidoException("No puedes modificar este perfil");
        }
        existente.getCiudadesServicio().clear();
        if (ciudades != null) {
            ciudades.stream()
                    .filter(c -> c != null && !c.isBlank())
                    .map(String::trim)
                    .distinct()
                    .forEach(existente.getCiudadesServicio()::add);
        }
        return profesionalInfoRepository.save(existente);
    }

    /**
     * Devuelve profesionales con coordenadas ordenados por distancia al punto dado,
     * filtrando los que superen el radio indicado en km.
     */
    public List<ProfesionalInfo> buscarCercanos(double lat, double lng, double radioKm) {
        double latDelta = radioKm / 111.0;
        double cosLat = Math.cos(Math.toRadians(lat));
        double lngDelta = Math.abs(cosLat) < 0.000001 ? 180.0 : radioKm / (111.0 * cosLat);

        return profesionalInfoRepository.findByLatitudBetweenAndLongitudBetween(
                        lat - latDelta, lat + latDelta,
                        lng - lngDelta, lng + lngDelta)
                .stream()
                .filter(p -> GeoUtils.calcularDistanciaKm(lat, lng, p.getLatitud(), p.getLongitud()) <= radioKm)
                .sorted(Comparator.comparingDouble(
                        p -> GeoUtils.calcularDistanciaKm(lat, lng, p.getLatitud(), p.getLongitud())))
                .toList();
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
