package com.jobfree.dto.realtime;

import java.time.LocalDateTime;

public class PresenciaConexionEventDTO {

	private final String tipo = "usuario.presencia";
	private final Long usuarioId;
	private final boolean online;
	private final LocalDateTime ultimaConexion;

	public PresenciaConexionEventDTO(Long usuarioId, boolean online, LocalDateTime ultimaConexion) {
		this.usuarioId = usuarioId;
		this.online = online;
		this.ultimaConexion = ultimaConexion;
	}

	public String getTipo() { return tipo; }
	public Long getUsuarioId() { return usuarioId; }
	public boolean isOnline() { return online; }
	public LocalDateTime getUltimaConexion() { return ultimaConexion; }
}
