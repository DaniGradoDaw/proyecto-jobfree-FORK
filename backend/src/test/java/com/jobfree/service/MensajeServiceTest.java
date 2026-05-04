package com.jobfree.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jobfree.dto.mensaje.MensajeCreateDTO;
import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Mensaje;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Rol;
import com.jobfree.repository.MensajeRepository;

@ExtendWith(MockitoExtension.class)
class MensajeServiceTest {

	@Mock MensajeRepository mensajeRepository;
	@Mock UsuarioService usuarioService;
	@Mock ConversacionService conversacionService;
	@Mock ChatRealtimePublisher chatRealtimePublisher;

	@InjectMocks MensajeService mensajeService;

	private Usuario cliente;
	private Usuario profesional;
	private Conversacion conversacion;

	@BeforeEach
	void setUp() {
		cliente = usuario(1L, "Cliente", "cliente@test.local", Rol.CLIENTE);
		profesional = usuario(2L, "Profesional", "pro@test.local", Rol.PROFESIONAL);
		conversacion = new Conversacion(cliente, profesional, "1:2");
		setId(conversacion, 10L);
	}

	@Test
	void crear_mensajeSoloImagen_actualizaResumenSinExcepcion() {
		MensajeCreateDTO dto = new MensajeCreateDTO();
		dto.setConversacionId(10L);
		dto.setDestinatarioId(2L);
		dto.setClientMessageId("img-1");
		dto.setImagenUrl("/uploads/mensajes/imagen.jpg");

		when(usuarioService.obtenerPorId(2L)).thenReturn(profesional);
		when(conversacionService.obtenerPorIdSeguro(10L, cliente)).thenReturn(conversacion);
		when(mensajeRepository.findByConversacionIdAndRemitenteIdAndClientMessageId(10L, 1L, "img-1"))
				.thenReturn(Optional.empty());
		when(mensajeRepository.save(any(Mensaje.class))).thenAnswer(inv -> {
			Mensaje mensaje = inv.getArgument(0);
			setId(mensaje, 99L);
			return mensaje;
		});

		assertThatCode(() -> mensajeService.crear(dto, cliente)).doesNotThrowAnyException();
		assertThat(conversacion.getUltimoMensajeContenido()).isEqualTo("[Imagen]");
	}

	private Usuario usuario(Long id, String nombre, String email, Rol rol) {
		Usuario usuario = new Usuario();
		setId(usuario, id);
		usuario.setNombre(nombre);
		usuario.setApellidos("Test");
		usuario.setEmail(email);
		usuario.setRol(rol);
		return usuario;
	}

	private static void setId(Object obj, Long id) {
		try {
			var field = obj.getClass().getDeclaredField("id");
			field.setAccessible(true);
			field.set(obj, id);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
