package com.jobfree.mapper;

import com.jobfree.dto.reserva.ReservaCreateDTO;
import com.jobfree.dto.reserva.ReservaDTO;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.Usuario;

public class ReservaMapper {

	public static ReservaDTO toDTO(Reserva r) {
		ReservaDTO dto = new ReservaDTO();

		dto.setId(r.getId());
		dto.setFechaInicio(r.getFechaInicio());
		dto.setFechaCreacion(r.getFechaCreacion());
		dto.setPrecioTotal(r.getPrecioTotal());
		dto.setEstado(r.getEstado());
		dto.setEstadoPago(r.getPago() != null ? r.getPago().getEstado() : null);
		dto.setDescripcion(r.getDescripcion());

		Usuario cliente = r.getCliente();
		dto.setClienteId(cliente.getId());
		dto.setClienteNombre(cliente.getNombre() + " " + (cliente.getApellidos() != null ? cliente.getApellidos() : ""));
		dto.setClienteFotoUrl(cliente.getFotoUrl());

		ServicioOfrecido servicio = r.getServicio();
		dto.setServicioId(servicio.getId());
		dto.setServicioTitulo(servicio.getTitulo());

		ProfesionalInfo profesional = servicio.getProfesional();
		Usuario usuarioProfesional = profesional.getUsuario();
		dto.setProfesionalId(profesional.getId());
		dto.setProfesionalNombre(usuarioProfesional.getNombre() + " " + (usuarioProfesional.getApellidos() != null ? usuarioProfesional.getApellidos() : ""));
		dto.setProfesionalFotoUrl(usuarioProfesional.getFotoUrl());
		dto.setValorada(r.getValoracion() != null);
		dto.setValoracionId(r.getValoracion() != null ? r.getValoracion().getId() : null);
		dto.setProgreso(r.getProgreso());
		dto.setNotasProgreso(r.getNotasProgreso());
		dto.setDuracionMin(servicio.getDuracionMin());

		return dto;
	}

	public static Reserva toEntity(ReservaCreateDTO dto, Usuario cliente, ServicioOfrecido servicio) {
		Reserva r = new Reserva();
		r.setCliente(cliente);
		r.setServicio(servicio);
		r.setFechaInicio(dto.getFechaInicio());
		r.setDescripcion(dto.getDescripcion());
		return r;
	}
}
