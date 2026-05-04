package com.jobfree.dto.bloqueo;

import java.time.LocalDateTime;

public class BloqueoUsuarioDTO {
    private Long bloqueadoId;
    private String bloqueadoNombre;
    private String bloqueadoFotoUrl;
    private LocalDateTime fechaBloqueo;

    public Long getBloqueadoId() { return bloqueadoId; }
    public void setBloqueadoId(Long bloqueadoId) { this.bloqueadoId = bloqueadoId; }

    public String getBloqueadoNombre() { return bloqueadoNombre; }
    public void setBloqueadoNombre(String bloqueadoNombre) { this.bloqueadoNombre = bloqueadoNombre; }

    public String getBloqueadoFotoUrl() { return bloqueadoFotoUrl; }
    public void setBloqueadoFotoUrl(String bloqueadoFotoUrl) { this.bloqueadoFotoUrl = bloqueadoFotoUrl; }

    public LocalDateTime getFechaBloqueo() { return fechaBloqueo; }
    public void setFechaBloqueo(LocalDateTime fechaBloqueo) { this.fechaBloqueo = fechaBloqueo; }

    private String motivo;
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}
