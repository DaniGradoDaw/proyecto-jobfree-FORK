package com.jobfree.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.jobfree.dto.conversacion.ConversacionDTO;
import com.jobfree.dto.mensaje.MensajeDTO;
import com.jobfree.dto.reaccion.ReaccionDTO;
import com.jobfree.dto.realtime.MensajeEstadoDTO;
import com.jobfree.dto.realtime.ConversacionActualizadaEventDTO;
import com.jobfree.dto.realtime.MensajeEstadoLoteEventDTO;
import com.jobfree.dto.realtime.MensajeEditadoEventDTO;
import com.jobfree.dto.realtime.MensajeEliminadoEventDTO;
import com.jobfree.dto.realtime.MensajeNuevoEventDTO;
import com.jobfree.dto.realtime.MensajeReaccionEventDTO;
import com.jobfree.dto.realtime.UsuarioMensajesActualizadosEventDTO;
import com.jobfree.model.entity.Mensaje;

@Service
public class ChatRealtimePublisher {

	private final SimpMessagingTemplate messagingTemplate;

	public ChatRealtimePublisher(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	public void publicarMensajeNuevo(Long conversacionId, MensajeDTO mensaje, String... usuariosDestino) {
		MensajeNuevoEventDTO evento = new MensajeNuevoEventDTO(conversacionId, mensaje);

		messagingTemplate.convertAndSend("/topic/conversaciones/" + conversacionId, evento);

		for (String usuarioDestino : usuariosDestino) {
			if (usuarioDestino == null || usuarioDestino.isBlank()) {
				continue;
			}
			messagingTemplate.convertAndSendToUser(usuarioDestino, "/queue/conversaciones", evento);
		}
	}

	public void publicarMensajeEditado(Long conversacionId, MensajeDTO mensaje, String emailA, String emailB) {
		MensajeEditadoEventDTO evento = new MensajeEditadoEventDTO(conversacionId, mensaje);
		messagingTemplate.convertAndSend("/topic/conversaciones/" + conversacionId, evento);
		for (String email : List.of(emailA, emailB)) {
			if (email != null && !email.isBlank()) {
				messagingTemplate.convertAndSendToUser(email, "/queue/conversaciones", evento);
			}
		}
	}

	public void publicarMensajeEliminado(Long conversacionId, MensajeDTO mensaje, String emailA, String emailB) {
		MensajeEliminadoEventDTO evento = new MensajeEliminadoEventDTO(conversacionId, mensaje);
		messagingTemplate.convertAndSend("/topic/conversaciones/" + conversacionId, evento);
		for (String email : List.of(emailA, emailB)) {
			if (email != null && !email.isBlank()) {
				messagingTemplate.convertAndSendToUser(email, "/queue/conversaciones", evento);
			}
		}
	}

	public void publicarConversacionActualizada(Long conversacionId, ConversacionDTO conversacion, String... usuariosDestino) {
		ConversacionActualizadaEventDTO evento = new ConversacionActualizadaEventDTO(conversacionId, conversacion);

		for (String usuarioDestino : usuariosDestino) {
			if (usuarioDestino == null || usuarioDestino.isBlank()) {
				continue;
			}
			messagingTemplate.convertAndSendToUser(usuarioDestino, "/queue/conversaciones", evento);
		}
	}

	/**
	 * Envía un evento conversacion.actualizada personalizado para cada usuario,
	 * con sus campos otroUsuario* y noLeidos ya calculados.
	 */
	public void publicarConversacionActualizadaPersonalizada(
			Long conversacionId,
			ConversacionDTO dtoA, String emailA,
			ConversacionDTO dtoB, String emailB) {

		if (emailA != null && !emailA.isBlank()) {
			messagingTemplate.convertAndSendToUser(
					emailA, "/queue/conversaciones",
					new ConversacionActualizadaEventDTO(conversacionId, dtoA));
		}
		if (emailB != null && !emailB.isBlank()) {
			messagingTemplate.convertAndSendToUser(
					emailB, "/queue/conversaciones",
					new ConversacionActualizadaEventDTO(conversacionId, dtoB));
		}
	}

	public void publicarMensajeLeido(Long conversacionId, Long mensajeId, Long lectorId, String... usuariosDestino) {
		publicarMensajeLeidoLote(conversacionId, List.of(mensajeId), lectorId, usuariosDestino);
	}

	public void publicarMensajeRecibido(Long conversacionId, Long mensajeId, Long receptorId, String... usuariosDestino) {
		publicarMensajeRecibidoLote(conversacionId, List.of(mensajeId), receptorId, usuariosDestino);
	}

	public void publicarMensajeLeidoLote(Long conversacionId, List<Long> mensajeIds, Long lectorId, String... usuariosDestino) {
		if (mensajeIds == null || mensajeIds.isEmpty()) {
			return;
		}

		List<MensajeEstadoDTO> mensajes = mensajeIds.stream()
				.map(id -> new MensajeEstadoDTO(id, true, true, null))
				.collect(Collectors.toList());

		MensajeEstadoLoteEventDTO evento = new MensajeEstadoLoteEventDTO(
				"mensaje.leido.lote",
				conversacionId,
				mensajes,
				lectorId
		);

		messagingTemplate.convertAndSend("/topic/conversaciones/" + conversacionId, evento);

		for (String usuarioDestino : usuariosDestino) {
			if (usuarioDestino == null || usuarioDestino.isBlank()) {
				continue;
			}
			messagingTemplate.convertAndSendToUser(
					usuarioDestino,
					"/queue/conversaciones",
					new UsuarioMensajesActualizadosEventDTO(evento)
			);
		}
	}

	public void publicarMensajeRecibidoLote(Long conversacionId, List<Long> mensajeIds, Long receptorId, String... usuariosDestino) {
		if (mensajeIds == null || mensajeIds.isEmpty()) {
			return;
		}

		List<MensajeEstadoDTO> mensajes = mensajeIds.stream()
				.map(id -> new MensajeEstadoDTO(id, false, true, null))
				.collect(Collectors.toList());

		MensajeEstadoLoteEventDTO evento = new MensajeEstadoLoteEventDTO(
				"mensaje.recibido.lote",
				conversacionId,
				mensajes,
				receptorId
		);

		messagingTemplate.convertAndSend("/topic/conversaciones/" + conversacionId, evento);

		for (String usuarioDestino : usuariosDestino) {
			if (usuarioDestino == null || usuarioDestino.isBlank()) {
				continue;
			}
			messagingTemplate.convertAndSendToUser(
					usuarioDestino,
					"/queue/conversaciones",
					new UsuarioMensajesActualizadosEventDTO(evento)
			);
		}
	}

	public void publicarMensajeLeidoLoteDesdeMensajes(Long conversacionId, List<Mensaje> mensajes, Long lectorId, String... usuariosDestino) {
		publicarEventoEstadoLote("mensaje.leido.lote", conversacionId, mensajes, lectorId, usuariosDestino);
	}

	public void publicarMensajeRecibidoLoteDesdeMensajes(Long conversacionId, List<Mensaje> mensajes, Long receptorId, String... usuariosDestino) {
		publicarEventoEstadoLote("mensaje.recibido.lote", conversacionId, mensajes, receptorId, usuariosDestino);
	}

	public void publicarReaccion(Long conversacionId, Long mensajeId, List<ReaccionDTO> reacciones, String... usuariosDestino) {
		MensajeReaccionEventDTO evento = new MensajeReaccionEventDTO(conversacionId, mensajeId, reacciones);
		messagingTemplate.convertAndSend("/topic/conversaciones/" + conversacionId, evento);
		for (String usuarioDestino : usuariosDestino) {
			if (usuarioDestino == null || usuarioDestino.isBlank()) continue;
			messagingTemplate.convertAndSendToUser(usuarioDestino, "/queue/conversaciones", evento);
		}
	}

	private void publicarEventoEstadoLote(String tipo, Long conversacionId, List<Mensaje> mensajes, Long usuarioId, String... usuariosDestino) {
		if (mensajes == null || mensajes.isEmpty()) {
			return;
		}

		List<MensajeEstadoDTO> estados = mensajes.stream()
				.map(mensaje -> new MensajeEstadoDTO(
						mensaje.getId(),
						mensaje.isLeido(),
						mensaje.isRecibido(),
						mensaje.getFechaEnvio()
				))
				.collect(Collectors.toList());

		MensajeEstadoLoteEventDTO evento = new MensajeEstadoLoteEventDTO(tipo, conversacionId, estados, usuarioId);

		messagingTemplate.convertAndSend("/topic/conversaciones/" + conversacionId, evento);

		for (String usuarioDestino : usuariosDestino) {
			if (usuarioDestino == null || usuarioDestino.isBlank()) {
				continue;
			}
			messagingTemplate.convertAndSendToUser(
					usuarioDestino,
					"/queue/conversaciones",
					new UsuarioMensajesActualizadosEventDTO(evento)
			);
		}
	}
}
