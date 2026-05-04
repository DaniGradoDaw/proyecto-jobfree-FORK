package com.jobfree.dto.mensaje;

import java.time.LocalDateTime;

/**
 * DTO para mostrar un mensaje.
 */
public class MensajeDTO {

	private Long id;
	private String contenido;
	private String clientMessageId;
	private boolean leido;
	private boolean recibido;
	private LocalDateTime fechaEnvio;

	private Long remitenteId;
	private Long destinatarioId;
	private Long conversacionId;

	private Long mensajeRespondidoId;
	private String mensajeRespondidoContenido;
	private Long mensajeRespondidoRemitenteId;

	private String imagenUrl;

	public MensajeDTO() {
	}

	public MensajeDTO(Long id, String contenido, String clientMessageId, boolean leido, boolean recibido, LocalDateTime fechaEnvio, Long remitenteId,
			Long destinatarioId, Long conversacionId) {
		this.id = id;
		this.contenido = contenido;
		this.clientMessageId = clientMessageId;
		this.leido = leido;
		this.recibido = recibido;
		this.fechaEnvio = fechaEnvio;
		this.remitenteId = remitenteId;
		this.destinatarioId = destinatarioId;
		this.conversacionId = conversacionId;
	}

	// Getters

	public Long getId() {
		return id;
	}

	public String getContenido() {
		return contenido;
	}

	public String getClientMessageId() {
		return clientMessageId;
	}

	public boolean isLeido() {
		return leido;
	}

	public boolean isRecibido() {
		return recibido;
	}

	public LocalDateTime getFechaEnvio() {
		return fechaEnvio;
	}

	public Long getRemitenteId() {
		return remitenteId;
	}

	public Long getDestinatarioId() {
		return destinatarioId;
	}

	public Long getConversacionId() {
		return conversacionId;
	}

	public Long getMensajeRespondidoId() {
		return mensajeRespondidoId;
	}

	public void setMensajeRespondidoId(Long mensajeRespondidoId) {
		this.mensajeRespondidoId = mensajeRespondidoId;
	}

	public String getMensajeRespondidoContenido() {
		return mensajeRespondidoContenido;
	}

	public void setMensajeRespondidoContenido(String mensajeRespondidoContenido) {
		this.mensajeRespondidoContenido = mensajeRespondidoContenido;
	}

	public Long getMensajeRespondidoRemitenteId() {
		return mensajeRespondidoRemitenteId;
	}

	public void setMensajeRespondidoRemitenteId(Long mensajeRespondidoRemitenteId) {
		this.mensajeRespondidoRemitenteId = mensajeRespondidoRemitenteId;
	}

	public String getImagenUrl() {
		return imagenUrl;
	}

	public void setImagenUrl(String imagenUrl) {
		this.imagenUrl = imagenUrl;
	}

}
