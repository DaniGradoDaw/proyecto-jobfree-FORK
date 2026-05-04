package com.jobfree.dto.profesional;

import com.jobfree.model.enums.Plan;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * DTO para crear un perfil profesional.
 */
public class ProfesionalCreateDTO {

	@NotBlank(message = "La descripción es obligatoria")
	private String descripcion;

	@PositiveOrZero(message = "La experiencia no puede ser negativa")
	private Integer experiencia;

	private String nombreEmpresa;

	@Pattern(regexp = "^[A-Za-z0-9]*$", message = "El CIF no es válido")
	private String cif;

	private Plan plan;

	private String codigoPostal;

	// Getters y Setters

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Integer getExperiencia() {
		return experiencia;
	}

	public void setExperiencia(Integer experiencia) {
		this.experiencia = experiencia;
	}

	public String getNombreEmpresa() {
		return nombreEmpresa;
	}

	public void setNombreEmpresa(String nombreEmpresa) {
		this.nombreEmpresa = nombreEmpresa;
	}

	public String getCif() {
		return cif;
	}

	public void setCif(String cif) {
		this.cif = cif;
	}

	public Plan getPlan() {
		return plan;
	}

	public void setPlan(Plan plan) {
		this.plan = plan;
	}

	public String getCodigoPostal() {
		return codigoPostal;
	}

	public void setCodigoPostal(String codigoPostal) {
		this.codigoPostal = codigoPostal;
	}

}
