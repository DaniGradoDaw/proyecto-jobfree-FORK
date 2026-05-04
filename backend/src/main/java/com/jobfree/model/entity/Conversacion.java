package com.jobfree.model.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

/**
 * Conversación entre cliente y profesional.
 * Puede iniciarse antes de crear una reserva y vincularse después.
 */
@Entity
@Table(name = "conversacion")
public class Conversacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	@Column(nullable = false, updatable = false)
	private LocalDateTime fechaCreacion;

	// Fecha del último mensaje enviado — se actualiza en MensajeService para ordenar sin lazy loading
	@Column(name = "ultimo_mensaje_fecha")
	private LocalDateTime ultimoMensajeFecha;

	// Contenido del último mensaje (máx. 200 chars) — evita cargar toda la colección en el mapper
	@Column(name = "ultimo_mensaje_contenido", length = 200)
	private String ultimoMensajeContenido;

	@PrePersist
	public void prePersist() {
		this.fechaCreacion = LocalDateTime.now();
	}

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reserva_id", unique = true, foreignKey = @ForeignKey(name = "fk_conversacion_reserva"))
	@JsonIgnore
	private Reserva reserva;

	// null = no silenciada; fecha futura = silenciada hasta esa fecha; 9999-01-01 = siempre
	@Column(name = "silenciada_cliente_hasta")
	private LocalDateTime silenciadaClienteHasta;

	@Column(name = "silenciada_profesional_hasta")
	private LocalDateTime silenciadaProfesionalHasta;

	@Column(name = "fijada_cliente", nullable = false)
	private boolean fijadaCliente = false;

	@Column(name = "fijada_profesional", nullable = false)
	private boolean fijadaProfesional = false;

	@Column(name = "contacto_clave", length = 64, unique = true)
	private String contactoClave;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cliente_id", nullable = false, foreignKey = @ForeignKey(name = "fk_conversacion_cliente"))
	@JsonIgnore
	private Usuario cliente;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "profesional_id", nullable = false, foreignKey = @ForeignKey(name = "fk_conversacion_profesional"))
	@JsonIgnore
	private Usuario profesional;

	@OneToMany(mappedBy = "conversacion", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Mensaje> mensajes = new ArrayList<>();

	public Conversacion() {
	}

	public Conversacion(Reserva reserva, Usuario cliente, Usuario profesional) {
		this.reserva = reserva;
		this.cliente = cliente;
		this.profesional = profesional;
	}

	public Conversacion(Usuario cliente, Usuario profesional, String contactoClave) {
		this.cliente = cliente;
		this.profesional = profesional;
		this.contactoClave = contactoClave;
	}

	public Long getId() {
		return id;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public LocalDateTime getUltimoMensajeFecha() {
		return ultimoMensajeFecha;
	}

	public void setUltimoMensajeFecha(LocalDateTime ultimoMensajeFecha) {
		this.ultimoMensajeFecha = ultimoMensajeFecha;
	}

	public String getUltimoMensajeContenido() {
		return ultimoMensajeContenido;
	}

	public void setUltimoMensajeContenido(String ultimoMensajeContenido) {
		this.ultimoMensajeContenido = ultimoMensajeContenido;
	}

	public Reserva getReserva() {
		return reserva;
	}

	public void setReserva(Reserva reserva) {
		this.reserva = reserva;
	}

	public String getContactoClave() {
		return contactoClave;
	}

	public void setContactoClave(String contactoClave) {
		this.contactoClave = contactoClave;
	}

	public Usuario getCliente() {
		return cliente;
	}

	public void setCliente(Usuario cliente) {
		this.cliente = cliente;
	}

	public Usuario getProfesional() {
		return profesional;
	}

	public void setProfesional(Usuario profesional) {
		this.profesional = profesional;
	}

	public LocalDateTime getSilenciadaClienteHasta() { return silenciadaClienteHasta; }
	public void setSilenciadaClienteHasta(LocalDateTime silenciadaClienteHasta) { this.silenciadaClienteHasta = silenciadaClienteHasta; }

	public LocalDateTime getSilenciadaProfesionalHasta() { return silenciadaProfesionalHasta; }
	public void setSilenciadaProfesionalHasta(LocalDateTime silenciadaProfesionalHasta) { this.silenciadaProfesionalHasta = silenciadaProfesionalHasta; }

	public boolean isFijadaCliente() { return fijadaCliente; }
	public void setFijadaCliente(boolean fijadaCliente) { this.fijadaCliente = fijadaCliente; }

	public boolean isFijadaProfesional() { return fijadaProfesional; }
	public void setFijadaProfesional(boolean fijadaProfesional) { this.fijadaProfesional = fijadaProfesional; }

	public List<Mensaje> getMensajes() {
		return mensajes;
	}

	public void setMensajes(List<Mensaje> mensajes) {
		this.mensajes = mensajes;
	}
}
