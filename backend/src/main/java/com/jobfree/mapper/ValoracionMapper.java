package com.jobfree.mapper;

import com.jobfree.dto.valoracion.ValoracionCreateDTO;
import com.jobfree.dto.valoracion.ValoracionDTO;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.entity.Valoracion;

/**
 * Mapper para convertir entre la entidad Valoracion y sus DTOs.
 */
public class ValoracionMapper {

	/**
	 * Convierte una entidad Valoracion a su DTO de salida.
	 *
	 * @param v entidad valoración
	 * @return DTO con los datos necesarios para la respuesta
	 */
	public static ValoracionDTO toDTO(Valoracion v) {
		return new ValoracionDTO(
				v.getId(),
				v.getEstrellas(),
				v.getComentario(),
				v.getFecha(),
				v.getReserva().getId(),
				v.getCliente().getId(),
				v.getCliente().getNombreCompleto(),
				v.getCliente().getFotoUrl(),
				v.getProfesional().getId());
	}

	/**
	 * Convierte un DTO de creación a entidad Valoracion.
	 *
	 * @param dto         datos de entrada
	 * @param reserva     reserva asociada
	 * @param cliente     cliente que realiza la valoración
	 * @param profesional profesional valorado
	 * @return entidad lista para persistir
	 */
	public static Valoracion toEntity(ValoracionCreateDTO dto, Reserva reserva, Usuario cliente,
			ProfesionalInfo profesional) {

		Valoracion v = new Valoracion();

		v.setEstrellas(dto.getEstrellas());
		v.setComentario(dto.getComentario());
		v.setReserva(reserva);
		v.setCliente(cliente);
		v.setProfesional(profesional);

		return v;
	}
}