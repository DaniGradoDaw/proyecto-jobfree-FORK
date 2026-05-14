package com.jobfree.dto.reserva;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

/**
 * DTO para crear una reserva.
 */
public class ReservaCreateDTO {

	@NotNull
	private Long servicioId;

	private Long conversacionId;

	private LocalDateTime fechaInicio;

	private String descripcion;

	// Precio por hora negociado (opcional; si es null se usa el del servicio)
	private BigDecimal precioPersonalizado;

	public Long getServicioId() {
		return servicioId;
	}

	public void setServicioId(Long servicioId) {
		this.servicioId = servicioId;
	}

	public Long getConversacionId() {
		return conversacionId;
	}

	public void setConversacionId(Long conversacionId) {
		this.conversacionId = conversacionId;
	}

	public LocalDateTime getFechaInicio() {
		return fechaInicio;
	}

	public void setFechaInicio(LocalDateTime fechaInicio) {
		this.fechaInicio = fechaInicio;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public BigDecimal getPrecioPersonalizado() {
		return precioPersonalizado;
	}

	public void setPrecioPersonalizado(BigDecimal precioPersonalizado) {
		this.precioPersonalizado = precioPersonalizado;
	}
}
