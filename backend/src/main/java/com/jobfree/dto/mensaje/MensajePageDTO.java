package com.jobfree.dto.mensaje;

import java.util.List;

public class MensajePageDTO {

	private List<MensajeDTO> mensajes;
	private boolean hayMas;

	public MensajePageDTO(List<MensajeDTO> mensajes, boolean hayMas) {
		this.mensajes = mensajes;
		this.hayMas = hayMas;
	}

	public List<MensajeDTO> getMensajes() {
		return mensajes;
	}

	public boolean isHayMas() {
		return hayMas;
	}
}
