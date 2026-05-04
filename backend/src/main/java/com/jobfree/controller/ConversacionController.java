package com.jobfree.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.conversacion.ConversacionContactoCreateDTO;
import com.jobfree.dto.conversacion.ConversacionDTO;
import com.jobfree.dto.conversacion.SilenciarRequestDTO;
import com.jobfree.mapper.ConversacionMapper;
import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.BloqueoUsuarioRepository;
import com.jobfree.service.ChatRealtimePublisher;
import com.jobfree.service.ConversacionService;
import com.jobfree.service.MensajeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/conversaciones")
public class ConversacionController {

	private final ConversacionService conversacionService;
	private final MensajeService mensajeService;
	private final BloqueoUsuarioRepository bloqueoRepository;
	private final ChatRealtimePublisher chatRealtimePublisher;

	public ConversacionController(ConversacionService conversacionService, MensajeService mensajeService,
			BloqueoUsuarioRepository bloqueoRepository, ChatRealtimePublisher chatRealtimePublisher) {
		this.conversacionService = conversacionService;
		this.mensajeService = mensajeService;
		this.bloqueoRepository = bloqueoRepository;
		this.chatRealtimePublisher = chatRealtimePublisher;
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/mis")
	public ResponseEntity<List<ConversacionDTO>> misConversaciones() {
		Usuario usuario = getUsuarioAutenticado();

		List<Conversacion> conversaciones = conversacionService.misConversaciones(usuario);
		List<Long> ids = conversaciones.stream().map(Conversacion::getId).toList();
		Map<Long, Integer> noLeidosMap = mensajeService.contarNoLeidosPorConversaciones(ids, usuario.getId());

		List<ConversacionDTO> dtos = conversaciones.stream()
				.map(c -> {
					ConversacionDTO dto = ConversacionMapper.toDTO(c, usuario, bloqueoRepository);
					dto.setNoLeidos(noLeidosMap.getOrDefault(c.getId(), 0));
					return dto;
				})
				.collect(Collectors.toList());

		return ResponseEntity.ok(dtos);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/{id}")
	public ResponseEntity<ConversacionDTO> obtenerPorId(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		Conversacion conversacion = conversacionService.obtenerPorIdSeguro(id, usuario);
		return ResponseEntity.ok(ConversacionMapper.toDTO(conversacion, usuario, bloqueoRepository));
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/reserva/{reservaId}")
	public ResponseEntity<ConversacionDTO> obtenerPorReserva(@PathVariable Long reservaId) {
		Usuario usuario = getUsuarioAutenticado();
		Conversacion conversacion = conversacionService.obtenerPorReservaSeguro(reservaId, usuario);
		return ResponseEntity.ok(ConversacionMapper.toDTO(conversacion, usuario, bloqueoRepository));
	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping("/contacto")
	public ResponseEntity<ConversacionDTO> crearOObtenerContacto(@Valid @RequestBody ConversacionContactoCreateDTO dto) {
		Usuario usuario = getUsuarioAutenticado();
		Conversacion conversacion = conversacionService.crearOObtenerConversacion(usuario.getId(), dto.getProfesionalId());
		return ResponseEntity.ok(ConversacionMapper.toDTO(conversacion, usuario, bloqueoRepository));
	}

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/silenciar")
	public ResponseEntity<ConversacionDTO> silenciar(
			@PathVariable Long id,
			@RequestBody(required = false) SilenciarRequestDTO request) {
		Usuario usuario = getUsuarioAutenticado();
		String duracion = (request != null) ? request.getDuracion() : null;
		Conversacion conversacion = conversacionService.silenciar(id, usuario, duracion);
		ConversacionDTO dto = ConversacionMapper.toDTO(conversacion, usuario, bloqueoRepository);
		int noLeidos = mensajeService.contarNoLeidosPorConversaciones(List.of(id), usuario.getId())
				.getOrDefault(id, 0);
		dto.setNoLeidos(noLeidos);
		chatRealtimePublisher.publicarConversacionActualizada(conversacion.getId(), dto, usuario.getEmail());
		return ResponseEntity.ok(dto);
	}

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/fijar")
	public ResponseEntity<ConversacionDTO> toggleFijar(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		Conversacion conversacion = conversacionService.toggleFijar(id, usuario);
		ConversacionDTO dto = ConversacionMapper.toDTO(conversacion, usuario, bloqueoRepository);
		int noLeidos = mensajeService.contarNoLeidosPorConversaciones(List.of(id), usuario.getId())
				.getOrDefault(id, 0);
		dto.setNoLeidos(noLeidos);
		chatRealtimePublisher.publicarConversacionActualizada(conversacion.getId(), dto, usuario.getEmail());
		return ResponseEntity.ok(dto);
	}

	private Usuario getUsuarioAutenticado() {
		return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
}
