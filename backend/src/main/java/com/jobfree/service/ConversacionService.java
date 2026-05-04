package com.jobfree.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.jobfree.exception.conversacion.ConversacionAccesoException;
import com.jobfree.exception.conversacion.ConversacionNotFoundException;
import com.jobfree.exception.reserva.ReservaNotFoundException;
import com.jobfree.exception.usuario.UsuarioNotFoundException;
import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Rol;
import com.jobfree.repository.BloqueoUsuarioRepository;
import com.jobfree.repository.ConversacionRepository;
import com.jobfree.repository.MensajeRepository;
import com.jobfree.repository.ReservaRepository;
import com.jobfree.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ConversacionService {

	private static final Logger log = LoggerFactory.getLogger(ConversacionService.class);

	private final ConversacionRepository conversacionRepository;
	private final ReservaRepository reservaRepository;
	private final UsuarioRepository usuarioRepository;
	private final MensajeRepository mensajeRepository;
	private final BloqueoUsuarioRepository bloqueoRepository;

	public ConversacionService(ConversacionRepository conversacionRepository, ReservaRepository reservaRepository,
			UsuarioRepository usuarioRepository, MensajeRepository mensajeRepository,
			BloqueoUsuarioRepository bloqueoRepository) {
		this.conversacionRepository = conversacionRepository;
		this.reservaRepository = reservaRepository;
		this.usuarioRepository = usuarioRepository;
		this.mensajeRepository = mensajeRepository;
		this.bloqueoRepository = bloqueoRepository;
	}

	public Conversacion obtenerPorId(Long id) {
		return conversacionRepository.findById(id)
				.orElseThrow(() -> new ConversacionNotFoundException(id));
	}

	public Conversacion obtenerPorIdSeguro(Long id, Usuario usuario) {
		Conversacion conversacion = obtenerPorId(id);
		validarParticipante(conversacion, usuario);
		return conversacion;
	}

	public Conversacion obtenerPorReservaSeguro(Long reservaId, Usuario usuario) {
		Reserva reserva = reservaRepository.findById(reservaId)
				.orElseThrow(() -> new ReservaNotFoundException(reservaId));
		Conversacion conversacion = obtenerOCrearPorReserva(reserva);
		validarParticipante(conversacion, usuario);
		return conversacion;
	}

	public List<Conversacion> misConversaciones(Usuario usuario) {
		// Obtener primero los IDs ordenados con LIMIT (evita paginación en memoria de Hibernate con JOIN FETCH)
		List<Long> ids = conversacionRepository.findTopIdsByParticipanteId(
				usuario.getId(), PageRequest.of(0, 100));
		if (ids.isEmpty()) return Collections.emptyList();

		List<Conversacion> conversaciones = conversacionRepository.findByIdsWithParticipantes(ids);

		// Re-ordenar según el orden original de IDs (la query de IDs ya vino ordenada)
		conversaciones.sort(Comparator.comparingInt((Conversacion c) -> ids.indexOf(c.getId())));

		// Auto-backfill: si ultimoMensajeContenido es null, rellenarlo desde la tabla mensaje (solo ocurre en datos legacy)
		conversaciones.stream()
				.filter(c -> c.getUltimoMensajeContenido() == null)
				.forEach(c -> mensajeRepository.findFirstByConversacionIdOrderByFechaEnvioDesc(c.getId())
						.ifPresent(m -> {
							c.setUltimoMensajeContenido(resumirMensaje(m));
							if (c.getUltimoMensajeFecha() == null) {
								c.setUltimoMensajeFecha(m.getFechaEnvio());
							}
						}));

		return conversaciones;
	}

	public Conversacion obtenerOCrearPorReserva(Reserva reserva) {
		return conversacionRepository.findByReservaId(reserva.getId())
				.orElseGet(() -> vincularReservaAConversacionExistenteOCrear(reserva));
	}

	public Conversacion crearOObtenerConversacion(Long clienteId, Long profesionalId) {
		Usuario cliente = usuarioRepository.findById(clienteId)
				.orElseThrow(() -> new UsuarioNotFoundException(clienteId));
		Usuario profesional = usuarioRepository.findById(profesionalId)
				.orElseThrow(() -> new UsuarioNotFoundException(profesionalId));

		if (cliente.getRol() != Rol.CLIENTE) {
			throw new IllegalArgumentException("Solo un cliente puede iniciar una conversación");
		}

		if (profesional.getRol() != Rol.PROFESIONAL) {
			throw new IllegalArgumentException("El usuario seleccionado no es un profesional");
		}

		if (cliente.getId().equals(profesional.getId())) {
			throw new IllegalArgumentException("No puedes iniciar una conversación contigo mismo");
		}

		String contactoClave = buildContactoClave(cliente.getId(), profesional.getId());

		return conversacionRepository
				.findFirstByClienteIdAndProfesionalIdOrderByFechaCreacionDesc(cliente.getId(), profesional.getId())
				.or(() -> conversacionRepository.findByContactoClave(contactoClave))
				.orElseGet(() -> crearConversacionContacto(cliente, profesional, contactoClave));
	}

	public Conversacion silenciar(Long conversacionId, Usuario usuario, String duracion) {
		Conversacion conversacion = obtenerPorIdSeguro(conversacionId, usuario);
		boolean esCliente = conversacion.getCliente().getId().equals(usuario.getId());
		LocalDateTime hasta;
		if (duracion == null) {
			hasta = null;
		} else if ("8h".equals(duracion)) {
			hasta = LocalDateTime.now().plusHours(8);
		} else if ("1s".equals(duracion)) {
			hasta = LocalDateTime.now().plusWeeks(1);
		} else {
			hasta = LocalDateTime.of(9999, 1, 1, 0, 0);
		}
		if (esCliente) {
			conversacion.setSilenciadaClienteHasta(hasta);
		} else {
			conversacion.setSilenciadaProfesionalHasta(hasta);
		}
		return conversacionRepository.save(conversacion);
	}

	public Conversacion toggleFijar(Long conversacionId, Usuario usuario) {
		Conversacion conversacion = obtenerPorIdSeguro(conversacionId, usuario);
		boolean esCliente = conversacion.getCliente().getId().equals(usuario.getId());
		if (esCliente) {
			conversacion.setFijadaCliente(!conversacion.isFijadaCliente());
		} else {
			conversacion.setFijadaProfesional(!conversacion.isFijadaProfesional());
		}
		return conversacionRepository.save(conversacion);
	}

	public boolean isSilenciadaPara(Conversacion conversacion, Usuario usuario) {
		boolean esCliente = conversacion.getCliente().getId().equals(usuario.getId());
		LocalDateTime hasta = esCliente ? conversacion.getSilenciadaClienteHasta() : conversacion.getSilenciadaProfesionalHasta();
		return hasta != null && LocalDateTime.now().isBefore(hasta);
	}

	public boolean esBloqueadoPor(Long bloqueadorId, Long bloqueadoId) {
		return bloqueoRepository.existsByBloqueadorIdAndBloqueadoId(bloqueadorId, bloqueadoId);
	}

	public void validarParticipante(Conversacion conversacion, Usuario usuario) {
		Long usuarioId = usuario.getId();
		boolean esCliente = conversacion.getCliente().getId().equals(usuarioId);
		boolean esProfesional = conversacion.getProfesional().getId().equals(usuarioId);

		if (!esCliente && !esProfesional) {
			throw new ConversacionAccesoException();
		}
	}

	private Conversacion vincularReservaAConversacionExistenteOCrear(Reserva reserva) {
		Usuario cliente = reserva.getCliente();
		Usuario profesional = reserva.getServicio().getProfesional().getUsuario();
		String contactoClave = buildContactoClave(cliente.getId(), profesional.getId());

		// 1. Conversación de contacto inicial (aún no tiene reserva)
		Conversacion porClave = conversacionRepository.findByContactoClave(contactoClave).orElse(null);
		if (porClave != null) {
			porClave.setReserva(reserva);
			porClave.setContactoClave(null);
			return conversacionRepository.save(porClave);
		}

		// 2. Conversación ya existente entre este par (segunda reserva o posterior)
		Conversacion existente = conversacionRepository
				.findFirstByClienteIdAndProfesionalIdOrderByFechaCreacionDesc(cliente.getId(), profesional.getId())
				.orElse(null);
		if (existente != null) {
			existente.setReserva(reserva);
			return conversacionRepository.save(existente);
		}

		// 3. Primera vez que se cruzan sin haber pasado por el chat de contacto
		return conversacionRepository.save(new Conversacion(reserva, cliente, profesional));
	}

	private Conversacion crearConversacionContacto(Usuario cliente, Usuario profesional, String contactoClave) {
		try {
			Conversacion c = conversacionRepository.save(new Conversacion(cliente, profesional, contactoClave));
			log.info("Conversación de contacto {} creada entre cliente {} y profesional {}",
					c.getId(), cliente.getId(), profesional.getId());
			return c;
		} catch (DataIntegrityViolationException ex) {
			log.debug("Conversación de contacto ya existente para clave {}, recuperando", contactoClave);
			return conversacionRepository.findByContactoClave(contactoClave).orElseThrow(() -> ex);
		}
	}

	private String buildContactoClave(Long clienteId, Long profesionalId) {
		return clienteId + ":" + profesionalId;
	}

	private String resumirMensaje(com.jobfree.model.entity.Mensaje mensaje) {
		String contenido = mensaje.getContenido();
		String resumen = (contenido == null || contenido.isBlank())
				? "[Imagen]"
				: contenido;
		return resumen.length() > 200 ? resumen.substring(0, 197) + "..." : resumen;
	}
}
