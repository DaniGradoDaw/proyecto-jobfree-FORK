package com.jobfree.dto.profesional;

import com.jobfree.model.enums.Plan;
import java.util.List;

public class ProfesionalPrivadoDTO {

    private Long id;
    private String descripcion;
    private Integer experiencia;
    private String nombreEmpresa;
    private String cif;
    private Plan plan;
    private String codigoPostal;
    private Double valoracionMedia;
    private Integer numeroValoraciones;
    private Long usuarioId;
    private List<String> ciudadesServicio;

    public ProfesionalPrivadoDTO() {
    }

    public ProfesionalPrivadoDTO(Long id, String descripcion, Integer experiencia, String nombreEmpresa,
            String cif, Plan plan, String codigoPostal, Double valoracionMedia,
            Integer numeroValoraciones, Long usuarioId, List<String> ciudadesServicio) {
        this.id = id;
        this.descripcion = descripcion;
        this.experiencia = experiencia;
        this.nombreEmpresa = nombreEmpresa;
        this.cif = cif;
        this.plan = plan;
        this.codigoPostal = codigoPostal;
        this.valoracionMedia = valoracionMedia;
        this.numeroValoraciones = numeroValoraciones;
        this.usuarioId = usuarioId;
        this.ciudadesServicio = ciudadesServicio;
    }

    public Long getId() { return id; }
    public String getDescripcion() { return descripcion; }
    public Integer getExperiencia() { return experiencia; }
    public String getNombreEmpresa() { return nombreEmpresa; }
    public String getCif() { return cif; }
    public Plan getPlan() { return plan; }
    public String getCodigoPostal() { return codigoPostal; }
    public Double getValoracionMedia() { return valoracionMedia; }
    public Integer getNumeroValoraciones() { return numeroValoraciones; }
    public Long getUsuarioId() { return usuarioId; }
    public List<String> getCiudadesServicio() { return ciudadesServicio; }
}
