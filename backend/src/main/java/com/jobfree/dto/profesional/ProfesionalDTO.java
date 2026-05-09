package com.jobfree.dto.profesional;

import com.jobfree.model.enums.Plan;
import java.util.List;

/**
 * DTO para mostrar un perfil profesional.
 */
public class ProfesionalDTO {

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
    private String nombreCompleto;
    private String ciudad;
    private String fotoUrl;

    private List<String> ciudadesServicio;

    // Solo se rellena en respuestas del endpoint /cercanos — null en el resto
    private Double distanciaKm;

    public ProfesionalDTO() {
    }

    public ProfesionalDTO(Long id, String descripcion, Integer experiencia, String nombreEmpresa,
            String cif, Plan plan, String codigoPostal, Double valoracionMedia,
            Integer numeroValoraciones, Long usuarioId, String nombreCompleto, String ciudad, String fotoUrl) {
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
        this.nombreCompleto = nombreCompleto;
        this.ciudad = ciudad;
        this.fotoUrl = fotoUrl;
    }

    // Getters

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
    public String getNombreCompleto() { return nombreCompleto; }
    public String getCiudad() { return ciudad; }
    public String getFotoUrl() { return fotoUrl; }
    public List<String> getCiudadesServicio() { return ciudadesServicio; }
    public Double getDistanciaKm() { return distanciaKm; }

    public void setCiudadesServicio(List<String> ciudadesServicio) { this.ciudadesServicio = ciudadesServicio; }
    public void setDistanciaKm(Double distanciaKm) { this.distanciaKm = distanciaKm; }
}
