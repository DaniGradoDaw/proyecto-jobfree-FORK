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

import com.jobfree.exception.resena.ResenaInvalidaException;
import com.jobfree.exception.resena.ResenaNotFoundException;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.ResenaProfesional;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.EstadoReserva;
import com.jobfree.repository.ResenaProfesionalRepository;

@ExtendWith(MockitoExtension.class)
class ResenaProfesionalServiceTest {

    @Mock ResenaProfesionalRepository resenaRepository;

    @InjectMocks ResenaProfesionalService resenaService;

    private Usuario cliente;
    private Usuario usuarioProfesional;
    private ProfesionalInfo profesional;
    private ResenaProfesional resena;
    private Reserva reserva;

    @BeforeEach
    void setUp() {
        cliente = new Usuario();
        setId(cliente, 1L);

        usuarioProfesional = new Usuario();
        setId(usuarioProfesional, 2L);

        profesional = new ProfesionalInfo();
        setId(profesional, 10L);
        profesional.setUsuario(usuarioProfesional);

        resena = new ResenaProfesional(5, "Excelente profesional, muy puntual", cliente, profesional);
        setId(resena, 100L);

        ServicioOfrecido servicio = new ServicioOfrecido();
        setId(servicio, 200L);
        servicio.setProfesional(profesional);

        reserva = new Reserva();
        setId(reserva, 300L);
        reserva.setCliente(cliente);
        reserva.setServicio(servicio);
        reserva.setEstado(EstadoReserva.COMPLETADA);
    }

    // ── obtenerPorId ──────────────────────────────────────────────────────────

    @Test
    void obtenerPorId_existente_retornaResena() {
        when(resenaRepository.findById(100L)).thenReturn(Optional.of(resena));

        ResenaProfesional resultado = resenaService.obtenerPorId(100L);

        assertThat(resultado).isEqualTo(resena);
    }

    @Test
    void obtenerPorId_inexistente_lanzaResenaNotFoundException() {
        when(resenaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resenaService.obtenerPorId(99L))
                .isInstanceOf(ResenaNotFoundException.class);
    }

    // ── listar ────────────────────────────────────────────────────────────────

    @Test
    void listarPorProfesional_retornaLista() {
        when(resenaRepository.findByProfesionalIdOrderByFechaCreacionDesc(10L)).thenReturn(List.of(resena));

        List<ResenaProfesional> resultado = resenaService.listarPorProfesional(10L);

        assertThat(resultado).containsExactly(resena);
    }

    @Test
    void listarPorCliente_retornaLista() {
        when(resenaRepository.findByClienteIdOrderByFechaCreacionDesc(1L)).thenReturn(List.of(resena));

        List<ResenaProfesional> resultado = resenaService.listarPorCliente(1L);

        assertThat(resultado).containsExactly(resena);
    }

    // ── crear ─────────────────────────────────────────────────────────────────

    @Test
    void crear_valida_guardaYRetorna() {
        when(resenaRepository.existsByClienteIdAndProfesionalId(1L, 10L)).thenReturn(false);
        when(resenaRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ResenaProfesional resultado = resenaService.crear(resena);

        assertThat(resultado.getCalificacion()).isEqualTo(5);
        verify(resenaRepository).save(resena);
    }

    @Test
    void crear_duplicada_lanzaExcepcion() {
        when(resenaRepository.existsByClienteIdAndProfesionalId(1L, 10L)).thenReturn(true);

        assertThatThrownBy(() -> resenaService.crear(resena))
                .isInstanceOf(ResenaInvalidaException.class)
                .hasMessageContaining("Ya has dejado");
    }

    @Test
    void crear_calificacionFueraRango_lanzaExcepcion() {
        resena.setCalificacion(6);

        assertThatThrownBy(() -> resenaService.crear(resena))
                .isInstanceOf(ResenaInvalidaException.class)
                .hasMessageContaining("calificación");
    }

    @Test
    void crear_comentarioVacio_lanzaExcepcion() {
        resena.setComentario("");

        assertThatThrownBy(() -> resenaService.crear(resena))
                .isInstanceOf(ResenaInvalidaException.class)
                .hasMessageContaining("comentario");
    }

    @Test
    void crear_mismoUsuario_lanzaExcepcion() {
        // el cliente tiene el mismo id que el usuario profesional
        setId(usuarioProfesional, 1L);

        assertThatThrownBy(() -> resenaService.crear(resena))
                .isInstanceOf(ResenaInvalidaException.class)
                .hasMessageContaining("ti mismo");
    }

    @Test
    void crear_conReservaCompletadaCorrespondiente_guardaYRetorna() {
        resena.setReserva(reserva);
        when(resenaRepository.existsByClienteIdAndProfesionalIdAndReservaId(1L, 10L, 300L)).thenReturn(false);
        when(resenaRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ResenaProfesional resultado = resenaService.crear(resena);

        assertThat(resultado.getReserva()).isEqualTo(reserva);
        verify(resenaRepository).save(resena);
    }

    @Test
    void crear_conReservaNoCompletada_lanzaExcepcion() {
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        resena.setReserva(reserva);

        assertThatThrownBy(() -> resenaService.crear(resena))
                .isInstanceOf(ResenaInvalidaException.class)
                .hasMessageContaining("completadas");
    }

    @Test
    void crear_conReservaDeOtroCliente_lanzaExcepcion() {
        Usuario otroCliente = new Usuario();
        setId(otroCliente, 999L);
        reserva.setCliente(otroCliente);
        resena.setReserva(reserva);

        assertThatThrownBy(() -> resenaService.crear(resena))
                .isInstanceOf(ResenaInvalidaException.class)
                .hasMessageContaining("cliente");
    }

    @Test
    void crear_conReservaDeOtroProfesional_lanzaExcepcion() {
        ProfesionalInfo otroProfesional = new ProfesionalInfo();
        setId(otroProfesional, 999L);
        Usuario otroUsuarioProfesional = new Usuario();
        setId(otroUsuarioProfesional, 998L);
        otroProfesional.setUsuario(otroUsuarioProfesional);

        ServicioOfrecido otroServicio = new ServicioOfrecido();
        setId(otroServicio, 999L);
        otroServicio.setProfesional(otroProfesional);
        reserva.setServicio(otroServicio);
        resena.setReserva(reserva);

        assertThatThrownBy(() -> resenaService.crear(resena))
                .isInstanceOf(ResenaInvalidaException.class)
                .hasMessageContaining("profesional");
    }

    // ── eliminar ──────────────────────────────────────────────────────────────

    @Test
    void eliminar_propietario_eliminaCorrectamente() {
        when(resenaRepository.findById(100L)).thenReturn(Optional.of(resena));

        resenaService.eliminar(100L, 1L);

        verify(resenaRepository).delete(resena);
    }

    @Test
    void eliminar_otroCliente_lanzaExcepcion() {
        when(resenaRepository.findById(100L)).thenReturn(Optional.of(resena));

        assertThatThrownBy(() -> resenaService.eliminar(100L, 999L))
                .isInstanceOf(ResenaInvalidaException.class)
                .hasMessageContaining("permiso");
    }

    // ── media ─────────────────────────────────────────────────────────────────

    @Test
    void obtenerMediaProfesional_sinValoraciones_retornaCero() {
        when(resenaRepository.obtenerMediaPorProfesional(10L)).thenReturn(null);

        double media = resenaService.obtenerMediaProfesional(10L);

        assertThat(media).isEqualTo(0.0);
    }

    @Test
    void obtenerMediaProfesional_conValoraciones_retornaMedia() {
        when(resenaRepository.obtenerMediaPorProfesional(10L)).thenReturn(4.5);

        double media = resenaService.obtenerMediaProfesional(10L);

        assertThat(media).isEqualTo(4.5);
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
