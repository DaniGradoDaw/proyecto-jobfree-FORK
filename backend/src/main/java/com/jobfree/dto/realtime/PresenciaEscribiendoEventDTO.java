package com.jobfree.dto.realtime;

public class PresenciaEscribiendoEventDTO {

	private final String tipo = "usuario.escribiendo";
	private final Long conversacionId;
	private final Long usuarioId;

	public PresenciaEscribiendoEventDTO(Long conversacionId, Long usuarioId) {
		this.conversacionId = conversacionId;
		this.usuarioId = usuarioId;
	}

	public String getTipo() { return tipo; }
	public Long getConversacionId() { return conversacionId; }
	public Long getUsuarioId() { return usuarioId; }
}
