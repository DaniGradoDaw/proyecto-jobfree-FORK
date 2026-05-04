package com.jobfree.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jobfree.dto.realtime.PresenciaEscribiendoEventDTO;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.UsuarioRepository;
import com.jobfree.service.ConversacionService;
import com.jobfree.service.PresenciaService;

@Controller
public class PresenciaController {

	private final ConversacionService conversacionService;
	private final PresenciaService presenciaService;
	private final UsuarioRepository usuarioRepository;
	private final SimpMessagingTemplate messagingTemplate;

	public PresenciaController(ConversacionService conversacionService,
							   PresenciaService presenciaService,
							   UsuarioRepository usuarioRepository,
							   SimpMessagingTemplate messagingTemplate) {
		this.conversacionService = conversacionService;
		this.presenciaService = presenciaService;
		this.usuarioRepository = usuarioRepository;
		this.messagingTemplate = messagingTemplate;
	}

	@MessageMapping("/conversaciones/{id}/escribiendo")
	public void escribiendo(@DestinationVariable Long id, Principal principal) {
		Usuario usuario = extractUsuario(principal);
		if (usuario == null) return;
		try {
			conversacionService.obtenerPorIdSeguro(id, usuario);
		} catch (Exception e) {
			return;
		}
		messagingTemplate.convertAndSend(
				"/topic/conversaciones/" + id,
				new PresenciaEscribiendoEventDTO(id, usuario.getId())
		);
	}

	@ResponseBody
	@GetMapping("/usuarios/{id}/presencia")
	@PreAuthorize("isAuthenticated()")
	public Map<String, Object> presencia(@PathVariable Long id) {
		boolean online = presenciaService.estaOnline(id);
		java.time.LocalDateTime ultimaConexion = usuarioRepository.findById(id)
				.map(Usuario::getUltimaConexion)
				.orElse(null);
		return Map.of(
				"online", online,
				"ultimaConexion", ultimaConexion != null ? ultimaConexion.toString() : ""
		);
	}

	private Usuario extractUsuario(Principal principal) {
		if (principal instanceof Usuario u) return u;
		if (principal instanceof AbstractAuthenticationToken auth
				&& auth.getPrincipal() instanceof Usuario u) return u;
		return null;
	}
}
