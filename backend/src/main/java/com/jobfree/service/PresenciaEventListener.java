package com.jobfree.service;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.jobfree.model.entity.Usuario;

@Component
public class PresenciaEventListener {

	private static final Logger log = LoggerFactory.getLogger(PresenciaEventListener.class);

	private final PresenciaService presenciaService;

	public PresenciaEventListener(PresenciaService presenciaService) {
		this.presenciaService = presenciaService;
	}

	@EventListener
	public void onConexion(SessionConnectedEvent event) {
		extractUsuarioId(event.getUser()).ifPresent(id -> {
			log.debug("WS conectado: usuario {}", id);
			presenciaService.registrarConexion(id);
		});
	}

	@EventListener
	public void onDesconexion(SessionDisconnectEvent event) {
		extractUsuarioId(event.getUser()).ifPresent(id -> {
			log.debug("WS desconectado: usuario {}", id);
			presenciaService.registrarDesconexion(id);
		});
	}

	private java.util.Optional<Long> extractUsuarioId(Principal principal) {
		if (principal instanceof Usuario u) return java.util.Optional.of(u.getId());
		if (principal instanceof AbstractAuthenticationToken auth
				&& auth.getPrincipal() instanceof Usuario u) return java.util.Optional.of(u.getId());
		return java.util.Optional.empty();
	}
}
