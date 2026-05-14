package com.jobfree.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jobfree.exception.subcategoria.CategoriaObligatoriaException;
import com.jobfree.exception.subcategoria.SubcategoriaNotFoundException;
import com.jobfree.model.entity.SubcategoriaServicio;
import com.jobfree.repository.SubcategoriaServicioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class SubcategoriaServicioService {

	private final SubcategoriaServicioRepository subcategoriaRepository;

	public SubcategoriaServicioService(SubcategoriaServicioRepository subcategoriaRepository) {
		this.subcategoriaRepository = subcategoriaRepository;
	}

	/**
	 * Obtiene todas las subcategorías disponibles.
	 *
	 * @return lista de subcategorías registradas en la base de datos
	 */
	public List<SubcategoriaServicio> listarSubcategorias() {
		return subcategoriaRepository.findAll();
	}

	/**
	 * Busca una subcategoría por su ID.
	 *
	 * @param id identificador de la subcategoría
	 * @return subcategoría encontrada
	 * @throws SubcategoriaNotFoundException si no existe la subcategoría
	 */
	public SubcategoriaServicio obtenerPorId(Long id) {
		return subcategoriaRepository.findById(id).orElseThrow(() -> new SubcategoriaNotFoundException(id));
	}

	/**
	 * Crea una nueva subcategoría validando los datos obligatorios.
	 *
	 * @param subcategoria datos de la subcategoría a crear
	 * @return subcategoría creada y guardada en la base de datos
	 * @throws CategoriaObligatoriaException si no se proporciona categoría
	 * @throws IllegalArgumentException si el nombre es nulo, vacío o ya existe en la categoría
	 */
	public SubcategoriaServicio crearSubcategoria(SubcategoriaServicio subcategoria) {

		if (subcategoria.getCategoria() == null) {
			throw new CategoriaObligatoriaException();
		}

		if (subcategoria.getNombre() == null || subcategoria.getNombre().isBlank()) {
			throw new IllegalArgumentException("El nombre es obligatorio");
		}

		if (subcategoriaRepository.existsByNombreAndCategoria_Id(subcategoria.getNombre(),
				subcategoria.getCategoria().getId())) {

			throw new IllegalArgumentException("Ya existe una subcategoría con ese nombre en esta categoría");
		}

		return subcategoriaRepository.save(subcategoria);
	}

	/**
	 * Actualiza una subcategoría existente aplicando cambios parciales.
	 *
	 * @param id    identificador de la subcategoría
	 * @param datos nuevos datos de la subcategoría
	 * @return subcategoría actualizada con los nuevos datos
	 * @throws SubcategoriaNotFoundException si la subcategoría no existe
	 * @throws IllegalArgumentException      si el nombre es vacío o duplicado en la
	 *                                       categoría
	 */
	public SubcategoriaServicio actualizarSubcategoria(Long id, SubcategoriaServicio datos) {

		SubcategoriaServicio existente = obtenerPorId(id);

		if (datos.getNombre() != null) {
			if (datos.getNombre().isBlank()) {
				throw new IllegalArgumentException("El nombre no puede estar vacío");
			}

			if (!existente.getNombre().equals(datos.getNombre()) && subcategoriaRepository
					.existsByNombreAndCategoria_Id(datos.getNombre(), existente.getCategoria().getId())) {

				throw new IllegalArgumentException("Ya existe una subcategoría con ese nombre en esta categoría");
			}

			existente.setNombre(datos.getNombre());
		}

		if (datos.getDescripcion() != null) {
			existente.setDescripcion(datos.getDescripcion());
		}

		if (datos.getImagen() != null) {
			existente.setImagen(datos.getImagen());
		}

		if (datos.getCategoria() != null) {
			existente.setCategoria(datos.getCategoria());
		}

		return subcategoriaRepository.save(existente);
	}

	/**
	 * Elimina una subcategoría por su ID.
	 *
	 * @param id identificador de la subcategoría
	 * @throws SubcategoriaNotFoundException si la subcategoría no existe
	 */
	public void eliminarSubcategoria(Long id) {
		SubcategoriaServicio subcategoria = obtenerPorId(id);
		subcategoriaRepository.delete(subcategoria);
	}

	/**
	 * Obtiene las subcategorías de una categoría con paginación.
	 *
	 * @param categoriaId identificador de la categoría
	 * @param pageable    información de paginación
	 * @return página de subcategorías asociadas a la categoría
	 */
	public Page<SubcategoriaServicio> obtenerPorCategoria(Long categoriaId, Pageable pageable) {
		return subcategoriaRepository.findByCategoria_Id(categoriaId, pageable);
	}

	public List<SubcategoriaServicio> listarPorPopularidad() {
		return subcategoriaRepository.findTopPopulares(PageRequest.of(0, 8));
	}
}
