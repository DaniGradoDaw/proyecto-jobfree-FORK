package com.jobfree.dto.reserva;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.jobfree.model.enums.EstadoReserva;

public class ReservaDTO {

	private Long id;
	private LocalDateTime fechaInicio;
	private LocalDateTime fechaCreacion;
	private BigDecimal precioTotal;
	private EstadoReserva estado;
	private String descripcion;

	private Long clienteId;
	private String clienteNombre;
	private String clienteFotoUrl;

	private Long servicioId;
	private String servicioTitulo;

	private Long profesionalId;
	private String profesionalNombre;
	private String profesionalFotoUrl;
	private Long valoracionId;
	private boolean valorada;

	private int progreso;
	private String notasProgreso;
	private Integer duracionMin;

	public ReservaDTO() {
	}

	// Getters y setters

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public LocalDateTime getFechaInicio() { return fechaInicio; }
	public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

	public LocalDateTime getFechaCreacion() { return fechaCreacion; }
	public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

	public BigDecimal getPrecioTotal() { return precioTotal; }
	public void setPrecioTotal(BigDecimal precioTotal) { this.precioTotal = precioTotal; }

	public EstadoReserva getEstado() { return estado; }
	public void setEstado(EstadoReserva estado) { this.estado = estado; }

	public String getDescripcion() { return descripcion; }
	public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

	public Long getClienteId() { return clienteId; }
	public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

	public String getClienteNombre() { return clienteNombre; }
	public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }

	public String getClienteFotoUrl() { return clienteFotoUrl; }
	public void setClienteFotoUrl(String clienteFotoUrl) { this.clienteFotoUrl = clienteFotoUrl; }

	public Long getServicioId() { return servicioId; }
	public void setServicioId(Long servicioId) { this.servicioId = servicioId; }

	public String getServicioTitulo() { return servicioTitulo; }
	public void setServicioTitulo(String servicioTitulo) { this.servicioTitulo = servicioTitulo; }

	public Long getProfesionalId() { return profesionalId; }
	public void setProfesionalId(Long profesionalId) { this.profesionalId = profesionalId; }

	public String getProfesionalNombre() { return profesionalNombre; }
	public void setProfesionalNombre(String profesionalNombre) { this.profesionalNombre = profesionalNombre; }

	public String getProfesionalFotoUrl() { return profesionalFotoUrl; }
	public void setProfesionalFotoUrl(String profesionalFotoUrl) { this.profesionalFotoUrl = profesionalFotoUrl; }

	public Long getValoracionId() { return valoracionId; }
	public void setValoracionId(Long valoracionId) { this.valoracionId = valoracionId; }

	public boolean isValorada() { return valorada; }
	public void setValorada(boolean valorada) { this.valorada = valorada; }

	public int getProgreso() { return progreso; }
	public void setProgreso(int progreso) { this.progreso = progreso; }

	public String getNotasProgreso() { return notasProgreso; }
	public void setNotasProgreso(String notasProgreso) { this.notasProgreso = notasProgreso; }

	public Integer getDuracionMin() { return duracionMin; }
	public void setDuracionMin(Integer duracionMin) { this.duracionMin = duracionMin; }
}
