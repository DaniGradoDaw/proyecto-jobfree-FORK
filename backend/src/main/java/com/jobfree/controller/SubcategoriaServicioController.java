package com.jobfree.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

	private final SubcategoriaServicioService subcategoriaService;
	private final CategoriaServicioService categoriaService;

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
}
