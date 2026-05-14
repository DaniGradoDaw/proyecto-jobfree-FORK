package com.jobfree.dto.realtime;

import java.time.LocalDateTime;

import com.jobfree.dto.mensaje.MensajeDTO;

public class MensajeEliminadoEventDTO {

	private final String tipo;
	private final Long conversacionId;
	private final MensajeDTO mensaje;
	private final LocalDateTime timestamp;

	public MensajeEliminadoEventDTO(Long conversacionId, MensajeDTO mensaje) {
		this.tipo = "mensaje.eliminado";
		this.conversacionId = conversacionId;
		this.mensaje = mensaje;
		this.timestamp = LocalDateTime.now();
	}

	public String getTipo() {
		return tipo;
	}

	public Long getConversacionId() {
		return conversacionId;
	}

	public MensajeDTO getMensaje() {
		return mensaje;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}
}
