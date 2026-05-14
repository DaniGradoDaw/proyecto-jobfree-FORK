package com.jobfree.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
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
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.reserva.ReservaCreateDTO;
import com.jobfree.dto.reserva.ReservaDTO;
import com.jobfree.mapper.ReservaMapper;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.ReservaService;
import com.jobfree.service.ServicioOfrecidoService;
import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

	private final ReservaService reservaService;
	private final ServicioOfrecidoService servicioService;

	public ReservaController(ReservaService reservaService, ServicioOfrecidoService servicioService) {
		this.reservaService = reservaService;
		this.servicioService = servicioService;
	}

	@Operation(hidden = true)
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public ResponseEntity<List<ReservaDTO>> listarReservas() {
		List<ReservaDTO> dtos = reservaService.listarReservas().stream().map(ReservaMapper::toDTO).toList();
		return ResponseEntity.ok(dtos);
	}

	/** Reservas propias del cliente autenticado */
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/mis-reservas")
	public ResponseEntity<List<ReservaDTO>> misReservas() {
		Usuario usuario = getUsuarioAutenticado();
		List<ReservaDTO> dtos = reservaService.misReservas(usuario).stream().map(ReservaMapper::toDTO).toList();
		return ResponseEntity.ok(dtos);
	}

	/** Solicitudes recibidas por el profesional autenticado */
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/mis-solicitudes")
	public ResponseEntity<List<ReservaDTO>> misSolicitudes() {
		Usuario usuario = getUsuarioAutenticado();
		List<ReservaDTO> dtos = reservaService.misSolicitudes(usuario).stream().map(ReservaMapper::toDTO).toList();
		return ResponseEntity.ok(dtos);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/{id}")
	public ResponseEntity<ReservaDTO> obtenerPorId(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);
		return ResponseEntity.ok(ReservaMapper.toDTO(reserva));
	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping
	public ResponseEntity<ReservaDTO> crearReserva(@Valid @RequestBody ReservaCreateDTO dto) {
		Usuario cliente = getUsuarioAutenticado();
		ServicioOfrecido servicio = servicioService.obtenerPorId(dto.getServicioId());
		Reserva nueva = reservaService.crearReserva(
				ReservaMapper.toEntity(dto, cliente, servicio),
				dto.getPrecioPersonalizado()
		);
		return ResponseEntity.status(HttpStatus.CREATED).body(ReservaMapper.toDTO(nueva));
	}

	/** El profesional acepta la solicitud */
	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/confirmar")
	public ResponseEntity<ReservaDTO> confirmarReserva(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);
		return ResponseEntity.ok(ReservaMapper.toDTO(reservaService.confirmarReserva(reserva, usuario)));
	}

	/** El profesional rechaza la solicitud */
	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/rechazar")
	public ResponseEntity<ReservaDTO> rechazarReserva(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);
		return ResponseEntity.ok(ReservaMapper.toDTO(reservaService.rechazarReserva(reserva, usuario)));
	}

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/cancelar")
	public ResponseEntity<ReservaDTO> cancelarReserva(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);
		return ResponseEntity.ok(ReservaMapper.toDTO(reservaService.cancelarReserva(reserva)));
	}

	/** El profesional actualiza el progreso del trabajo (0-100) */
	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/progreso")
	public ResponseEntity<ReservaDTO> actualizarProgreso(
			@PathVariable Long id,
			@RequestBody Map<String, Object> body) {
		Usuario usuario = getUsuarioAutenticado();
		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);
		int progreso = body.containsKey("progreso") ? ((Number) body.get("progreso")).intValue() : reserva.getProgreso();
		String notas = body.containsKey("notas") ? (String) body.get("notas") : null;
		return ResponseEntity.ok(ReservaMapper.toDTO(reservaService.actualizarProgreso(reserva, progreso, notas, usuario)));
	}

	/** El profesional marca el trabajo como completado */
	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/completar")
	public ResponseEntity<ReservaDTO> completarReserva(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);
		return ResponseEntity.ok(ReservaMapper.toDTO(reservaService.completarReserva(reserva, usuario)));
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/{id}/admin/cancelar")
	public ResponseEntity<ReservaDTO> cancelarReservaAdmin(@PathVariable Long id) {
		Reserva reserva = reservaService.obtenerPorId(id);
		return ResponseEntity.ok(ReservaMapper.toDTO(reservaService.cancelarReserva(reserva)));
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/{id}/admin/completar")
	public ResponseEntity<ReservaDTO> completarReservaAdmin(@PathVariable Long id) {
		Reserva reserva = reservaService.obtenerPorId(id);
		return ResponseEntity.ok(ReservaMapper.toDTO(reservaService.completarReservaAdmin(reserva)));
	}

	@Operation(hidden = true)
	@PreAuthorize("isAuthenticated()")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarReserva(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);
		reservaService.eliminarReserva(reserva);
		return ResponseEntity.noContent().build();
	}

	private Usuario getUsuarioAutenticado() {
		return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
}
