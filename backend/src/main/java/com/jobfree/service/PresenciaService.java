package com.jobfree.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobfree.dto.realtime.PresenciaConexionEventDTO;
import com.jobfree.repository.ConversacionRepository;
import com.jobfree.repository.UsuarioRepository;

@Service
public class PresenciaService {

	private final ConcurrentHashMap<Long, AtomicInteger> sesionesActivas = new ConcurrentHashMap<>();

	private final UsuarioRepository usuarioRepository;
	private final ConversacionRepository conversacionRepository;
	private final SimpMessagingTemplate messagingTemplate;

	public PresenciaService(UsuarioRepository usuarioRepository,
							ConversacionRepository conversacionRepository,
							SimpMessagingTemplate messagingTemplate) {
		this.usuarioRepository = usuarioRepository;
		this.conversacionRepository = conversacionRepository;
		this.messagingTemplate = messagingTemplate;
	}

	@Transactional(readOnly = true)
	public void registrarConexion(Long usuarioId) {
		sesionesActivas.computeIfAbsent(usuarioId, k -> new AtomicInteger(0)).incrementAndGet();
		publicarPresencia(usuarioId, true, null);
	}

	@Transactional
	public void registrarDesconexion(Long usuarioId) {
		AtomicInteger contador = sesionesActivas.get(usuarioId);
		if (contador != null && contador.decrementAndGet() <= 0) {
			sesionesActivas.remove(usuarioId);
			LocalDateTime ahora = LocalDateTime.now();
			usuarioRepository.actualizarUltimaConexion(usuarioId, ahora);
			publicarPresencia(usuarioId, false, ahora);
		}
	}

	public boolean estaOnline(Long usuarioId) {
		AtomicInteger c = sesionesActivas.get(usuarioId);
		return c != null && c.get() > 0;
	}

	private void publicarPresencia(Long usuarioId, boolean online, LocalDateTime ultimaConexion) {
		List<Long> convIds = conversacionRepository.findIdsByParticipanteId(usuarioId);
		PresenciaConexionEventDTO evento = new PresenciaConexionEventDTO(usuarioId, online, ultimaConexion);
		for (Long convId : convIds) {
			messagingTemplate.convertAndSend("/topic/conversaciones/" + convId, evento);
		}
	}
}
