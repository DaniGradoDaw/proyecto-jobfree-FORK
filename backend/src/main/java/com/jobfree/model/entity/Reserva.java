package com.jobfree.model.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobfree.model.enums.EstadoReserva;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

/**
 * Representa una reserva realizada por un cliente para contratar un servicio
 * ofrecido.
 */
@Entity
@Table(name = "reserva")
public class Reserva {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	// Fecha de inicio de la reserva.
	@NotNull(message = "La fecha es obligatoria")
	@FutureOrPresent(message = "La fecha no puede ser pasada")
	@Column(nullable = false)
	private LocalDateTime fechaInicio;

	@Column(length = 1000)
	private String descripcion;

	@NotNull(message = "El precio es obligatorio")
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal precioTotal;

	@Column(nullable = false, updatable = false)
	private LocalDateTime fechaCreacion;

	@Column(nullable = false)
	private int progreso = 0;

	@Column(length = 500)
	private String notasProgreso;

	@PrePersist
	public void prePersist() {
		this.fechaCreacion = LocalDateTime.now();
	}

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EstadoReserva estado = EstadoReserva.PENDIENTE;

	// Muchas reservas pertenecen a un cliente
	@NotNull(message = "El cliente es obligatorio")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "cliente_id", nullable = false)
	private Usuario cliente;

	// Muchas reservas pueden estar asociadas al mismo servicio
	@NotNull(message = "El servicio es obligatorio")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "servicio_id", nullable = false)
	private ServicioOfrecido servicio;

	// Una reserva puede tener un pago asociado
	@OneToOne(mappedBy = "reserva", fetch = FetchType.LAZY)
	@JsonIgnore
	private Pago pago;

	// Una reserva puede tener una valoración asociada
	@OneToOne(mappedBy = "reserva", fetch = FetchType.LAZY)
	@JsonIgnore
	private Valoracion valoracion;

	// Una reserva tiene una única conversación asociada
	@OneToOne(mappedBy = "reserva", fetch = FetchType.LAZY)
	@JsonIgnore
	private Conversacion conversacion;

	// Constructor vacío obligatorio
	public Reserva() {
	}

	public Reserva(Usuario cliente, ServicioOfrecido servicio, LocalDateTime fechaInicio) {
		this.cliente = cliente;
		this.servicio = servicio;
		this.fechaInicio = fechaInicio;
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public LocalDateTime getFechaInicio() {
		return fechaInicio;
	}

	public void setFechaInicio(LocalDateTime fechaInicio) {
		this.fechaInicio = fechaInicio;
	}

	public BigDecimal getPrecioTotal() {
		return precioTotal;
	}

	public void setPrecioTotal(BigDecimal precioTotal) {
		this.precioTotal = precioTotal;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public EstadoReserva getEstado() {
		return estado;
	}

	public void setEstado(EstadoReserva estado) {
		this.estado = estado;
	}

	public Usuario getCliente() {
		return cliente;
	}

	public void setCliente(Usuario cliente) {
		this.cliente = cliente;
	}

	public ServicioOfrecido getServicio() {
		return servicio;
	}

	public void setServicio(ServicioOfrecido servicio) {
		this.servicio = servicio;
	}

	public Pago getPago() {
		return pago;
	}

	public void setPago(Pago pago) {
		this.pago = pago;
	}

	public Valoracion getValoracion() {
		return valoracion;
	}

	public void setValoracion(Valoracion valoracion) {
		this.valoracion = valoracion;
	}

	public Conversacion getConversacion() {
		return conversacion;
	}

	public void setConversacion(Conversacion conversacion) {
		this.conversacion = conversacion;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public int getProgreso() {
		return progreso;
	}

	public void setProgreso(int progreso) {
		this.progreso = Math.max(0, Math.min(100, progreso));
	}

	public String getNotasProgreso() {
		return notasProgreso;
	}

	public void setNotasProgreso(String notasProgreso) {
		this.notasProgreso = notasProgreso;
	}

}
