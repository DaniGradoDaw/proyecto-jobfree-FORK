package com.jobfree.mapper;

import com.jobfree.dto.pago.FacturaDTO;
import com.jobfree.dto.pago.PagoCreateDTO;
import com.jobfree.dto.pago.PagoDTO;
import com.jobfree.model.entity.Pago;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.Usuario;

/**
 * Mapper para convertir entre la entidad Pago y sus DTOs.
 */
public class PagoMapper {

	/**
	 * Convierte una entidad Pago a su DTO de salida.
	 *
	 * @param p entidad pago
	 * @return DTO con los datos necesarios para la respuesta
	 */
	public static PagoDTO toDTO(Pago p) {
		return new PagoDTO(p.getId(), p.getImporte(), p.getMetodo().getLabel(), p.getEstado().name(), p.getFechaPago(),
				p.getReserva().getId());
	}

	public static FacturaDTO toFacturaDTO(Pago p) {
		Reserva r = p.getReserva();
		Usuario cliente = r.getCliente();
		Usuario profesional = r.getServicio().getProfesional().getUsuario();

		String numeroFactura = String.format("JF-%d-%04d",
				p.getFechaPago() != null ? p.getFechaPago().getYear() : java.time.LocalDateTime.now().getYear(),
				p.getId());

		String profesionalNombre = profesional.getNombre() + " " + profesional.getApellidos();
		String clienteNombre     = cliente.getNombre() + " " + cliente.getApellidos();

		return new FacturaDTO(
				p.getId(),
				numeroFactura,
				p.getImporte(),
				p.getMetodo().getLabel(),
				p.getEstado().name(),
				p.getFechaPago(),
				r.getId(),
				r.getServicio().getTitulo(),
				profesionalNombre,
				clienteNombre,
				cliente.getEmail(),
				r.getFechaInicio()
		);
	}

	/**
	 * Convierte un DTO de creación a entidad Pago.
	 *
	 * @param dto     datos de entrada
	 * @param reserva reserva asociada al pago
	 * @return entidad lista para persistir
	 */
	public static Pago toEntity(PagoCreateDTO dto, Reserva reserva) {

		Pago p = new Pago();

		p.setImporte(reserva.getPrecioTotal());
		p.setMetodo(dto.getMetodo());
		p.setReserva(reserva);

		return p;
	}
}