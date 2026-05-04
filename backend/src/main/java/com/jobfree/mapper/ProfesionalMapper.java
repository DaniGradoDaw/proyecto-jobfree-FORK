package com.jobfree.mapper;

import com.jobfree.dto.profesional.ProfesionalCreateDTO;
import com.jobfree.dto.profesional.ProfesionalDTO;
import com.jobfree.dto.profesional.ProfesionalPrivadoDTO;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Plan;

/**
 * Mapper para convertir entre la entidad ProfesionalInfo y sus DTOs.
 */
public class ProfesionalMapper {

    /**
     * Convierte una entidad ProfesionalInfo a su DTO de salida.
     */
    public static ProfesionalDTO toDTO(ProfesionalInfo p) {
        return new ProfesionalDTO(
                p.getId(),
                p.getDescripcion(),
                p.getExperiencia(),
                p.getNombreEmpresa(),
                p.getCif(),
                p.getPlan(),
                p.getCodigoPostal(),
                p.getValoracionMedia(),
                p.getNumeroValoraciones(),
                p.getUsuario().getId(),
                p.getUsuario().getNombreCompleto(),
                p.getUsuario().getCiudad(),
                p.getUsuario().getFotoUrl()
        );
    }

    /**
     * Convierte una entidad ProfesionalInfo a DTO de salida incluyendo distancia calculada.
     * Se usa exclusivamente en el endpoint /cercanos.
     */
    public static ProfesionalDTO toDTOCercano(ProfesionalInfo p, double distanciaKm) {
        ProfesionalDTO dto = toDTO(p);
        dto.setDistanciaKm(distanciaKm);
        return dto;
    }

    /**
     * Convierte una entidad ProfesionalInfo a DTO privado con coordenadas.
     */
    public static ProfesionalPrivadoDTO toPrivateDTO(ProfesionalInfo p) {
        return new ProfesionalPrivadoDTO(
                p.getId(),
                p.getDescripcion(),
                p.getExperiencia(),
                p.getNombreEmpresa(),
                p.getCif(),
                p.getPlan(),
                p.getCodigoPostal(),
                p.getValoracionMedia(),
                p.getNumeroValoraciones(),
                p.getUsuario().getId(),
                p.getLatitud(),
                p.getLongitud(),
                p.getUbicacionManual()
        );
    }

    /**
     * Convierte un DTO de creación a entidad ProfesionalInfo.
     */
    public static ProfesionalInfo toEntity(ProfesionalCreateDTO dto, Usuario usuario) {
        ProfesionalInfo p = new ProfesionalInfo();
        p.setDescripcion(dto.getDescripcion());
        p.setExperiencia(dto.getExperiencia());
        p.setNombreEmpresa(dto.getNombreEmpresa());
        if (dto.getCif() != null) {
            p.setCif(dto.getCif().trim().toUpperCase());
        }
        p.setPlan(Plan.BASICO);
        p.setCodigoPostal(dto.getCodigoPostal());
        p.setUsuario(usuario);
        return p;
    }
}
