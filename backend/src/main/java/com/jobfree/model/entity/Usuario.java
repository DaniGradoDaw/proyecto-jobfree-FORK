package com.jobfree.model.entity;

import java.util.ArrayList;
import java.util.List;
import java.security.Principal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobfree.model.enums.Rol;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Representa a los usuarios de la web JobFree.
 */
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "usuario")
public class Usuario implements Principal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	@Column(nullable = false, length = 100)
	private String nombre;

	@Column(nullable = false, length = 150)
	private String apellidos;

	@Column(nullable = false, unique = true, length = 150)
	private String email;

	@Column(nullable = false, length = 20, unique = true)
	private String telefono;

	// Permite enviar la contraseña pero nunca devolverla
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(nullable = false, length = 255)
	private String password;

	// Rol del usuario dentro de la plataforma
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Rol rol = Rol.CLIENTE;

	// Dirección completa del usuario (es un dato privado)
	@Column(length = 150)
	private String direccion;

	// Ciudad donde trabaja el profesional (es lo que se muestra en la web)
	@Column(length = 100)
	private String ciudad;

	// URL de la foto de perfil (ruta relativa al directorio de uploads)
	@Column(length = 255)
	private String fotoUrl;

	@Column
	private LocalDateTime ultimaConexion;

	@Column(nullable = false)
	private boolean activo = true;

	// Un usuario puede tener un perfil profesional si es profesional
	@JsonIgnore
	@OneToOne(mappedBy = "usuario", fetch = FetchType.LAZY)
	private ProfesionalInfo profesionalInfo;

	// Un cliente puede tener muchas reservas
	@JsonIgnore
	@OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
	private List<Reserva> reservas = new ArrayList<>();

	// Un cliente puede realizar muchas valoraciones
	@OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Valoracion> valoraciones = new ArrayList<>();

	// Un usuario puede enviar muchos mensajes
	@JsonIgnore
	@OneToMany(mappedBy = "remitente", fetch = FetchType.LAZY)
	private List<Mensaje> mensajesEnviados = new ArrayList<>();

	// Un usuario puede recibir muchos mensajes
	@JsonIgnore
	@OneToMany(mappedBy = "destinatario", fetch = FetchType.LAZY)
	private List<Mensaje> mensajesRecibidos = new ArrayList<>();

	// Un usuario puede tener muchas notificaciones
	@JsonIgnore
	@OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
	private List<Notificacion> notificaciones = new ArrayList<>();

	// Constructor vacío obligatorio
	public Usuario() {
	}

	public Usuario(String nombre, String apellidos, String email, String telefono, String password, String direccion,
			String ciudad) {
		this.nombre = nombre;
		this.apellidos = apellidos;
		this.email = email;
		this.telefono = telefono;
		this.password = password;
		this.direccion = direccion;
		this.ciudad = ciudad;
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellidos() {
		return apellidos;
	}

	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	public String getNombreCompleto() {
		return nombre + " " + apellidos;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String getName() {
		return email;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Rol getRol() {
		return rol;
	}

	public void setRol(Rol rol) {
		this.rol = rol;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getCiudad() {
		return ciudad;
	}

	public void setCiudad(String ciudad) {
		this.ciudad = ciudad;
	}

	public String getFotoUrl() {
		return fotoUrl;
	}

	public void setFotoUrl(String fotoUrl) {
		this.fotoUrl = fotoUrl;
	}

	public LocalDateTime getUltimaConexion() {
		return ultimaConexion;
	}

	public void setUltimaConexion(LocalDateTime ultimaConexion) {
		this.ultimaConexion = ultimaConexion;
	}

	public boolean isActivo() {
		return activo;
	}

	public void setActivo(boolean activo) {
		this.activo = activo;
	}

	public ProfesionalInfo getProfesionalInfo() {
		return profesionalInfo;
	}

	public void setProfesionalInfo(ProfesionalInfo profesionalInfo) {
		this.profesionalInfo = profesionalInfo;
	}

	public List<Reserva> getReservas() {
		return reservas;
	}

	public void setReservas(List<Reserva> reservas) {
		this.reservas = reservas;
	}

	public List<Valoracion> getValoraciones() {
		return valoraciones;
	}

	public void setValoraciones(List<Valoracion> valoraciones) {
		this.valoraciones = valoraciones;
	}

	public List<Mensaje> getMensajesEnviados() {
		return mensajesEnviados;
	}

	public void setMensajesEnviados(List<Mensaje> mensajesEnviados) {
		this.mensajesEnviados = mensajesEnviados;
	}

	public List<Mensaje> getMensajesRecibidos() {
		return mensajesRecibidos;
	}

	public void setMensajesRecibidos(List<Mensaje> mensajesRecibidos) {
		this.mensajesRecibidos = mensajesRecibidos;
	}

	public List<Notificacion> getNotificaciones() {
		return notificaciones;
	}

	public void setNotificaciones(List<Notificacion> notificaciones) {
		this.notificaciones = notificaciones;
	}

}
