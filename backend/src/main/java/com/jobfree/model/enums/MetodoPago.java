package com.jobfree.model.enums;

/**
 * Métodos de pago disponibles.
 */
public enum MetodoPago {

	// Pago con tarjeta bancaria
	TARJETA("Tarjeta"),

	// Pago en efectivo
	EFECTIVO("Efectivo"),

	// Pago mediante transferencia
	TRANSFERENCIA("Transferencia"),

	// Pago con saldo del monedero
	MONEDERO("Monedero");

	// Texto para mostrar
	private final String label;

	// Asigna el texto
	MetodoPago(String label) {
		this.label = label;
	}

	// Obtiene el texto
	public String getLabel() {
		return label;
	}
}
