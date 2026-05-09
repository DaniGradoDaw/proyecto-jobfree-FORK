package com.jobfree.model.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Representa un mensaje enviado entre usuarios.
 */
@Entity
@Table(name = "mensaje")
public class Mensaje {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	@Column(nullable = false, length = 1000)
	private String contenido;

	@Column(name = "imagen_url", length = 500)
	private String imagenUrl;

	@NotBlank(message = "El identificador del cliente es obligatorio")
	@Column(name = "client_message_id", nullable = false, length = 36)
	private String clientMessageId;

	@Column(nullable = false)
	private boolean leido = false;

	@Column(nullable = false)
	private boolean recibido = false;

	@Column(nullable = false, updatable = false)
	private LocalDateTime fechaEnvio;

	@PrePersist
	public void prePersist() {
		this.fechaEnvio = LocalDateTime.now();
	}

	// Muchos mensajes pueden ser enviados por un mismo usuario
	@NotNull(message = "El remitente es obligatorio")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "remitente_id", nullable = false)
	private Usuario remitente;

	// Muchos mensajes pueden ser recibidos por un mismo usuario
	@NotNull(message = "El destinatario es obligatorio")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "destinatario_id", nullable = false)
	private Usuario destinatario;

	// Muchos mensajes pueden pertenecer a la misma conversación
	@NotNull(message = "La conversación es obligatoria")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "conversacion_id", nullable = false, foreignKey = @ForeignKey(name = "fk_mensaje_conversacion"))
	private Conversacion conversacion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "mensaje_respondido_id")
	private Mensaje mensajeRespondido;

	@OneToMany(mappedBy = "mensaje", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("fechaCreacion ASC")
	@JsonIgnore
	private List<MensajeReaccion> reacciones = new ArrayList<>();

	// Constructor vacío obligatorio
	public Mensaje() {
	}

	public Mensaje(String contenido, Usuario remitente, Usuario destinatario, Conversacion conversacion) {
		this.contenido = contenido;
		this.remitente = remitente;
		this.destinatario = destinatario;
		this.conversacion = conversacion;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public String getContenido() {
		return contenido;
	}

	public void setContenido(String contenido) {
		this.contenido = contenido;
	}

	public String getClientMessageId() {
		return clientMessageId;
	}

	public void setClientMessageId(String clientMessageId) {
		this.clientMessageId = clientMessageId;
	}

	public boolean isLeido() {
		return leido;
	}

	public void setLeido(boolean leido) {
		this.leido = leido;
	}

	public boolean isRecibido() {
		return recibido;
	}

	public void setRecibido(boolean recibido) {
		this.recibido = recibido;
	}

	public LocalDateTime getFechaEnvio() {
		return fechaEnvio;
	}

	public Usuario getRemitente() {
		return remitente;
	}

	public void setRemitente(Usuario remitente) {
		this.remitente = remitente;
	}

	public Usuario getDestinatario() {
		return destinatario;
	}

	public void setDestinatario(Usuario destinatario) {
		this.destinatario = destinatario;
	}

	public Conversacion getConversacion() {
		return conversacion;
	}

	public void setConversacion(Conversacion conversacion) {
		this.conversacion = conversacion;
	}

	public Mensaje getMensajeRespondido() {
		return mensajeRespondido;
	}

	public void setMensajeRespondido(Mensaje mensajeRespondido) {
		this.mensajeRespondido = mensajeRespondido;
	}

	public String getImagenUrl() {
		return imagenUrl;
	}

	public void setImagenUrl(String imagenUrl) {
		this.imagenUrl = imagenUrl;
	}

	public List<MensajeReaccion> getReacciones() {
		return reacciones;
	}

}
