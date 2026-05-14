package com.jobfree.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.jobfree.dto.subcategoria.SubcategoriaCreateDTO;
import com.jobfree.dto.subcategoria.SubcategoriaDTO;
import com.jobfree.mapper.SubcategoriaMapper;
import com.jobfree.model.entity.CategoriaServicio;
import com.jobfree.model.entity.SubcategoriaServicio;
import com.jobfree.service.CategoriaServicioService;
import com.jobfree.service.SubcategoriaServicioService;
import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/subcategorias")
public class SubcategoriaServicioController {

	private static final long IMAGEN_MAX_BYTES = 5L * 1024L * 1024L;

	private final SubcategoriaServicioService subcategoriaService;
	private final CategoriaServicioService categoriaService;

	@Value("${app.upload.dir:uploads}")
	private String uploadDir;

	public SubcategoriaServicioController(SubcategoriaServicioService subcategoriaService,
			CategoriaServicioService categoriaService) {
		this.subcategoriaService = subcategoriaService;
		this.categoriaService = categoriaService;
	}

	/**
	 * Obtiene todas las subcategorías disponibles.
	 *
	 * @return lista de subcategorías
	 */
	@GetMapping
	public ResponseEntity<List<SubcategoriaDTO>> listarSubcategorias() {

		List<SubcategoriaDTO> dtos = subcategoriaService.listarSubcategorias().stream().map(SubcategoriaMapper::toDTO)
				.toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Obtiene una subcategoría por ID.
	 *
	 * @param id identificador de la subcategoría
	 * @return subcategoría encontrada
	 */
	@GetMapping("/{id}")
	public ResponseEntity<SubcategoriaDTO> obtenerPorId(@PathVariable Long id) {

		return ResponseEntity.ok(SubcategoriaMapper.toDTO(subcategoriaService.obtenerPorId(id)));
	}

	/**
	 * Obtiene subcategorías por categoría con paginación.
	 *
	 * @param categoriaId identificador de la categoría
	 * @param pageable    paginación
	 * @return página de subcategorías
	 */
	@GetMapping("/categoria/{categoriaId}")
	public ResponseEntity<Page<SubcategoriaDTO>> obtenerPorCategoria(@PathVariable Long categoriaId,
			Pageable pageable) {

		Page<SubcategoriaDTO> page = subcategoriaService.obtenerPorCategoria(categoriaId, pageable)
				.map(SubcategoriaMapper::toDTO);

		return ResponseEntity.ok(page);
	}

	@GetMapping("/populares")
	public ResponseEntity<List<SubcategoriaDTO>> listarPorPopularidad() {
		List<SubcategoriaDTO> dtos = subcategoriaService.listarPorPopularidad().stream()
				.map(SubcategoriaMapper::toDTO)
				.toList();
		return ResponseEntity.ok(dtos);
	}

	/**
	 * Crea una subcategoría.
	 *
	 * @param dto datos de entrada
	 * @return subcategoría creada
	 */
	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping
	public ResponseEntity<SubcategoriaDTO> crearSubcategoria(@Valid @RequestBody SubcategoriaCreateDTO dto) {

		CategoriaServicio categoria = categoriaService.obtenerPorId(dto.getCategoriaId());

		SubcategoriaServicio nueva = subcategoriaService.crearSubcategoria(SubcategoriaMapper.toEntity(dto, categoria));

		return ResponseEntity.status(HttpStatus.CREATED).body(SubcategoriaMapper.toDTO(nueva));
	}

	/**
	 * Actualiza parcialmente una subcategoría existente.
	 *
	 * @param id  identificador de la subcategoría
	 * @param dto nuevos datos de la subcategoría
	 * @return subcategoría actualizada con los nuevos datos
	 */
	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/{id}")
	public ResponseEntity<SubcategoriaDTO> actualizarSubcategoria(@PathVariable Long id,
			@Valid @RequestBody SubcategoriaCreateDTO dto) {

		CategoriaServicio categoria = null;

		if (dto.getCategoriaId() != null) {
			categoria = categoriaService.obtenerPorId(dto.getCategoriaId());
		}

		SubcategoriaServicio actualizada = subcategoriaService.actualizarSubcategoria(id,
				SubcategoriaMapper.toEntity(dto, categoria));

		return ResponseEntity.ok(SubcategoriaMapper.toDTO(actualizada));
	}

	/**
	 * Elimina una subcategoría por su ID.
	 *
	 * @param id identificador de la subcategoría
	 * @return respuesta sin contenido (204 No Content)
	 */
	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarSubcategoria(@PathVariable Long id) {
		subcategoriaService.eliminarSubcategoria(id);
		return ResponseEntity.noContent().build();
	}

	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping(value = "/upload-imagen", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, String>> subirImagen(
			@RequestParam("imagen") MultipartFile imagen) throws IOException {
		if (imagen.isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("error", "El archivo está vacío"));
		}
		if (imagen.getSize() > IMAGEN_MAX_BYTES) {
			return ResponseEntity.badRequest().body(Map.of("error", "La imagen no puede superar 5MB"));
		}
		byte[] bytes = imagen.getBytes();
		String extension = detectarExtension(bytes);
		if (extension == null) {
			return ResponseEntity.badRequest().body(Map.of("error", "Formato no permitido. Usa JPG, PNG, WebP o GIF"));
		}
		String nombreArchivo = UUID.randomUUID() + extension;
		Path directorio = Paths.get(uploadDir, "subcategorias");
		Files.createDirectories(directorio);
		Files.write(directorio.resolve(nombreArchivo), bytes);
		return ResponseEntity.ok(Map.of("imagenUrl", "/uploads/subcategorias/" + nombreArchivo));
	}

	private String detectarExtension(byte[] b) {
		if (b == null || b.length < 4) return null;
		if (b.length >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) return ".jpg";
		if (b.length >= 8 && (b[0] & 0xFF) == 0x89 && b[1] == 0x50 && b[2] == 0x4E && b[3] == 0x47) return ".png";
		if (b.length >= 12 && b[0] == 0x52 && b[1] == 0x49 && b[2] == 0x46 && b[3] == 0x46 && b[8] == 0x57 && b[9] == 0x45 && b[10] == 0x42 && b[11] == 0x50) return ".webp";
		if (b.length >= 6 && b[0] == 0x47 && b[1] == 0x49 && b[2] == 0x46 && b[3] == 0x38 && (b[4] == 0x37 || b[4] == 0x39) && b[5] == 0x61) return ".gif";
		return null;
	}
}
