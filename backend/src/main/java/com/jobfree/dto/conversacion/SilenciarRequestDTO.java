package com.jobfree.dto.conversacion;

public class SilenciarRequestDTO {
    // "8h" = 8 horas, "1s" = 1 semana, "siempre" = siempre, null = dessilenciar
    private String duracion;

    public String getDuracion() { return duracion; }
    public void setDuracion(String duracion) { this.duracion = duracion; }
}
