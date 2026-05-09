package com.jobfree.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.jobfree.dto.conversacion.ConversacionDTO;
import com.jobfree.dto.mensaje.MensajeBatchUpdateDTO;
import com.jobfree.dto.mensaje.MensajeCreateDTO;
import com.jobfree.dto.mensaje.MensajeDTO;
import com.jobfree.dto.mensaje.MensajePageDTO;
import com.jobfree.dto.reaccion.ReaccionDTO;
import com.jobfree.exception.mensaje.MensajeBloqueadoException;
import com.jobfree.exception.mensaje.MensajeNotFoundException;
import com.jobfree.mapper.ConversacionMapper;
import com.jobfree.mapper.MensajeMapper;
import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Mensaje;
import com.jobfree.model.entity.MensajeReaccion;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.BloqueoUsuarioRepository;
import com.jobfree.repository.MensajeReaccionRepository;
import com.jobfree.repository.MensajeRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class MensajeService {

	private static final Logger log = LoggerFactory.getLogger(MensajeService.class);
	private static final long INTERVALO_MINIMO_MS = 1500; // máx ~1 mensaje/1.5s por usuario

	private static final List<String> EMOJIS_PERMITIDOS = List.of("👍", "❤️", "😂", "😮", "😢", "✅");

	private final ConcurrentHashMap<Long, Long> ultimoEnvioPorUsuario = new ConcurrentHashMap<>();
	private final MensajeRepository mensajeRepository;
	private final MensajeReaccionRepository mensajeReaccionRepository;
	private final UsuarioService usuarioService;
	private final ConversacionService conversacionService;
	private final ChatRealtimePublisher chatRealtimePublisher;
	private final BloqueoUsuarioRepository bloqueoRepository;

	public MensajeService(MensajeRepository mensajeRepository, MensajeReaccionRepository mensajeReaccionRepository,
			UsuarioService usuarioService, ConversacionService conversacionService,
			ChatRealtimePublisher chatRealtimePublisher, BloqueoUsuarioRepository bloqueoRepository) {
		this.mensajeRepository = mensajeRepository;
		this.mensajeReaccionRepository = mensajeReaccionRepository;
		this.usuarioService = usuarioService;
		this.conversacionService = conversacionService;
		this.chatRealtimePublisher = chatRealtimePublisher;
		this.bloqueoRepository = bloqueoRepository;
	}

	/**
	 * Obtiene todos los mensajes del sistema (uso administrativo).
	 *
	 * @return lista de mensajes
	 */
	public List<Mensaje> listarMensajes() {
		return mensajeRepository.findAll();
	}

	/**
	 * Busca un mensaje por su ID.
	 *
	 * @param id identificador del mensaje
	 * @return mensaje encontrado
	 * @throws MensajeNotFoundException si no existe
	 */
	public Mensaje obtenerPorId(Long id) {
		return mensajeRepository.findById(id).orElseThrow(() -> new MensajeNotFoundException(id));
	}

	/**
	 * Obtiene los mensajes de una conversación si el usuario tiene
	 * acceso.
	 *
	 * @param conversacionId id de la conversación
	 * @param usuario   usuario autenticado
	 * @return lista de mensajes ordenados por fecha
	 */
	public MensajePageDTO obtenerPorConversacion(Long conversacionId, Usuario usuario, Long before, int size) {
		Conversacion conversacion = conversacionService.obtenerPorIdSeguro(conversacionId, usuario);
		int fetchSize = Math.min(size, 100) + 1;
		List<Mensaje> mensajes = (before != null)
				? mensajeRepository.findByConversacionIdBeforeDesc(conversacion.getId(), before, PageRequest.of(0, fetchSize))
				: mensajeRepository.findLatestByConversacionId(conversacion.getId(), PageRequest.of(0, fetchSize));
		boolean hayMas = mensajes.size() > size;
		if (hayMas) mensajes = new ArrayList<>(mensajes.subList(0, size));
		Collections.reverse(mensajes);
		List<MensajeDTO> dtos = mensajes.stream().map(MensajeMapper::toDTOFull).toList();
		return new MensajePageDTO(dtos, hayMas);
	}

	/**
	 * Crea un mensaje dentro de una conversación. El remitente se obtiene del
	 * usuario autenticado.
	 *
	 * @param dto       datos del mensaje
	 * @param remitente usuario autenticado
	 * @return mensaje creado
	 */
	public MensajeDTO crear(MensajeCreateDTO dto, Usuario remitente) {

		// Deduplicación PRIMERO: un reintento del mismo mensaje (misma red caída, mismo
		// clientMessageId) no debe tocar el rate limit ni contar como nuevo envío.
		Mensaje existente = mensajeRepository.findByConversacionIdAndRemitenteIdAndClientMessageId(
				dto.getConversacionId(),
				remitente.getId(),
				dto.getClientMessageId()
		).orElse(null);
		if (existente != null) {
			return MensajeMapper.toDTOFull(existente);
		}

		// Rate limit: atomic check-and-set para evitar race conditions entre hilos.
		long ahora = System.currentTimeMillis();
		long[] resultadoAnterior = {-1L};
		ultimoEnvioPorUsuario.compute(remitente.getId(), (uid, ultimoEnvio) -> {
			resultadoAnterior[0] = ultimoEnvio != null ? ultimoEnvio : -1L;
			if (ultimoEnvio != null && ahora - ultimoEnvio < INTERVALO_MINIMO_MS) {
				return ultimoEnvio; // no actualizar cuando está limitado
			}
			return ahora;
		});
		if (resultadoAnterior[0] >= 0 && ahora - resultadoAnterior[0] < INTERVALO_MINIMO_MS) {
			// Segunda comprobación de deduplicación: la solicitud concurrente puede haber
			// confirmado entre nuestra primera comprobación y ahora.
			return mensajeRepository.findByConversacionIdAndRemitenteIdAndClientMessageId(
					dto.getConversacionId(), remitente.getId(), dto.getClientMessageId()
			).map(MensajeMapper::toDTOFull).orElseThrow(
					() -> new IllegalArgumentException("Estás enviando mensajes muy rápido. Espera un momento.")
			);
		}

		Usuario destinatario = usuarioService.obtenerPorId(dto.getDestinatarioId());
		Conversacion conversacion = conversacionService.obtenerPorIdSeguro(dto.getConversacionId(), remitente);

		conversacionService.validarParticipante(conversacion, remitente);

		// Bloqueo bidireccional: si cualquiera bloqueó al otro, rechazar el mensaje
		if (bloqueoRepository.existsByBloqueadorIdAndBloqueadoId(destinatario.getId(), remitente.getId())
				|| bloqueoRepository.existsByBloqueadorIdAndBloqueadoId(remitente.getId(), destinatario.getId())) {
			throw new MensajeBloqueadoException();
		}

		boolean tieneContenido = dto.getContenido() != null && !dto.getContenido().isBlank();
		boolean tieneImagen = dto.getImagenUrl() != null && !dto.getImagenUrl().isBlank();
		if (!tieneContenido && !tieneImagen) {
			throw new IllegalArgumentException("El mensaje debe tener contenido o una imagen");
		}

		Usuario cliente = conversacion.getCliente();
		Usuario profesional = conversacion.getProfesional();

		if (!cliente.getId().equals(destinatario.getId()) && !profesional.getId().equals(destinatario.getId())) {
			log.warn("Intento de envío con destinatario ajeno a la conversación: usuario={} conversacion={} destinatario={}",
					remitente.getId(), conversacion.getId(), destinatario.getId());
			throw new IllegalArgumentException("El destinatario no pertenece a la conversación");
		}

		Mensaje mensaje = MensajeMapper.toEntity(dto, remitente, destinatario, conversacion);

		if (dto.getMensajeRespondidoId() != null) {
			mensajeRepository.findByIdAndConversacionId(dto.getMensajeRespondidoId(), conversacion.getId())
					.ifPresent(mensaje::setMensajeRespondido);
		}

		Mensaje guardado = mensajeRepository.save(mensaje);

		conversacion.setUltimoMensajeFecha(guardado.getFechaEnvio());
		String contenido = guardado.getContenido();
		String contenidoResumen = (contenido == null || contenido.isBlank())
				? "[Imagen]"
				: contenido;
		contenidoResumen = contenidoResumen.length() > 200
				? contenidoResumen.substring(0, 197) + "..."
				: contenidoResumen;
		conversacion.setUltimoMensajeContenido(contenidoResumen);

		MensajeDTO mensajeDTO = MensajeMapper.toDTOFull(guardado);

		chatRealtimePublisher.publicarMensajeNuevo(
				conversacion.getId(),
				mensajeDTO,
				destinatario.getEmail()
		);

		publicarActualizacionConversacion(conversacion);

		return mensajeDTO;
	}

	/**
	 * Marca un mensaje como leído. Solo el destinatario puede hacerlo.
	 *
	 * @param id      id del mensaje
	 * @param usuario usuario autenticado
	 * @return mensaje actualizado
	 */
	public Mensaje marcarComoLeido(Long id, Usuario usuario) {

		Mensaje mensaje = obtenerPorId(id);

		// Seguridad clave
		if (!mensaje.getDestinatario().getId().equals(usuario.getId())) {
			log.warn("Intento de marcar mensaje ajeno como leído: usuario={} mensaje={}", usuario.getId(), id);
			throw new IllegalArgumentException("No puedes marcar este mensaje");
		}

		if (mensaje.isLeido()) {
			return mensaje;
		}

		boolean cambioRecibido = !mensaje.isRecibido();
		if (cambioRecibido) {
			mensaje.setRecibido(true);
		}
		mensaje.setLeido(true);

		Mensaje guardado = mensajeRepository.save(mensaje);
		Conversacion conversacion = guardado.getConversacion();

		chatRealtimePublisher.publicarMensajeLeido(
				conversacion.getId(),
				guardado.getId(),
				usuario.getId(),
				conversacion.getCliente().getEmail(),
				conversacion.getProfesional().getEmail()
		);

		if (cambioRecibido) {
			chatRealtimePublisher.publicarMensajeRecibido(
					conversacion.getId(),
					guardado.getId(),
					usuario.getId(),
					conversacion.getCliente().getEmail(),
					conversacion.getProfesional().getEmail()
			);
		}

		publicarActualizacionConversacion(conversacion);

		return guardado;
	}

	public Mensaje marcarComoRecibido(Long id, Usuario usuario) {

		Mensaje mensaje = obtenerPorId(id);

		if (!mensaje.getDestinatario().getId().equals(usuario.getId())) {
			log.warn("Intento de marcar mensaje ajeno como recibido: usuario={} mensaje={}", usuario.getId(), id);
			throw new IllegalArgumentException("No puedes marcar este mensaje");
		}

		if (mensaje.isRecibido()) {
			return mensaje;
		}

		mensaje.setRecibido(true);

		Mensaje guardado = mensajeRepository.save(mensaje);
		Conversacion conversacion = guardado.getConversacion();

		chatRealtimePublisher.publicarMensajeRecibido(
				conversacion.getId(),
				guardado.getId(),
				usuario.getId(),
				conversacion.getCliente().getEmail(),
				conversacion.getProfesional().getEmail()
		);

		publicarActualizacionConversacion(conversacion);

		return guardado;
	}

	public List<Mensaje> marcarComoRecibidoBatch(MensajeBatchUpdateDTO dto, Usuario usuario) {
		List<Mensaje> mensajes = obtenerMensajesBatchDelDestinatario(dto, usuario);
		List<Mensaje> actualizados = mensajes.stream()
				.filter(m -> !m.isRecibido())
				.peek(m -> m.setRecibido(true))
				.collect(Collectors.toList());
		if (actualizados.isEmpty()) return mensajes;
		publicarEventosBatchRecibido(mensajeRepository.saveAll(actualizados), usuario);
		return mensajes;
	}

	public List<Mensaje> marcarComoLeidoBatch(MensajeBatchUpdateDTO dto, Usuario usuario) {
		List<Mensaje> mensajes = obtenerMensajesBatchDelDestinatario(dto, usuario);
		List<Long> idsNuevosRecibidos = new ArrayList<>();
		List<Mensaje> actualizados = mensajes.stream()
				.filter(m -> !m.isLeido())
				.peek(m -> {
					if (!m.isRecibido()) {
						m.setRecibido(true);
						idsNuevosRecibidos.add(m.getId());
					}
					m.setLeido(true);
				})
				.collect(Collectors.toList());
		if (actualizados.isEmpty()) return mensajes;
		publicarEventosBatchLeido(mensajeRepository.saveAll(actualizados), idsNuevosRecibidos, usuario);
		return mensajes;
	}

	public long contarNoLeidos(Usuario usuario) {
		return mensajeRepository.countNoLeidosExcluyendoSilenciados(usuario.getId());
	}

	public Map<Long, Integer> contarNoLeidosPorConversaciones(List<Long> conversacionIds, Long usuarioId) {
		if (conversacionIds == null || conversacionIds.isEmpty()) {
			return Map.of();
		}
		return mensajeRepository.countNoLeidosPorConversaciones(conversacionIds, usuarioId).stream()
				.collect(Collectors.toMap(
						row -> (Long) row[0],
						row -> ((Number) row[1]).intValue()
				));
	}

	private List<Mensaje> obtenerMensajesBatchDelDestinatario(MensajeBatchUpdateDTO dto, Usuario usuario) {
		List<Long> ids = dto.getMensajeIds().stream()
				.filter(id -> id != null)
				.collect(Collectors.collectingAndThen(Collectors.toCollection(LinkedHashSet::new), ArrayList::new));

		if (ids.isEmpty()) {
			return List.of();
		}

		return mensajeRepository.findByIdInAndDestinatarioId(ids, usuario.getId());
	}

	private void publicarEventosBatchRecibido(List<Mensaje> mensajes, Usuario usuario) {
		Map<Long, List<Mensaje>> porConversacion = mensajes.stream()
				.collect(Collectors.groupingBy(mensaje -> mensaje.getConversacion().getId()));

		for (List<Mensaje> mensajesConversacion : porConversacion.values()) {
			Conversacion conversacion = mensajesConversacion.get(0).getConversacion();

			chatRealtimePublisher.publicarMensajeRecibidoLoteDesdeMensajes(
					conversacion.getId(),
					mensajesConversacion,
					usuario.getId(),
					conversacion.getCliente().getEmail(),
					conversacion.getProfesional().getEmail()
			);

			publicarActualizacionConversacion(conversacion);
		}
	}

	private void publicarEventosBatchLeido(List<Mensaje> mensajes, List<Long> idsRecibidos, Usuario usuario) {
		Map<Long, List<Mensaje>> porConversacion = mensajes.stream()
				.collect(Collectors.groupingBy(mensaje -> mensaje.getConversacion().getId()));
		LinkedHashSet<Long> idsRecibidosSet = new LinkedHashSet<>(idsRecibidos);

		for (List<Mensaje> mensajesConversacion : porConversacion.values()) {
			Conversacion conversacion = mensajesConversacion.get(0).getConversacion();

			if (mensajesConversacion.stream().anyMatch(mensaje -> idsRecibidosSet.contains(mensaje.getId()))) {
				List<Mensaje> mensajesRecibidos = mensajesConversacion.stream()
						.filter(mensaje -> idsRecibidosSet.contains(mensaje.getId()))
						.collect(Collectors.toList());

				chatRealtimePublisher.publicarMensajeRecibidoLoteDesdeMensajes(
						conversacion.getId(),
						mensajesRecibidos,
						usuario.getId(),
						conversacion.getCliente().getEmail(),
						conversacion.getProfesional().getEmail()
				);
			}

			chatRealtimePublisher.publicarMensajeLeidoLoteDesdeMensajes(
					conversacion.getId(),
					mensajesConversacion,
					usuario.getId(),
					conversacion.getCliente().getEmail(),
					conversacion.getProfesional().getEmail()
			);

			publicarActualizacionConversacion(conversacion);
		}
	}

	public List<ReaccionDTO> toggleReaccion(Long mensajeId, String emoji, Usuario usuario) {
		if (!EMOJIS_PERMITIDOS.contains(emoji)) {
			throw new IllegalArgumentException("Emoji no permitido");
		}
		Mensaje mensaje = obtenerPorId(mensajeId);
		Conversacion conversacion = mensaje.getConversacion();
		if (!conversacion.getCliente().getId().equals(usuario.getId())
				&& !conversacion.getProfesional().getId().equals(usuario.getId())) {
			throw new IllegalArgumentException("No tienes acceso a este mensaje");
		}
		// Un usuario solo puede tener un emoji por mensaje; si ya tenía uno lo borramos
		Optional<MensajeReaccion> existente = mensajeReaccionRepository.findByMensajeIdAndUsuarioId(mensajeId, usuario.getId());
		boolean mismoEmoji = existente.isPresent() && existente.get().getEmoji().equals(emoji);
		existente.ifPresent(mensajeReaccionRepository::delete);
		if (!mismoEmoji) {
			mensajeReaccionRepository.save(new MensajeReaccion(mensaje, usuario, emoji));
		}
		List<ReaccionDTO> reacciones = agruparReacciones(
				mensajeReaccionRepository.findByMensajeIdOrderByFechaCreacionAsc(mensajeId));
		chatRealtimePublisher.publicarReaccion(conversacion.getId(), mensajeId, reacciones,
				conversacion.getCliente().getEmail(), conversacion.getProfesional().getEmail());
		return reacciones;
	}

	private List<ReaccionDTO> agruparReacciones(List<MensajeReaccion> reacciones) {
		Map<String, List<Long>> porEmoji = new LinkedHashMap<>();
		for (MensajeReaccion r : reacciones) {
			porEmoji.computeIfAbsent(r.getEmoji(), k -> new ArrayList<>()).add(r.getUsuario().getId());
		}
		return porEmoji.entrySet().stream()
				.map(e -> new ReaccionDTO(e.getKey(), e.getValue()))
				.toList();
	}

	private void publicarActualizacionConversacion(Conversacion conversacion) {
		int noLeidosCliente = mensajeRepository.countNoLeidosPorConversacion(
				conversacion.getId(), conversacion.getCliente().getId());
		int noLeidosProfesional = mensajeRepository.countNoLeidosPorConversacion(
				conversacion.getId(), conversacion.getProfesional().getId());

		ConversacionDTO dtoCliente = ConversacionMapper.toDTO(conversacion, conversacion.getCliente());
		dtoCliente.setNoLeidos(noLeidosCliente);

		ConversacionDTO dtoProfesional = ConversacionMapper.toDTO(conversacion, conversacion.getProfesional());
		dtoProfesional.setNoLeidos(noLeidosProfesional);

		chatRealtimePublisher.publicarConversacionActualizadaPersonalizada(
				conversacion.getId(),
				dtoCliente, conversacion.getCliente().getEmail(),
				dtoProfesional, conversacion.getProfesional().getEmail());
	}
}
