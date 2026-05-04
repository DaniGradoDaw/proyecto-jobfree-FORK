package com.jobfree.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobfree.dto.usuario.UsuarioCreateDTO;
import com.jobfree.dto.usuario.UsuarioUpdateDTO;
import com.jobfree.exception.usuario.UsuarioAdminNoPermitidoException;
import com.jobfree.exception.usuario.UsuarioDuplicadoException;
import com.jobfree.exception.usuario.UsuarioNotFoundException;
import com.jobfree.mapper.UsuarioMapper;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Plan;
import com.jobfree.model.enums.Rol;
import com.jobfree.repository.ProfesionalInfoRepository;
import com.jobfree.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UsuarioService {

	private static final Logger log = LoggerFactory.getLogger(UsuarioService.class);

	private final UsuarioRepository usuarioRepository;
	private final ProfesionalInfoRepository profesionalInfoRepository;
	private final ProfesionalInfoService profesionalInfoService;
	private final PasswordEncoder passwordEncoder;

	public UsuarioService(UsuarioRepository usuarioRepository,
						  ProfesionalInfoRepository profesionalInfoRepository,
						  ProfesionalInfoService profesionalInfoService,
						  PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.profesionalInfoRepository = profesionalInfoRepository;
		this.profesionalInfoService = profesionalInfoService;
		this.passwordEncoder = passwordEncoder;
	}

	/**
	 * Obtiene todos los usuarios.
	 * 
	 * @return lista de usuarios
	 */
	public List<Usuario> listarUsuarios() {
		return usuarioRepository.findAll();
	}

	/**
	 * Obtiene un usuario por su ID.
	 * 
	 * @param id identificador del usuario
	 * @return usuario encontrado
	 */
	public Usuario obtenerPorId(Long id) {
		return usuarioRepository.findById(id).orElseThrow(() -> new UsuarioNotFoundException(id));
	}

	/**
	 * Crea un usuario validando rol y duplicados.
	 * 
	 * @param usuario entidad usuario
	 * @return usuario guardado
	 */
	public Usuario crearUsuario(Usuario usuario) {

		if (usuario.getRol() == null) {
			usuario.setRol(Rol.CLIENTE);
		}

		if (usuario.getRol() == Rol.ADMIN) {
			throw new UsuarioAdminNoPermitidoException();
		}

		if (usuarioRepository.existsByEmail(usuario.getEmail())) {
			throw new UsuarioDuplicadoException("email");
		}

		if (usuarioRepository.existsByTelefono(usuario.getTelefono())) {
			// Mensaje genérico para no revelar si el teléfono está registrado (enumeration)
			throw new UsuarioDuplicadoException("email o teléfono");
		}

		Usuario guardado = usuarioRepository.save(usuario);
		log.info("Usuario {} registrado con rol {}", guardado.getEmail(), guardado.getRol());
		return guardado;
	}

	/**
	 * Crea un usuario con rol CLIENTE.
	 * 
	 * @param dto datos de creación
	 * @return usuario creado
	 */
	public Usuario crearCliente(UsuarioCreateDTO dto) {
		Usuario u = UsuarioMapper.toEntity(dto);
		u.setRol(Rol.CLIENTE);
		u.setPassword(passwordEncoder.encode(dto.getPassword()));
		return crearUsuario(u);
	}

	/**
	 * Crea un usuario con rol PROFESIONAL.
	 * 
	 * @param dto datos de creación
	 * @return usuario creado
	 */
	public Usuario crearProfesional(UsuarioCreateDTO dto) {
		Usuario u = UsuarioMapper.toEntity(dto);
		u.setRol(Rol.PROFESIONAL);
		u.setPassword(passwordEncoder.encode(dto.getPassword()));
		Usuario guardado = crearUsuario(u);

		ProfesionalInfo perfil = new ProfesionalInfo();
		perfil.setDescripcion("Perfil en construcción");
		perfil.setExperiencia(0);
		perfil.setPlan(Plan.BASICO);
		perfil.setUsuario(guardado);
		profesionalInfoRepository.save(perfil);

		return guardado;
	}

	/**
	 * Actualiza un usuario existente.
	 * 
	 * @param id    identificador del usuario
	 * @param datos nuevos datos
	 * @return usuario actualizado
	 */
	public Usuario actualizarUsuario(Long id, Usuario datos) {

		Usuario existente = obtenerPorId(id);

		if (datos.getApellidos() != null && !datos.getApellidos().isBlank()) {
			existente.setApellidos(datos.getApellidos());
		}

		if (datos.getNombre() != null && !datos.getNombre().isBlank()) {
			existente.setNombre(datos.getNombre());
		}

		if (datos.getEmail() != null && !datos.getEmail().isBlank()) {

			if (!datos.getEmail().equals(existente.getEmail()) && usuarioRepository.existsByEmail(datos.getEmail())) {

				throw new UsuarioDuplicadoException("email");
			}

			existente.setEmail(datos.getEmail());
		}

		if (datos.getTelefono() != null && !datos.getTelefono().isBlank()) {

			if (!datos.getTelefono().equals(existente.getTelefono())
					&& usuarioRepository.existsByTelefono(datos.getTelefono())) {

				throw new UsuarioDuplicadoException("email o teléfono");
			}

			existente.setTelefono(datos.getTelefono());
		}

		if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
			existente.setPassword(passwordEncoder.encode(datos.getPassword()));
		}

		if (datos.getDireccion() != null && !datos.getDireccion().isBlank()) {
			existente.setDireccion(datos.getDireccion());
		}

		if (datos.getCiudad() != null && !datos.getCiudad().isBlank()) {
			existente.setCiudad(datos.getCiudad());
		}

		if (datos.getFotoUrl() != null) {
			existente.setFotoUrl(datos.getFotoUrl());
		}

		Usuario actualizado = usuarioRepository.save(existente);
		if (datos.getCiudad() != null && !datos.getCiudad().isBlank()) {
			profesionalInfoService.sincronizarUbicacionPorCambioDeCiudad(actualizado.getId(), actualizado.getCiudad());
		}

		return actualizado;
	}

	public Usuario actualizarFoto(Long id, String fotoUrl) {
		Usuario usuario = obtenerPorId(id);
		usuario.setFotoUrl(fotoUrl);
		return usuarioRepository.save(usuario);
	}

	/**
	 * Actualiza un usuario a partir de un DTO.
	 * 
	 * @param id  identificador del usuario
	 * @param dto datos a actualizar
	 * @return usuario actualizado
	 */
	public Usuario actualizarUsuarioDesdeDTO(Long id, UsuarioUpdateDTO dto) {

		Usuario datos = UsuarioMapper.toEntity(dto);

		return actualizarUsuario(id, datos);
	}

	/**
	 * Busca un usuario por email o lo crea si no existe (flujo OAuth2).
	 * Los usuarios sociales reciben un teléfono placeholder único y una contraseña
	 * aleatoria no accesible, ya que autentican mediante el proveedor externo.
	 *
	 * @param email    email del proveedor OAuth2
	 * @param nombre   nombre del proveedor
	 * @param apellidos apellidos del proveedor (puede ser vacío)
	 * @return usuario existente o recién creado
	 */
	public boolean existePorEmail(String email) {
		return usuarioRepository.existsByEmail(email);
	}

	public void actualizarRol(String email, Rol rol) {
		if (rol == Rol.ADMIN) return;
		Usuario u = usuarioRepository.findByEmail(email)
				.orElseThrow(() -> new UsuarioNotFoundException(0L));
		u.setRol(rol);
		usuarioRepository.save(u);
	}

	public Usuario buscarOCrearPorOAuth2(String email, String nombre, String apellidos, Rol rol) {
		return usuarioRepository.findByEmail(email).orElseGet(() -> {
			Usuario nuevo = new Usuario();
			nuevo.setEmail(email);
			nuevo.setNombre(nombre != null && !nombre.isBlank() ? nombre : "Usuario");
			nuevo.setApellidos(apellidos != null ? apellidos : "");
			nuevo.setRol(rol != null ? rol : Rol.CLIENTE);
			// Placeholder único para teléfono — el usuario puede actualizarlo desde su perfil
			String telefonoPlaceholder = "S" + java.util.UUID.randomUUID().toString()
					.replace("-", "").substring(0, 19);
			nuevo.setTelefono(telefonoPlaceholder);
			// Contraseña aleatoria no adivinable — no se usa para login, solo satisface la constraint DB
			nuevo.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
			Usuario guardado = usuarioRepository.save(nuevo);

			if (Rol.PROFESIONAL.equals(guardado.getRol())) {
				ProfesionalInfo perfil = new ProfesionalInfo();
				perfil.setDescripcion("Perfil en construcción");
				perfil.setExperiencia(0);
				perfil.setPlan(Plan.BASICO);
				perfil.setUsuario(guardado);
				profesionalInfoRepository.save(perfil);
			}

			return guardado;
		});
	}

	/**
	 * Elimina un usuario por ID.
	 *
	 * @param id identificador del usuario
	 */
	public Usuario cambiarRol(Long id, Rol rol) {
		Usuario usuario = obtenerPorId(id);
		usuario.setRol(rol);
		return usuarioRepository.save(usuario);
	}

	public void eliminarUsuario(Long id) {
		Usuario usuario = obtenerPorId(id);
		usuarioRepository.delete(usuario);
	}

}
