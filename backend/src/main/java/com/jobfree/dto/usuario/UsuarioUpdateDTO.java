package com.jobfree.dto.usuario;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UsuarioUpdateDTO {

	private String nombre;

	private String apellidos;

	@Pattern(regexp = "^$|^\\+?[\\d\\s\\-]{6,20}$", message = "Teléfono no válido")
	private String telefono;

	// Null = no cambiar contraseña
	@Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
	@Pattern(
		regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
		message = "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
	)
	private String password;

	private String direccion;

	private String ciudad;

	private String fotoUrl;

	// Getters y setters

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

}
