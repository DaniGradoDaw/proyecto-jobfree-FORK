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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jobfree.dto.usuario.UsuarioCreateDTO;
import com.jobfree.dto.usuario.UsuarioDTO;
import com.jobfree.dto.usuario.UsuarioUpdateDTO;
import com.jobfree.mapper.UsuarioMapper;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Rol;
import com.jobfree.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

	private static final long FOTO_MAX_BYTES = 5L * 1024L * 1024L;

	private final UsuarioService usuarioService;

	@Value("${app.upload.dir:uploads}")
	private String uploadDir;

	@Value("${frontend.url}")
	private String frontendUrl;

	public UsuarioController(UsuarioService usuarioService) {
		this.usuarioService = usuarioService;
	}

	/**
	 * Actualiza los datos del usuario autenticado (sin necesidad de pasar el ID por URL).
	 */
	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/me")
	public ResponseEntity<UsuarioDTO> actualizarMe(@Valid @RequestBody UsuarioUpdateDTO dto) {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Usuario actualizado = usuarioService.actualizarUsuarioDesdeDTO(usuario.getId(), dto);
		return ResponseEntity.ok(UsuarioMapper.toDTO(actualizado));
	}

	/**
	 * Sube la foto de perfil del usuario autenticado.
	 * Acepta multipart/form-data con campo "foto".
	 * Guarda el archivo en el directorio de uploads y actualiza fotoUrl en BD.
	 */
	@PreAuthorize("isAuthenticated()")
	@PostMapping(value = "/me/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, String>> subirFoto(@RequestParam("foto") MultipartFile foto) throws IOException {
		if (foto.isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("error", "El archivo está vacío"));
		}

		if (foto.getSize() > FOTO_MAX_BYTES) {
			return ResponseEntity.badRequest().body(Map.of("error", "La imagen no puede superar 5MB"));
		}

		byte[] bytes = foto.getBytes();
		String extension = detectarExtensionImagen(bytes);
		if (extension == null) {
			return ResponseEntity.badRequest().body(Map.of("error", "Formato no permitido. Usa JPG, PNG, WebP o GIF"));
		}

		String nombreArchivo = UUID.randomUUID() + extension;

		Path directorio = Paths.get(uploadDir, "fotos");
		Files.createDirectories(directorio);
		Files.write(directorio.resolve(nombreArchivo), bytes);

		String fotoUrl = "/uploads/fotos/" + nombreArchivo;

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		usuarioService.actualizarFoto(usuario.getId(), fotoUrl);

		return ResponseEntity.ok(Map.of("fotoUrl", fotoUrl));
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
		if (bytes.length >= 12
				&& bytes[0] == 0x52
				&& bytes[1] == 0x49
				&& bytes[2] == 0x46
				&& bytes[3] == 0x46
				&& bytes[8] == 0x57
				&& bytes[9] == 0x45
				&& bytes[10] == 0x42
				&& bytes[11] == 0x50) {
			return ".webp";
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

	/**
	 * Obtiene todos los usuarios registrados en el sistema. Solo accesible por
	 * usuarios con rol ADMIN.
	 *
	 * @return lista de usuarios en formato DTO
	 */
	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {

		List<Usuario> usuarios = usuarioService.listarUsuarios();
		List<UsuarioDTO> dtos = usuarios.stream().map(UsuarioMapper::toDTO).toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Obtiene un usuario por su identificador. Solo el propio usuario o un ADMIN
	 * pueden acceder.
	 *
	 * @param id identificador del usuario
	 * @return usuario encontrado en formato DTO
	 */
	@Operation(hidden = true)
	@PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')")
	@GetMapping("/{id}")
	public ResponseEntity<UsuarioDTO> obtenerPorId(@PathVariable Long id) {

		Usuario usuario = usuarioService.obtenerPorId(id);
		return ResponseEntity.ok(UsuarioMapper.toDTO(usuario));
	}

	/**
	 * Crea un nuevo usuario con rol CLIENTE. Endpoint público sin autenticación.
	 *
	 * @param dto datos necesarios para crear el usuario
	 * @return usuario creado en formato DTO
	 */
	@PostMapping("/cliente")
	public ResponseEntity<UsuarioDTO> crearCliente(@Valid @RequestBody UsuarioCreateDTO dto) {

		Usuario nuevo = usuarioService.crearCliente(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioMapper.toDTO(nuevo));
	}

	/**
	 * Crea un nuevo usuario con rol PROFESIONAL. Endpoint público sin
	 * autenticación.
	 *
	 * @param dto datos necesarios para crear el usuario
	 * @return usuario creado en formato DTO
	 */
	@PostMapping("/profesional")
	public ResponseEntity<UsuarioDTO> crearProfesional(@Valid @RequestBody UsuarioCreateDTO dto) {

		Usuario nuevo = usuarioService.crearProfesional(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioMapper.toDTO(nuevo));
	}

	/**
	 * Actualiza parcialmente los datos de un usuario existente. Solo el propio
	 * usuario o un ADMIN pueden modificarlo.
	 *
	 * @param id  identificador del usuario
	 * @param dto datos a actualizar
	 * @return usuario actualizado en formato DTO
	 */
	@Operation(hidden = true)
	@PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')")
	@PatchMapping("/{id}")
	public ResponseEntity<UsuarioDTO> actualizarUsuario(@PathVariable Long id,
			@Valid @RequestBody UsuarioUpdateDTO dto) {

		Usuario actualizado = usuarioService.actualizarUsuarioDesdeDTO(id, dto);
		return ResponseEntity.ok(UsuarioMapper.toDTO(actualizado));
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/{id}/rol")
	public ResponseEntity<UsuarioDTO> cambiarRol(@PathVariable Long id, @RequestBody Map<String, String> body) {
		String rolStr = body.get("rol");
		if (rolStr == null || rolStr.isBlank()) return ResponseEntity.badRequest().build();
		Rol rol;
		try {
			rol = Rol.valueOf(rolStr.toUpperCase());
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok(UsuarioMapper.toDTO(usuarioService.cambiarRol(id, rol)));
	}

	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/{id}/suspender")
	public ResponseEntity<UsuarioDTO> suspenderUsuario(@PathVariable Long id) {
		return ResponseEntity.ok(UsuarioMapper.toDTO(usuarioService.suspenderUsuario(id)));
	}

	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/{id}/activar")
	public ResponseEntity<UsuarioDTO> activarUsuario(@PathVariable Long id) {
		return ResponseEntity.ok(UsuarioMapper.toDTO(usuarioService.activarUsuario(id)));
	}

	/**
	 * Elimina un usuario del sistema. Solo accesible por usuarios con rol ADMIN.
	 *
	 * @param id identificador del usuario a eliminar
	 * @return respuesta sin contenido (204 No Content)
	 */
	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {

		usuarioService.eliminarUsuario(id);
		return ResponseEntity.noContent().build();
	}
}
