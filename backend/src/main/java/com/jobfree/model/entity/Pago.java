package com.jobfree.model.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobfree.model.enums.EstadoPago;
import com.jobfree.model.enums.MetodoPago;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * Representa el pago asociado a una reserva.
 */
@Entity
@Table(name = "pago")
public class Pago {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	@NotNull(message = "El importe es obligatorio")
	@Positive(message = "El importe debe ser mayor que 0")
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal importe;

	@NotNull(message = "El método de pago es obligatorio")
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MetodoPago metodo;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EstadoPago estado = EstadoPago.PENDIENTE;

	/**
	 * Fecha en la que se registra el pago
	 */
	@Column(nullable = false, updatable = false)
	private LocalDateTime fechaPago;

	@PrePersist
	public void prePersist() {
		this.fechaPago = LocalDateTime.now();
	}

	/**
	 * Un pago pertenece a una reserva.
	 */
	@Column(name = "stripe_payment_intent_id")
	private String stripePaymentIntentId;

	@NotNull(message = "La reserva es obligatoria")
	@OneToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "reserva_id", nullable = false, unique = true)
	private Reserva reserva;

	// Constructor vacío obligatorio
	public Pago() {
	}

	public Pago(BigDecimal importe, MetodoPago metodo, Reserva reserva) {
		this.importe = importe;
		this.metodo = metodo;
		this.reserva = reserva;
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public BigDecimal getImporte() {
		return importe;
	}

	public void setImporte(BigDecimal importe) {
		this.importe = importe;
	}

	public MetodoPago getMetodo() {
		return metodo;
	}

	public void setMetodo(MetodoPago metodo) {
		this.metodo = metodo;
	}

	public EstadoPago getEstado() {
		return estado;
	}

	public void setEstado(EstadoPago estado) {
		this.estado = estado;
	}

	public LocalDateTime getFechaPago() {
		return fechaPago;
	}

	public String getStripePaymentIntentId() {
		return stripePaymentIntentId;
	}

	public void setStripePaymentIntentId(String stripePaymentIntentId) {
		this.stripePaymentIntentId = stripePaymentIntentId;
	}

	public Reserva getReserva() {
		return reserva;
	}

	public void setReserva(Reserva reserva) {
		this.reserva = reserva;
	}

}