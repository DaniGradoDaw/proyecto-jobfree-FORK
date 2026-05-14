package com.jobfree.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.jobfree.dto.notificacion.NotificacionDTO;
import com.jobfree.mapper.NotificacionMapper;
import com.jobfree.model.entity.Notificacion;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.NotificacionService;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/notificaciones")
public class NotificacionController {

	private final NotificacionService notificacionService;

	public NotificacionController(NotificacionService notificacionService) {
		this.notificacionService = notificacionService;
	}

	/**
	 * Obtiene todas las notificaciones del sistema (solo ADMIN).
	 *
	 * @return lista de notificaciones en formato DTO
	 */
	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public ResponseEntity<List<NotificacionDTO>> listarNotificaciones() {

		List<NotificacionDTO> dtos = notificacionService
				.listarNotificaciones()
				.stream()
				.map(NotificacionMapper::toDTO)
				.toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Obtiene las notificaciones del usuario autenticado.
	 *
	 * @return lista de notificaciones del usuario logueado
	 */
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/mias")
	public ResponseEntity<List<NotificacionDTO>> obtenerMisNotificaciones() {

		Usuario usuario = (Usuario) SecurityContextHolder
				.getContext()
				.getAuthentication()
				.getPrincipal();

		List<NotificacionDTO> dtos = notificacionService
				.obtenerPorUsuario(usuario.getId())
				.stream()
				.map(NotificacionMapper::toDTO)
				.toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Marca una notificación como leída.
	 *
	 * @param id identificador de la notificación
	 * @return notificación actualizada en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/leida")
	public ResponseEntity<NotificacionDTO> marcarComoLeida(@PathVariable Long id) {

		Usuario usuario = (Usuario) SecurityContextHolder
				.getContext()
				.getAuthentication()
				.getPrincipal();

		Notificacion actualizada = notificacionService
				.marcarComoLeida(id, usuario);

		return ResponseEntity.ok(
				NotificacionMapper.toDTO(actualizada)
		);
	}

	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarNotificacion(@PathVariable Long id) {
		notificacionService.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}
