package com.jobfree.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.bloqueo.BloqueoUsuarioDTO;
import com.jobfree.model.entity.BloqueoUsuario;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.UsuarioRepository;
import com.jobfree.service.BloqueoUsuarioService;

@RestController
@RequestMapping("/bloqueos")
public class BloqueoUsuarioController {

    private final BloqueoUsuarioService bloqueoService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UsuarioRepository usuarioRepository;

    public BloqueoUsuarioController(BloqueoUsuarioService bloqueoService, SimpMessagingTemplate messagingTemplate,
            UsuarioRepository usuarioRepository) {
        this.bloqueoService = bloqueoService;
        this.messagingTemplate = messagingTemplate;
        this.usuarioRepository = usuarioRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}")
    public ResponseEntity<Void> bloquear(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        Usuario usuario = getUsuarioAutenticado();
        String motivo = body != null ? body.get("motivo") : null;
        bloqueoService.bloquear(usuario.getId(), id, motivo);
        notificarBloqueo("usuario.bloqueado", id, usuario.getId());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desbloquear(@PathVariable Long id) {
        Usuario usuario = getUsuarioAutenticado();
        bloqueoService.desbloquear(usuario.getId(), id);
        notificarBloqueo("usuario.desbloqueado", id, usuario.getId());
        return ResponseEntity.noContent().build();
    }

    private void notificarBloqueo(String tipo, Long destinatarioId, Long bloqueadorId) {
        usuarioRepository.findById(destinatarioId).ifPresent(destinatario -> {
            Map<String, Object> evento = new HashMap<>();
            evento.put("tipo", tipo);
            evento.put("bloqueadorId", bloqueadorId);
            messagingTemplate.convertAndSendToUser(destinatario.getEmail(), "/queue/conversaciones", evento);
        });
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<BloqueoUsuarioDTO>> listarBloqueados() {
        Usuario usuario = getUsuarioAutenticado();
        List<BloqueoUsuario> bloqueos = bloqueoService.listarBloqueados(usuario.getId());
        List<BloqueoUsuarioDTO> dtos = bloqueos.stream().map(b -> {
            BloqueoUsuarioDTO dto = new BloqueoUsuarioDTO();
            dto.setBloqueadoId(b.getBloqueado().getId());
            dto.setBloqueadoNombre(b.getBloqueado().getNombreCompleto());
            dto.setBloqueadoFotoUrl(b.getBloqueado().getFotoUrl());
            dto.setFechaBloqueo(b.getFechaBloqueo());
            dto.setMotivo(b.getMotivo());
            return dto;
        }).toList();
        return ResponseEntity.ok(dtos);
    }

    private Usuario getUsuarioAutenticado() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
