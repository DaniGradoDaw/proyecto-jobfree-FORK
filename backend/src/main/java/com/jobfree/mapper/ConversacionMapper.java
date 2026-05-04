package com.jobfree.mapper;

import java.time.LocalDateTime;

import com.jobfree.dto.conversacion.ConversacionDTO;
import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Usuario;

public class ConversacionMapper {

	public static ConversacionDTO toDTO(Conversacion conversacion) {
		ConversacionDTO dto = new ConversacionDTO();

		dto.setId(conversacion.getId());
		dto.setReservaId(conversacion.getReserva() != null ? conversacion.getReserva().getId() : null);
		dto.setEstadoReserva(conversacion.getReserva() != null ? conversacion.getReserva().getEstado().name() : null);
		dto.setFechaCreacion(conversacion.getFechaCreacion());

		Usuario cliente = conversacion.getCliente();
		dto.setClienteId(cliente.getId());
		dto.setClienteNombre(cliente.getNombreCompleto());
		dto.setClienteFotoUrl(cliente.getFotoUrl());

		Usuario profesional = conversacion.getProfesional();
		dto.setProfesionalId(profesional.getId());
		dto.setProfesionalNombre(profesional.getNombreCompleto());
		dto.setProfesionalFotoUrl(profesional.getFotoUrl());

		dto.setServicioTitulo(
				conversacion.getReserva() != null
						? conversacion.getReserva().getServicio().getTitulo()
						: "Contacto inicial"
		);

		dto.setUltimoMensaje(conversacion.getUltimoMensajeContenido());
		dto.setFechaUltimoMensaje(conversacion.getUltimoMensajeFecha());

		return dto;
	}

	/**
	 * Igual que toDTO pero rellena otroUsuario*, silenciada, fijada, bloqueado y meBloqueo
	 * según la perspectiva del usuario autenticado.
	 * Usar en endpoints REST donde se conoce el usuario; NO en eventos WebSocket (van a ambos).
	 */
	public static ConversacionDTO toDTO(Conversacion conversacion, Usuario usuarioActual,
			com.jobfree.repository.BloqueoUsuarioRepository bloqueoRepository) {
		ConversacionDTO dto = toDTO(conversacion);

		boolean esCliente = conversacion.getCliente().getId().equals(usuarioActual.getId());
		Usuario otroUsuario = esCliente ? conversacion.getProfesional() : conversacion.getCliente();

		dto.setOtroUsuarioId(otroUsuario.getId());
		dto.setOtroUsuarioNombre(otroUsuario.getNombreCompleto());
		dto.setOtroUsuarioFoto(otroUsuario.getFotoUrl());
		dto.setOtroUsuarioUltimaConexion(otroUsuario.getUltimaConexion());

		LocalDateTime hasta = esCliente ? conversacion.getSilenciadaClienteHasta() : conversacion.getSilenciadaProfesionalHasta();
		dto.setSilenciada(hasta != null && LocalDateTime.now().isBefore(hasta));
		dto.setFijada(esCliente ? conversacion.isFijadaCliente() : conversacion.isFijadaProfesional());

		Long miId = usuarioActual.getId();
		Long otroId = otroUsuario.getId();
		dto.setBloqueado(bloqueoRepository.existsByBloqueadorIdAndBloqueadoId(miId, otroId));
		dto.setMeBloqueo(bloqueoRepository.existsByBloqueadorIdAndBloqueadoId(otroId, miId));

		return dto;
	}

	/** Compatibilidad: sin bloqueos (para contextos donde no se inyecta el repositorio). */
	public static ConversacionDTO toDTO(Conversacion conversacion, Usuario usuarioActual) {
		ConversacionDTO dto = toDTO(conversacion);

		boolean esCliente = conversacion.getCliente().getId().equals(usuarioActual.getId());
		Usuario otroUsuario = esCliente ? conversacion.getProfesional() : conversacion.getCliente();

		dto.setOtroUsuarioId(otroUsuario.getId());
		dto.setOtroUsuarioNombre(otroUsuario.getNombreCompleto());
		dto.setOtroUsuarioFoto(otroUsuario.getFotoUrl());
		dto.setOtroUsuarioUltimaConexion(otroUsuario.getUltimaConexion());

		LocalDateTime hasta = esCliente ? conversacion.getSilenciadaClienteHasta() : conversacion.getSilenciadaProfesionalHasta();
		dto.setSilenciada(hasta != null && LocalDateTime.now().isBefore(hasta));
		dto.setFijada(esCliente ? conversacion.isFijadaCliente() : conversacion.isFijadaProfesional());

		return dto;
	}
}
