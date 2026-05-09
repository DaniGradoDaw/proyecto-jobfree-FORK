package com.jobfree.mapper;

import com.jobfree.dto.servicio.ServicioCreateDTO;
import com.jobfree.dto.servicio.ServicioDTO;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.SubcategoriaServicio;
import com.jobfree.model.entity.Usuario;

/**
 * Mapper para convertir entre la entidad ServicioOfrecido y sus DTOs.
 */
public class ServicioMapper {

	/**
	 * Convierte una entidad ServicioOfrecido a su DTO de salida.
	 * Incluye los datos del profesional para que el frontend pueda
	 * mostrar el nombre, ciudad y valoración sin necesitar otra petición.
	 *
	 * @param s entidad servicio
	 * @return DTO con los datos del servicio y del profesional
	 */
	public static ServicioDTO toDTO(ServicioOfrecido s) {
		ProfesionalInfo p = s.getProfesional();
		Usuario u = p.getUsuario();

		return new ServicioDTO(
				s.getId(),
				s.getTitulo(),
				s.getDescripcion(),
				s.getDuracionMin(),
				s.getPrecioHora(),
				s.isActiva(),
				s.getSubcategoria().getId(),
				s.getSubcategoria().getNombre(),
				s.getSubcategoria().getImagen(),
				p.getId(),
				u.getId(),
				u.getNombreCompleto(),
				u.getCiudad(),
				u.getFotoUrl(),
				p.getValoracionMedia(),
				p.getNumeroValoraciones()
		);
	}

	/**
	 * Convierte un DTO de creación a entidad ServicioOfrecido.
	 *
	 * @param dto          datos de entrada
	 * @param profesional  profesional asociado
	 * @param subcategoria subcategoría del servicio
	 * @return entidad lista para persistir
	 */
	public static ServicioOfrecido toEntity(ServicioCreateDTO dto, ProfesionalInfo profesional,
			SubcategoriaServicio subcategoria) {

		ServicioOfrecido s = new ServicioOfrecido();

		s.setTitulo(dto.getTitulo());
		s.setDescripcion(dto.getDescripcion());
		s.setDuracionMin(dto.getDuracionMin());
		s.setPrecioHora(dto.getPrecioHora());
		s.setProfesional(profesional);
		s.setSubcategoria(subcategoria);

		return s;
	}
}
