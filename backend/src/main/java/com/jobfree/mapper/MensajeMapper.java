package com.jobfree.mapper;

import com.jobfree.dto.mensaje.MensajeCreateDTO;
import com.jobfree.dto.mensaje.MensajeDTO;
import com.jobfree.dto.reaccion.ReaccionDTO;
import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Mensaje;
import com.jobfree.model.entity.MensajeReaccion;
import com.jobfree.model.entity.Usuario;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Mapper para convertir entre la entidad Mensaje y sus DTOs.
 */
public class MensajeMapper {

	/**
	 * Convierte una entidad Mensaje a su DTO de salida.
	 *
	 * @param m entidad mensaje
	 * @return DTO con los datos necesarios para la respuesta
	 */
	public static MensajeDTO toDTO(Mensaje m) {
		MensajeDTO dto = new MensajeDTO(m.getId(), m.getContenido(), m.getClientMessageId(), m.isLeido(), m.isRecibido(), m.getFechaEnvio(), m.getRemitente().getId(),
				m.getDestinatario().getId(), m.getConversacion().getId());
		dto.setImagenUrl(m.getImagenUrl());
		return dto;
	}

	public static MensajeDTO toDTOFull(Mensaje m) {
		MensajeDTO dto = toDTO(m);
		Mensaje mr = m.getMensajeRespondido();
		if (mr != null) {
			dto.setMensajeRespondidoId(mr.getId());
			String contenido = mr.getContenido();
			if (contenido == null || contenido.isBlank()) {
				contenido = mr.getImagenUrl() != null ? "📷 Imagen" : "";
			}
			dto.setMensajeRespondidoContenido(contenido.length() > 120 ? contenido.substring(0, 117) + "..." : contenido);
			dto.setMensajeRespondidoRemitenteId(mr.getRemitente().getId());
		}
		List<MensajeReaccion> reacciones = m.getReacciones();
		if (reacciones != null && !reacciones.isEmpty()) {
			Map<String, List<Long>> porEmoji = new LinkedHashMap<>();
			for (MensajeReaccion r : reacciones) {
				porEmoji.computeIfAbsent(r.getEmoji(), k -> new ArrayList<>())
						.add(r.getUsuario().getId());
			}
			dto.setReacciones(porEmoji.entrySet().stream()
					.map(e -> new ReaccionDTO(e.getKey(), e.getValue()))
					.toList());
		}
		return dto;
	}

	/**
	 * Convierte un DTO de creación a entidad Mensaje.
	 *
	 * @param dto          datos de entrada
	 * @param remitente    usuario que envía el mensaje
	 * @param destinatario usuario que recibe el mensaje
	 * @param conversacion conversación asociada
	 * @return entidad lista para persistir
	 */
	public static Mensaje toEntity(MensajeCreateDTO dto, Usuario remitente, Usuario destinatario, Conversacion conversacion) {

		Mensaje m = new Mensaje();

		m.setContenido(dto.getContenido() != null ? dto.getContenido() : "");
		m.setClientMessageId(dto.getClientMessageId());
		m.setRemitente(remitente);
		m.setDestinatario(destinatario);
		m.setConversacion(conversacion);
		m.setImagenUrl(dto.getImagenUrl());

		return m;
	}
}
