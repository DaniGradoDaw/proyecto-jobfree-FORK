package com.jobfree.dto.usuario;

public class UsuarioDTO {

    private Long id;
    private String nombre;
    private String apellidos;
    private String nombreCompleto;
    private String email;
    private String telefono;
    private String ciudad;
    private String direccion;
    private String fotoUrl;
    private String rol;
    private boolean activo;

    public UsuarioDTO() {}

    public UsuarioDTO(Long id, String nombre, String apellidos, String nombreCompleto,
                      String email, String telefono, String ciudad, String direccion,
                      String fotoUrl, String rol, boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.telefono = telefono;
        this.ciudad = ciudad;
        this.direccion = direccion;
        this.fotoUrl = fotoUrl;
        this.rol = rol;
        this.activo = activo;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getApellidos() { return apellidos; }
    public String getNombreCompleto() { return nombreCompleto; }
    public String getEmail() { return email; }
    public String getTelefono() { return telefono; }
    public String getCiudad() { return ciudad; }
    public String getDireccion() { return direccion; }
    public String getFotoUrl() { return fotoUrl; }
    public String getRol() { return rol; }
    public boolean isActivo() { return activo; }
}
