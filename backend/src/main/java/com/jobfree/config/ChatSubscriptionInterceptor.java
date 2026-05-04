package com.jobfree.config;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Component;

import com.jobfree.model.entity.Usuario;
import com.jobfree.service.ConversacionService;

@Component
public class ChatSubscriptionInterceptor implements ChannelInterceptor {

    private static final Logger log = LoggerFactory.getLogger(ChatSubscriptionInterceptor.class);
    private static final String CONV_TOPIC_PREFIX = "/topic/conversaciones/";
    private static final String USER_TOPIC_PREFIX = "/topic/usuario/";

    private final ConversacionService conversacionService;

    public ChatSubscriptionInterceptor(ConversacionService conversacionService) {
        this.conversacionService = conversacionService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null || accessor.getCommand() != StompCommand.SUBSCRIBE) {
            return message;
        }

        String destino = accessor.getDestination();
        Principal principal = accessor.getUser();

        if (destino == null) {
            return message;
        }

        if (principal == null) {
            log.warn("Intento de suscripción anónima al canal: {}", destino);
            throw new SecurityException("Se requiere autenticación para suscribirse a este canal");
        }

        // El principal puede ser el Usuario directamente o estar envuelto en un
        // AbstractAuthenticationToken (caso habitual con JWT + Spring Security).
        Usuario usuario;
        if (principal instanceof Usuario u) {
            usuario = u;
        } else if (principal instanceof AbstractAuthenticationToken auth
                && auth.getPrincipal() instanceof Usuario u) {
            usuario = u;
        } else {
            log.warn("Principal de tipo inesperado ({}) intentando suscribirse a: {}", principal.getClass().getSimpleName(), destino);
            throw new SecurityException("Usuario no autenticado para la suscripción");
        }

        if (destino.startsWith(CONV_TOPIC_PREFIX)) {
            validarSuscripcionConversacion(destino, usuario);
        } else if (destino.startsWith(USER_TOPIC_PREFIX)) {
            validarSuscripcionUsuario(destino, usuario);
        }

        return message;
    }

    private void validarSuscripcionConversacion(String destino, Usuario usuario) {
        Long conversacionId = extraerIdNumerico(destino, CONV_TOPIC_PREFIX);
        if (conversacionId == null) {
            log.warn("Usuario {} intentó suscribirse a canal de conversación con ID inválido: {}", usuario.getId(), destino);
            throw new IllegalArgumentException("ID de conversación inválido en el destino: " + destino);
        }
        // Lanza excepción si el usuario no es participante
        conversacionService.obtenerPorIdSeguro(conversacionId, usuario);
        log.debug("Usuario {} autorizado para conversación {}", usuario.getId(), conversacionId);
    }

    private void validarSuscripcionUsuario(String destino, Usuario usuario) {
        Long usuarioIdCanal = extraerIdNumerico(destino, USER_TOPIC_PREFIX);
        if (usuarioIdCanal == null) {
            log.warn("Usuario {} intentó suscribirse a canal de usuario con ID inválido: {}", usuario.getId(), destino);
            throw new IllegalArgumentException("ID de usuario inválido en el destino: " + destino);
        }
        // Un usuario solo puede suscribirse a su propio canal
        if (!usuario.getId().equals(usuarioIdCanal)) {
            log.warn("Usuario {} intentó suscribirse al canal de otro usuario: {}", usuario.getId(), usuarioIdCanal);
            throw new SecurityException("No puedes suscribirte al canal de otro usuario");
        }
        log.debug("Usuario {} autorizado para su canal personal", usuario.getId());
    }

    private Long extraerIdNumerico(String destino, String prefijo) {
        try {
            String valor = destino.substring(prefijo.length());
            return Long.parseLong(valor);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
