package com.jobfree.dto.servicio;

import java.math.BigDecimal;

/**
 * DTO para mostrar un servicio junto con los datos básicos del profesional que lo ofrece.
 * Incluimos los datos del profesional aquí para que el frontend no necesite
 * hacer una segunda petición para mostrar quién ofrece cada servicio.
 */
public class ServicioDTO {

	private Long id;
	private String titulo;
	private String descripcion;
	private Integer duracionMin;
	private BigDecimal precioHora;
	private boolean activa;
	private Long subcategoriaId;
	private String subcategoriaNombre;
	private String subcategoriaImagenUrl;

	// Datos del profesional que ofrece este servicio
	private Long profesionalId;
	private Long profesionalUsuarioId;
	private String nombreProfesional;
	private String ciudadProfesional;
	private String fotoUrlProfesional;
	private Double valoracionMedia;
	private Integer numeroValoraciones;

	public ServicioDTO() {
	}

	public ServicioDTO(Long id, String titulo, String descripcion, Integer duracionMin, BigDecimal precioHora,
			boolean activa, Long subcategoriaId, String subcategoriaNombre, String subcategoriaImagenUrl,
			Long profesionalId, Long profesionalUsuarioId, String nombreProfesional, String ciudadProfesional,
			String fotoUrlProfesional, Double valoracionMedia, Integer numeroValoraciones) {
		this.id = id;
		this.titulo = titulo;
		this.descripcion = descripcion;
		this.duracionMin = duracionMin;
		this.precioHora = precioHora;
		this.activa = activa;
		this.subcategoriaId = subcategoriaId;
		this.subcategoriaNombre = subcategoriaNombre;
		this.subcategoriaImagenUrl = subcategoriaImagenUrl;
		this.profesionalId = profesionalId;
		this.profesionalUsuarioId = profesionalUsuarioId;
		this.nombreProfesional = nombreProfesional;
		this.ciudadProfesional = ciudadProfesional;
		this.fotoUrlProfesional = fotoUrlProfesional;
		this.valoracionMedia = valoracionMedia;
		this.numeroValoraciones = numeroValoraciones;
	}

	// Getters
	public Long getId() {
		return id;
	}

	public String getTitulo() {
		return titulo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public Integer getDuracionMin() {
		return duracionMin;
	}

	public BigDecimal getPrecioHora() {
		return precioHora;
	}

	public boolean isActiva() {
		return activa;
	}

	public Long getSubcategoriaId() {
		return subcategoriaId;
	}

	public String getSubcategoriaNombre() {
		return subcategoriaNombre;
	}

	public String getSubcategoriaImagenUrl() {
		return subcategoriaImagenUrl;
	}

	public Long getProfesionalId() {
		return profesionalId;
	}

	public Long getProfesionalUsuarioId() {
		return profesionalUsuarioId;
	}

	public String getNombreProfesional() {
		return nombreProfesional;
	}

	public String getCiudadProfesional() {
		return ciudadProfesional;
	}

	public String getFotoUrlProfesional() {
		return fotoUrlProfesional;
	}

	public Double getValoracionMedia() {
		return valoracionMedia;
	}

	public Integer getNumeroValoraciones() {
		return numeroValoraciones;
	}

}
