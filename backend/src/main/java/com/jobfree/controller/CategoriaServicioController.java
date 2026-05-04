package com.jobfree.controller;

import java.util.List;

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

import com.jobfree.dto.categoria.CategoriaCreateDTO;
import com.jobfree.dto.categoria.CategoriaDTO;
import com.jobfree.mapper.CategoriaMapper;
import com.jobfree.model.entity.CategoriaServicio;
import com.jobfree.service.CategoriaServicioService;
import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/categorias")
public class CategoriaServicioController {

	private final CategoriaServicioService categoriaServicioService;

	public CategoriaServicioController(CategoriaServicioService categoriaServicioService) {
		this.categoriaServicioService = categoriaServicioService;
	}

	/**
	 * Obtiene todas las categorías disponibles.
	 *
	 * @return ResponseEntity con la lista de categorías
	 */
	@GetMapping
	public ResponseEntity<List<CategoriaDTO>> listarCategorias() {

		List<CategoriaDTO> dtos = categoriaServicioService.listarCategorias().stream().map(CategoriaMapper::toDTO)
				.toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Obtiene una categoría concreta a partir de su ID.
	 *
	 * @param categoriaId identificador de la categoría
	 * @return ResponseEntity con la categoría encontrada
	 */
	@GetMapping("/{categoriaId}")
	public ResponseEntity<CategoriaDTO> obtenerPorId(@PathVariable Long categoriaId) {

		CategoriaServicio categoria = categoriaServicioService.obtenerPorId(categoriaId);

		return ResponseEntity.ok(CategoriaMapper.toDTO(categoria));
	}

	/**
	 * Crea una nueva categoría.
	 *
	 * @param dto datos de la categoría
	 * @return ResponseEntity con la categoría creada
	 */
	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping
	public ResponseEntity<CategoriaDTO> crearCategoria(@Valid @RequestBody CategoriaCreateDTO dto) {

		CategoriaServicio nueva = categoriaServicioService.crear(dto);

		return ResponseEntity.status(HttpStatus.CREATED).body(CategoriaMapper.toDTO(nueva));
	}

	/**
	 * Actualiza una categoría existente.
	 *
	 * @param categoriaId identificador de la categoría a actualizar
	 * @param dto         nuevos datos de la categoría
	 * @return ResponseEntity con la categoría actualizada
	 */
	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/{categoriaId}")
	public ResponseEntity<CategoriaDTO> actualizarCategoria(@PathVariable Long categoriaId,
			@Valid @RequestBody CategoriaCreateDTO dto) {

		CategoriaServicio actualizada = categoriaServicioService.actualizar(categoriaId, dto);

		return ResponseEntity.ok(CategoriaMapper.toDTO(actualizada));
	}

	/**
	 * Elimina una categoría por su ID.
	 *
	 * @param categoriaId identificador de la categoría a eliminar
	 * @return ResponseEntity sin contenido (204 No Content)
	 */
	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{categoriaId}")
	public ResponseEntity<Void> eliminarCategoria(@PathVariable Long categoriaId) {
		categoriaServicioService.eliminarCategoria(categoriaId);
		return ResponseEntity.noContent().build();
	}
}