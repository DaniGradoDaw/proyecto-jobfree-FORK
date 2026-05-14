package com.jobfree.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jobfree.dto.mensaje.MensajeBatchUpdateDTO;
import com.jobfree.dto.mensaje.MensajeCreateDTO;
import com.jobfree.dto.mensaje.MensajeDTO;
import com.jobfree.dto.mensaje.MensajePageDTO;
import com.jobfree.dto.reaccion.ReaccionDTO;
import com.jobfree.mapper.MensajeMapper;
import com.jobfree.model.entity.Mensaje;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.MensajeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/mensajes")
public class MensajeController {

	@Value("${app.upload.dir:uploads}")
	private String uploadDir;

	private final MensajeService mensajeService;

	public MensajeController(MensajeService mensajeService) {
		this.mensajeService = mensajeService;
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public ResponseEntity<List<MensajeDTO>> listarMensajes() {
		List<MensajeDTO> dtos = mensajeService.listarMensajes().stream().map(MensajeMapper::toDTO).toList();
		return ResponseEntity.ok(dtos);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/conversaciones/{conversacionId}")
	public ResponseEntity<MensajePageDTO> obtenerPorConversacion(
			@PathVariable Long conversacionId,
			@RequestParam(required = false) Long before,
			@RequestParam(defaultValue = "50") int size) {

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return ResponseEntity.ok(mensajeService.obtenerPorConversacion(conversacionId, usuario, before, size));
	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping
	public ResponseEntity<MensajeDTO> crearMensaje(@Valid @RequestBody MensajeCreateDTO dto) {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return ResponseEntity.status(HttpStatus.CREATED).body(mensajeService.crear(dto, usuario));
	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping("/upload-imagen")
	public ResponseEntity<Map<String, String>> uploadImagen(@RequestParam("file") MultipartFile file) {
		if (file.getSize() > 5 * 1024 * 1024) {
			return ResponseEntity.badRequest().body(Map.of("error", "La imagen no puede superar 5MB"));
		}
		try {
			byte[] bytes = file.getBytes();
			String ext = detectarExtensionImagen(bytes);
			if (ext == null) {
				return ResponseEntity.badRequest().body(Map.of("error", "Solo se permiten imágenes JPG, PNG o GIF"));
			}
			String filename = UUID.randomUUID() + ext;
			Path dir = Paths.get(uploadDir, "mensajes");
			Files.createDirectories(dir);
			Files.write(dir.resolve(filename), bytes);
			return ResponseEntity.ok(Map.of("url", "/uploads/mensajes/" + filename));
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Error al guardar la imagen"));
		}
	}

	private String detectarExtensionImagen(byte[] bytes) {
		if (bytes == null || bytes.length < 4) {
			return null;
		}
		if (bytes.length >= 3
				&& (bytes[0] & 0xFF) == 0xFF
				&& (bytes[1] & 0xFF) == 0xD8
				&& (bytes[2] & 0xFF) == 0xFF) {
			return ".jpg";
		}
		if (bytes.length >= 8
				&& (bytes[0] & 0xFF) == 0x89
				&& bytes[1] == 0x50
				&& bytes[2] == 0x4E
				&& bytes[3] == 0x47
				&& bytes[4] == 0x0D
				&& bytes[5] == 0x0A
				&& bytes[6] == 0x1A
				&& bytes[7] == 0x0A) {
			return ".png";
		}
		if (bytes.length >= 6
				&& bytes[0] == 0x47
				&& bytes[1] == 0x49
				&& bytes[2] == 0x46
				&& bytes[3] == 0x38
				&& (bytes[4] == 0x37 || bytes[4] == 0x39)
				&& bytes[5] == 0x61) {
			return ".gif";
		}
		return null;
	}

	@PreAuthorize("isAuthenticated()")
	@DeleteMapping("/{id}")
	public ResponseEntity<MensajeDTO> eliminarMensaje(@PathVariable Long id) {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return ResponseEntity.ok(mensajeService.eliminarMensaje(id, usuario));
	}

	@PreAuthorize("isAuthenticated()")
	@PutMapping("/{id}/contenido")
	public ResponseEntity<MensajeDTO> editarMensaje(@PathVariable Long id, @RequestBody Map<String, String> body) {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String contenido = body.get("contenido");
		if (contenido == null) {
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok(mensajeService.editarMensaje(id, contenido, usuario));
	}

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/leido")
	public ResponseEntity<MensajeDTO> marcarComoLeido(@PathVariable Long id) {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Mensaje actualizado = mensajeService.marcarComoLeido(id, usuario);
		return ResponseEntity.ok(MensajeMapper.toDTO(actualizado));
	}

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/recibido")
	public ResponseEntity<MensajeDTO> marcarComoRecibido(@PathVariable Long id) {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Mensaje actualizado = mensajeService.marcarComoRecibido(id, usuario);
		return ResponseEntity.ok(MensajeMapper.toDTO(actualizado));
	}

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/recibido/lote")
	public ResponseEntity<List<MensajeDTO>> marcarComoRecibidoBatch(@Valid @RequestBody MensajeBatchUpdateDTO dto) {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<MensajeDTO> actualizados = mensajeService.marcarComoRecibidoBatch(dto, usuario).stream()
				.map(MensajeMapper::toDTO).toList();
		return ResponseEntity.ok(actualizados);
	}

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/leido/lote")
	public ResponseEntity<List<MensajeDTO>> marcarComoLeidoBatch(@Valid @RequestBody MensajeBatchUpdateDTO dto) {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<MensajeDTO> actualizados = mensajeService.marcarComoLeidoBatch(dto, usuario).stream()
				.map(MensajeMapper::toDTO).toList();
		return ResponseEntity.ok(actualizados);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/no-leidos/count")
	public ResponseEntity<Map<String, Long>> contarNoLeidos() {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return ResponseEntity.ok(Map.of("total", mensajeService.contarNoLeidos(usuario)));
	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping("/{id}/reacciones")
	public ResponseEntity<List<ReaccionDTO>> toggleReaccion(
			@PathVariable Long id,
			@RequestBody Map<String, String> body) {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String emoji = body.get("emoji");
		if (emoji == null || emoji.isBlank()) {
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok(mensajeService.toggleReaccion(id, emoji, usuario));
	}
}
