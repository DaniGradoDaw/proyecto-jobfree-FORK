package com.jobfree.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jobfree.exception.conversacion.ConversacionAccesoException;
import com.jobfree.exception.conversacion.ConversacionNotFoundException;
import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Rol;
import com.jobfree.repository.ConversacionRepository;
import com.jobfree.repository.MensajeRepository;
import com.jobfree.repository.ReservaRepository;
import com.jobfree.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class ConversacionServiceTest {

    @Mock ConversacionRepository conversacionRepository;
    @Mock ReservaRepository reservaRepository;
    @Mock UsuarioRepository usuarioRepository;
    @Mock MensajeRepository mensajeRepository;

    @InjectMocks ConversacionService conversacionService;

    private Usuario cliente;
    private Usuario profesional;
    private Conversacion conversacion;

    @BeforeEach
    void setUp() {
        cliente = new Usuario();
        setId(cliente, 1L);
        cliente.setRol(Rol.CLIENTE);

        profesional = new Usuario();
        setId(profesional, 2L);
        profesional.setRol(Rol.PROFESIONAL);

        conversacion = new Conversacion(cliente, profesional, "1:2");
        setId(conversacion, 10L);
    }

    // ── obtenerPorId ──────────────────────────────────────────────────────────

    @Test
    void obtenerPorId_existente_retornaConversacion() {
        when(conversacionRepository.findById(10L)).thenReturn(Optional.of(conversacion));

        Conversacion resultado = conversacionService.obtenerPorId(10L);

        assertThat(resultado).isEqualTo(conversacion);
    }

    @Test
    void obtenerPorId_inexistente_lanzaExcepcion() {
        when(conversacionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> conversacionService.obtenerPorId(99L))
                .isInstanceOf(ConversacionNotFoundException.class)
                .hasMessageContaining("no encontrada");
    }

    // ── obtenerPorIdSeguro ────────────────────────────────────────────────────

    @Test
    void obtenerPorIdSeguro_participante_retorna() {
        when(conversacionRepository.findById(10L)).thenReturn(Optional.of(conversacion));

        Conversacion resultado = conversacionService.obtenerPorIdSeguro(10L, cliente);

        assertThat(resultado).isEqualTo(conversacion);
    }

    @Test
    void obtenerPorIdSeguro_ajenio_lanzaExcepcion() {
        Usuario ajeno = new Usuario();
        setId(ajeno, 99L);
        when(conversacionRepository.findById(10L)).thenReturn(Optional.of(conversacion));

        assertThatThrownBy(() -> conversacionService.obtenerPorIdSeguro(10L, ajeno))
                .isInstanceOf(ConversacionAccesoException.class)
                .hasMessageContaining("acceso");
    }

    // ── misConversaciones ─────────────────────────────────────────────────────

    @Test
    void misConversaciones_retornaListaOrdenada() {
        when(conversacionRepository.findByClienteIdOrProfesionalIdOrderByFechaCreacionDesc(1L, 1L))
                .thenReturn(List.of(conversacion));
        when(mensajeRepository.findFirstByConversacionIdOrderByFechaEnvioDesc(10L))
                .thenReturn(Optional.empty());

        List<Conversacion> resultado = conversacionService.misConversaciones(cliente);

        assertThat(resultado).containsExactly(conversacion);
    }

    // ── crearOObtenerConversacion ─────────────────────────────────────────────

    @Test
    void crearOObtenerConversacion_nueva_creaYRetorna() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(profesional));
        when(conversacionRepository.findFirstByClienteIdAndProfesionalIdOrderByFechaCreacionDesc(1L, 2L))
                .thenReturn(Optional.empty());
        when(conversacionRepository.findByContactoClave("1:2")).thenReturn(Optional.empty());
        when(conversacionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Conversacion resultado = conversacionService.crearOObtenerConversacion(1L, 2L);

        assertThat(resultado.getCliente()).isEqualTo(cliente);
        assertThat(resultado.getProfesional()).isEqualTo(profesional);
    }

    @Test
    void crearOObtenerConversacion_existente_recuperaSinDuplicar() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(profesional));
        when(conversacionRepository.findFirstByClienteIdAndProfesionalIdOrderByFechaCreacionDesc(1L, 2L))
                .thenReturn(Optional.of(conversacion));

        Conversacion resultado = conversacionService.crearOObtenerConversacion(1L, 2L);

        assertThat(resultado).isEqualTo(conversacion);
        verify(conversacionRepository, never()).save(any());
    }

    @Test
    void crearOObtenerConversacion_clienteEsProfesional_lanzaExcepcion() {
        profesional.setRol(Rol.CLIENTE);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(profesional));

        assertThatThrownBy(() -> conversacionService.crearOObtenerConversacion(1L, 2L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("profesional");
    }

    @Test
    void crearOObtenerConversacion_mismoUsuario_lanzaExcepcion() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));

        assertThatThrownBy(() -> conversacionService.crearOObtenerConversacion(1L, 1L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    // ── validarParticipante ───────────────────────────────────────────────────

    @Test
    void validarParticipante_cliente_pasaSinExcepcion() {
        assertThatCode(() -> conversacionService.validarParticipante(conversacion, cliente))
                .doesNotThrowAnyException();
    }

    @Test
    void validarParticipante_profesional_pasaSinExcepcion() {
        assertThatCode(() -> conversacionService.validarParticipante(conversacion, profesional))
                .doesNotThrowAnyException();
    }

    @Test
    void validarParticipante_ajeno_lanzaExcepcion() {
        Usuario ajeno = new Usuario();
        setId(ajeno, 99L);

        assertThatThrownBy(() -> conversacionService.validarParticipante(conversacion, ajeno))
                .isInstanceOf(ConversacionAccesoException.class)
                .hasMessageContaining("acceso");
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
