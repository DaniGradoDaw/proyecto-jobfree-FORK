package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.exception.notificacion.NotificacionNotFoundException;
import com.jobfree.model.entity.Notificacion;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.NotificacionRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class NotificacionService {

	private final NotificacionRepository notificacionRepository;

	public NotificacionService(NotificacionRepository notificacionRepository) {
		this.notificacionRepository = notificacionRepository;
	}

	/**
	 * Obtiene todas las notificaciones del sistema (uso ADMIN).
	 *
	 * @return lista de notificaciones
	 */
	public List<Notificacion> listarNotificaciones() {
		return notificacionRepository.findAll();
	}

	/**
	 * Obtiene las notificaciones de un usuario ordenadas por fecha de creación
	 * descendente (las más recientes primero).
	 *
	 * @param usuarioId id del usuario
	 * @return lista de notificaciones ordenadas
	 */
	public List<Notificacion> obtenerPorUsuario(Long usuarioId) {
		return notificacionRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
	}

	/**
	 * Marca una notificación como leída. Solo el propietario puede hacerlo.
	 *
	 * @param id      id de la notificación
	 * @param usuario usuario autenticado
	 * @return notificación actualizada
	 * @throws NotificacionNotFoundException si no existe
	 */
	public Notificacion marcarComoLeida(Long id, Usuario usuario) {

		Notificacion notificacion = notificacionRepository.findById(id)
				.orElseThrow(() -> new NotificacionNotFoundException(id));

		// Seguridad
		if (!notificacion.getUsuario().getId().equals(usuario.getId())) {
			throw new IllegalArgumentException("Acceso denegado a esta notificación");
		}

		// Evitar guardar si ya está leída
		if (notificacion.isLeida()) {
			return notificacion;
		}

		notificacion.setLeida(true);

		return notificacionRepository.save(notificacion);
	}

	/**
	 * Crea una notificación interna. ESTE MÉTODO NO ES PARA CONTROLADOR (uso
	 * interno del sistema).
	 *
	 * @param mensaje texto de la notificación
	 * @param usuario usuario destinatario
	 * @return notificación creada
	 */
	public void eliminar(Long id) {
		Notificacion notificacion = notificacionRepository.findById(id)
				.orElseThrow(() -> new NotificacionNotFoundException(id));
		notificacionRepository.delete(notificacion);
	}

	public Notificacion crear(String mensaje, Usuario usuario) {

		Notificacion notificacion = new Notificacion();

		notificacion.setMensaje(mensaje);
		notificacion.setUsuario(usuario);

		return notificacionRepository.save(notificacion);
	}
}
