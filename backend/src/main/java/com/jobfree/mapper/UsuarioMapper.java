package com.jobfree.mapper;

import com.jobfree.dto.usuario.UsuarioCreateDTO;
import com.jobfree.dto.usuario.UsuarioDTO;
import com.jobfree.dto.usuario.UsuarioUpdateDTO;
import com.jobfree.model.entity.Usuario;

/**
 * Mapper para convertir entre la entidad Usuario y sus DTOs.
 */
public final class UsuarioMapper {

    /**
     * Convierte un DTO de creación a entidad Usuario.
     *
     * @param dto datos de entrada para crear un usuario
     * @return entidad lista para persistir
     */
    public static Usuario toEntity(UsuarioCreateDTO dto) {
        Usuario u = new Usuario();

        u.setNombre(dto.getNombre());
        u.setApellidos(dto.getApellidos());
        u.setEmail(dto.getEmail());
        u.setTelefono(dto.getTelefono());
        u.setPassword(dto.getPassword());
        u.setDireccion(dto.getDireccion());
        u.setCiudad(dto.getCiudad());

        return u;
    }

    /**
     * Convierte un DTO de actualización a entidad Usuario.
     *
     * @param dto datos de entrada para actualizar un usuario
     * @return entidad con los datos actualizados
     */
    public static Usuario toEntity(UsuarioUpdateDTO dto) {
        Usuario u = new Usuario();

        u.setNombre(dto.getNombre());
        u.setApellidos(dto.getApellidos());
        u.setTelefono(dto.getTelefono());
        u.setPassword(dto.getPassword());
        u.setDireccion(dto.getDireccion());
        u.setCiudad(dto.getCiudad());
        u.setFotoUrl(dto.getFotoUrl());

        return u;
    }

    /**
     * Convierte una entidad Usuario a su DTO de salida.
     *
     * @param usuario entidad usuario
     * @return DTO con los datos necesarios para la respuesta
     */
    public static UsuarioDTO toDTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellidos(),
                usuario.getNombreCompleto(),
                usuario.getEmail(),
                usuario.getTelefono(),
                usuario.getCiudad(),
                usuario.getDireccion(),
                usuario.getFotoUrl(),
                usuario.getRol().name(),
                usuario.isActivo()
        );
    }

    /**
     * DTO sin datos sensibles (dirección, teléfono) para contextos donde el
     * usuario es visible a terceros (ej. participante de una conversación).
     */
    public static UsuarioDTO toDTOPublico(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellidos(),
                usuario.getNombreCompleto(),
                usuario.getEmail(),
                null,
                usuario.getCiudad(),
                null,
                usuario.getFotoUrl(),
                usuario.getRol().name(),
                usuario.isActivo()
        );
    }
}
