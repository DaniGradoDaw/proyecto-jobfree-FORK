package com.jobfree.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.jobfree.model.entity.Usuario;

/**
 * Repositorio para acceder a la base de datos de usuarios.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	// Comprueba si ya existe un email
	boolean existsByEmail(String email);

	// Comprueba si ya existe un teléfono
	boolean existsByTelefono(String telefono);

	// Busca un usuario por email (login)
	Optional<Usuario> findByEmail(String email);

	@Modifying
	@Transactional
	@Query("UPDATE Usuario u SET u.ultimaConexion = :fecha WHERE u.id = :id")
	void actualizarUltimaConexion(@Param("id") Long id, @Param("fecha") LocalDateTime fecha);
}