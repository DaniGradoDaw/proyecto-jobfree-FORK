package com.jobfree.model.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobfree.model.enums.Plan;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * Representa la información profesional de un usuario.
 */
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "profesional_info")
public class ProfesionalInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	@NotBlank(message = "La descripción es obligatoria")
	@Column(nullable = false, length = 500)
	private String descripcion;

	@NotNull(message = "La experiencia es obligatoria")
	@PositiveOrZero(message = "La experiencia no puede ser negativa")
	@Column(nullable = false)
	private Integer experiencia; // años de experiencia

	@Column(length = 100)
	private String nombreEmpresa;

	@Column(length = 20, unique = true)
	private String cif;

	@NotNull(message = "El plan es obligatorio")
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Plan plan;

	// Código postal de la zona donde trabaja el profesional
	@Column(length = 10)
	private String codigoPostal;

	// Coordenadas geográficas — se rellenan automáticamente al guardar ciudad/CP
	@Column
	private Double latitud;

	@Column
	private Double longitud;

	// Ciudades donde el profesional ofrece sus servicios
	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(name = "profesional_ciudad_servicio", joinColumns = @JoinColumn(name = "profesional_id"))
	@Column(name = "ciudad", length = 100)
	private List<String> ciudadesServicio = new ArrayList<>();

	// Se actualiza cuando reciba valoraciones
	@Column(nullable = false)
	private Double valoracionMedia = 0.0;

	// Número de valoraciones que ha recibido el profesional
	@Column(nullable = false)
	private Integer numeroValoraciones = 0;

	// Cada profesional tiene un unico perfil profesional
	@NotNull(message = "El usuario es obligatorio")
	@OneToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "usuario_id", nullable = false, unique = true)
	private Usuario usuario;

	// Un profesional puede ofrecer muchos servicios
	@JsonIgnore
	@OneToMany(mappedBy = "profesional", fetch = FetchType.LAZY)
	private List<ServicioOfrecido> servicios = new ArrayList<>();

	// Un profesional puede recibir muchas valoraciones
	@JsonIgnore
	@OneToMany(mappedBy = "profesional", fetch = FetchType.LAZY)
	private List<Valoracion> valoraciones = new ArrayList<>();

	// Constructor vacío obligatorio
	public ProfesionalInfo() {
	}

	public ProfesionalInfo(Usuario usuario, String descripcion, Integer experiencia, String nombreEmpresa, String cif,
			Plan plan) {
		this.usuario = usuario;
		this.descripcion = descripcion;
		this.experiencia = experiencia;
		this.nombreEmpresa = nombreEmpresa;
		this.cif = cif;
		this.plan = plan;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

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

	public Double getValoracionMedia() {
		return valoracionMedia;
	}

	public void setValoracionMedia(Double valoracionMedia) {
		this.valoracionMedia = valoracionMedia;
	}

	public Integer getNumeroValoraciones() {
		return numeroValoraciones;
	}

	public void setNumeroValoraciones(Integer numeroValoraciones) {
		this.numeroValoraciones = numeroValoraciones;
	}

	public String getCodigoPostal() {
		return codigoPostal;
	}

	public void setCodigoPostal(String codigoPostal) {
		this.codigoPostal = codigoPostal;
	}

	public Double getLatitud() {
		return latitud;
	}

	public void setLatitud(Double latitud) {
		this.latitud = latitud;
	}

	public Double getLongitud() {
		return longitud;
	}

	public void setLongitud(Double longitud) {
		this.longitud = longitud;
	}

	public List<String> getCiudadesServicio() {
		return ciudadesServicio;
	}

	public void setCiudadesServicio(List<String> ciudadesServicio) {
		this.ciudadesServicio = ciudadesServicio;
	}

	public List<ServicioOfrecido> getServicios() {
		return servicios;
	}

	public void setServicios(List<ServicioOfrecido> servicios) {
		this.servicios = servicios;
	}

	public List<Valoracion> getValoraciones() {
		return valoraciones;
	}

	public void setValoraciones(List<Valoracion> valoraciones) {
		this.valoraciones = valoraciones;
	}

}
