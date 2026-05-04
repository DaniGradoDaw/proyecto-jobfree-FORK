package com.jobfree.dto.conversacion;

import java.time.LocalDateTime;

public class ConversacionDTO {

	private Long id;
	private Long reservaId;
	private LocalDateTime fechaCreacion;

	private Long clienteId;
	private String clienteNombre;
	private String clienteFotoUrl;

	private Long profesionalId;
	private String profesionalNombre;
	private String profesionalFotoUrl;

	private String servicioTitulo;
	private String ultimoMensaje;
	private LocalDateTime fechaUltimoMensaje;
	private String estadoReserva;

	// Calculado según el usuario autenticado: mensajes no leídos por el receptor
	private int noLeidos;

	// Calculado en endpoints REST según el usuario autenticado; null en eventos WebSocket
	private Long otroUsuarioId;
	private String otroUsuarioNombre;
	private String otroUsuarioFoto;
	private LocalDateTime otroUsuarioUltimaConexion;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getReservaId() {
		return reservaId;
	}

	public void setReservaId(Long reservaId) {
		this.reservaId = reservaId;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public Long getClienteId() {
		return clienteId;
	}

	public void setClienteId(Long clienteId) {
		this.clienteId = clienteId;
	}

	public String getClienteNombre() {
		return clienteNombre;
	}

	public void setClienteNombre(String clienteNombre) {
		this.clienteNombre = clienteNombre;
	}

	public String getClienteFotoUrl() {
		return clienteFotoUrl;
	}

	public void setClienteFotoUrl(String clienteFotoUrl) {
		this.clienteFotoUrl = clienteFotoUrl;
	}

	public Long getProfesionalId() {
		return profesionalId;
	}

	public void setProfesionalId(Long profesionalId) {
		this.profesionalId = profesionalId;
	}

	public String getProfesionalNombre() {
		return profesionalNombre;
	}

	public void setProfesionalNombre(String profesionalNombre) {
		this.profesionalNombre = profesionalNombre;
	}

	public String getProfesionalFotoUrl() {
		return profesionalFotoUrl;
	}

	public void setProfesionalFotoUrl(String profesionalFotoUrl) {
		this.profesionalFotoUrl = profesionalFotoUrl;
	}

	public String getServicioTitulo() {
		return servicioTitulo;
	}

	public void setServicioTitulo(String servicioTitulo) {
		this.servicioTitulo = servicioTitulo;
	}

	public String getUltimoMensaje() {
		return ultimoMensaje;
	}

	public void setUltimoMensaje(String ultimoMensaje) {
		this.ultimoMensaje = ultimoMensaje;
	}

	public LocalDateTime getFechaUltimoMensaje() {
		return fechaUltimoMensaje;
	}

	public void setFechaUltimoMensaje(LocalDateTime fechaUltimoMensaje) {
		this.fechaUltimoMensaje = fechaUltimoMensaje;
	}

	public String getEstadoReserva() {
		return estadoReserva;
	}

	public void setEstadoReserva(String estadoReserva) {
		this.estadoReserva = estadoReserva;
	}

	public int getNoLeidos() { return noLeidos; }
	public void setNoLeidos(int noLeidos) { this.noLeidos = noLeidos; }

	public Long getOtroUsuarioId() { return otroUsuarioId; }
	public void setOtroUsuarioId(Long otroUsuarioId) { this.otroUsuarioId = otroUsuarioId; }

	public String getOtroUsuarioNombre() { return otroUsuarioNombre; }
	public void setOtroUsuarioNombre(String otroUsuarioNombre) { this.otroUsuarioNombre = otroUsuarioNombre; }

	public String getOtroUsuarioFoto() { return otroUsuarioFoto; }
	public void setOtroUsuarioFoto(String otroUsuarioFoto) { this.otroUsuarioFoto = otroUsuarioFoto; }

	public LocalDateTime getOtroUsuarioUltimaConexion() { return otroUsuarioUltimaConexion; }
	public void setOtroUsuarioUltimaConexion(LocalDateTime otroUsuarioUltimaConexion) {
		this.otroUsuarioUltimaConexion = otroUsuarioUltimaConexion;
	}

	private boolean silenciada;
	public boolean isSilenciada() { return silenciada; }
	public void setSilenciada(boolean silenciada) { this.silenciada = silenciada; }

	private boolean bloqueado;
	public boolean isBloqueado() { return bloqueado; }
	public void setBloqueado(boolean bloqueado) { this.bloqueado = bloqueado; }

	private boolean meBloqueo;
	public boolean isMeBloqueo() { return meBloqueo; }
	public void setMeBloqueo(boolean meBloqueo) { this.meBloqueo = meBloqueo; }

	private boolean fijada;
	public boolean isFijada() { return fijada; }
	public void setFijada(boolean fijada) { this.fijada = fijada; }
}
