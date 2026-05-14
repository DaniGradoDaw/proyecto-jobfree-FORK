package com.jobfree.mapper;

import com.jobfree.dto.profesional.ProfesionalCreateDTO;
import com.jobfree.dto.profesional.ProfesionalDTO;
import com.jobfree.dto.profesional.ProfesionalPrivadoDTO;
import com.jobfree.dto.profesional.ZonaServicioDTO;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.entity.ZonaServicio;
import com.jobfree.model.enums.Plan;

public class ProfesionalMapper {

    public static ProfesionalDTO toDTO(ProfesionalInfo p) {
        ProfesionalDTO dto = new ProfesionalDTO(
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
        dto.setCiudadesServicio(p.getZonasServicio().stream()
                .map(ZonaServicio::getNombre)
                .toList());
        return dto;
    }

    public static ProfesionalDTO toDTOCercano(ProfesionalInfo p, double distanciaKm) {
        ProfesionalDTO dto = toDTO(p);
        dto.setDistanciaKm(distanciaKm);
        return dto;
    }

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
                p.getZonasServicio().stream()
                        .map(z -> new ZonaServicioDTO(z.getNombre(), z.getLatitud(), z.getLongitud()))
                        .toList()
        );
    }

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
