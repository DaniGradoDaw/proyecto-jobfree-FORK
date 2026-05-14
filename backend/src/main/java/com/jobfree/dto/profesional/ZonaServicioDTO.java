package com.jobfree.dto.profesional;

public class ZonaServicioDTO {

    private String nombre;
    private Double latitud;
    private Double longitud;

    public ZonaServicioDTO() {}

    public ZonaServicioDTO(String nombre, Double latitud, Double longitud) {
        this.nombre = nombre;
        this.latitud = latitud;
        this.longitud = longitud;
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Double getLatitud() { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }
    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }
}
