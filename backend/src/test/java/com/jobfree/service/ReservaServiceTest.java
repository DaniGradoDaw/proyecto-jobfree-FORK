package com.jobfree.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jobfree.exception.reserva.ReservaInvalidaException;
import com.jobfree.exception.reserva.ReservaNotFoundException;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.EstadoReserva;
import com.jobfree.repository.ReservaRepository;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock ReservaRepository reservaRepository;
    @Mock ConversacionService conversacionService;
    @Mock NotificacionService notificacionService;

    @InjectMocks ReservaService reservaService;

    private Usuario cliente;
    private Usuario usuarioProfesional;
    private ProfesionalInfo profesional;
    private ServicioOfrecido servicio;
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

        servicio = new ServicioOfrecido();
        setId(servicio, 100L);
        servicio.setTitulo("Limpieza del hogar");
        servicio.setDuracionMin(60);
        servicio.setPrecioHora(new BigDecimal("20.00"));
        servicio.setActiva(true);
        servicio.setProfesional(profesional);

        reserva = new Reserva(cliente, servicio, LocalDateTime.now().plusDays(1));
        reserva.setEstado(EstadoReserva.PENDIENTE);
    }

    // ── obtenerPorId ──────────────────────────────────────────────────────────

    @Test
    void obtenerPorId_existente_retornaReserva() {
        when(reservaRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(reserva));

        Reserva resultado = reservaService.obtenerPorId(1L);

        assertThat(resultado).isEqualTo(reserva);
    }

    @Test
    void obtenerPorId_inexistente_lanzaReservaNotFoundException() {
        when(reservaRepository.findByIdWithDetails(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservaService.obtenerPorId(99L))
                .isInstanceOf(ReservaNotFoundException.class)
                .hasMessageContaining("99");
    }

    // ── misReservas / misSolicitudes ──────────────────────────────────────────

    @Test
    void misReservas_retornaListaDelRepositorio() {
        when(reservaRepository.findByClienteIdOrderByFechaCreacionDesc(1L)).thenReturn(List.of(reserva));

        List<Reserva> resultado = reservaService.misReservas(cliente);

        assertThat(resultado).containsExactly(reserva);
    }

    @Test
    void misSolicitudes_retornaListaDelRepositorio() {
        when(reservaRepository.findByServicioProfesionalUsuarioIdOrderByFechaCreacionDesc(2L))
                .thenReturn(List.of(reserva));

        List<Reserva> resultado = reservaService.misSolicitudes(usuarioProfesional);

        assertThat(resultado).containsExactly(reserva);
    }

    // ── crearReserva ──────────────────────────────────────────────────────────

    @Test
    void crearReserva_datosValidos_guardaYRetorna() {
        when(reservaRepository.existsByServicioAndFechaInicio(any(), any())).thenReturn(false);
        when(reservaRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Reserva resultado = reservaService.crearReserva(reserva);

        assertThat(resultado.getEstado()).isEqualTo(EstadoReserva.PENDIENTE);
        assertThat(resultado.getPrecioTotal()).isEqualByComparingTo("20.00");
        verify(conversacionService).obtenerOCrearPorReserva(reserva);
        verify(notificacionService).crear(anyString(), eq(usuarioProfesional));
    }

    @Test
    void crearReserva_servicioInactivo_lanzaExcepcion() {
        servicio.setActiva(false);

        assertThatThrownBy(() -> reservaService.crearReserva(reserva))
                .isInstanceOf(ReservaInvalidaException.class)
                .hasMessageContaining("disponible");
    }

    @Test
    void crearReserva_fechaPasada_lanzaExcepcion() {
        reserva.setFechaInicio(LocalDateTime.now().minusDays(1));

        assertThatThrownBy(() -> reservaService.crearReserva(reserva))
                .isInstanceOf(ReservaInvalidaException.class)
                .hasMessageContaining("pasada");
    }

    @Test
    void crearReserva_duplicada_lanzaExcepcion() {
        when(reservaRepository.existsByServicioAndFechaInicio(any(), any())).thenReturn(true);

        assertThatThrownBy(() -> reservaService.crearReserva(reserva))
                .isInstanceOf(ReservaInvalidaException.class)
                .hasMessageContaining("Ya existe");
    }

    // ── confirmarReserva ──────────────────────────────────────────────────────

    @Test
    void confirmarReserva_porPropietario_cambiaEstado() {
        when(reservaRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Reserva resultado = reservaService.confirmarReserva(reserva, usuarioProfesional);

        assertThat(resultado.getEstado()).isEqualTo(EstadoReserva.CONFIRMADA);
        verify(notificacionService).crear(anyString(), eq(cliente));
    }

    @Test
    void confirmarReserva_porClienteAjeno_lanzaExcepcion() {
        assertThatThrownBy(() -> reservaService.confirmarReserva(reserva, cliente))
                .isInstanceOf(ReservaInvalidaException.class)
                .hasMessageContaining("profesional");
    }

    @Test
    void confirmarReserva_estadoNoPermitido_lanzaExcepcion() {
        reserva.setEstado(EstadoReserva.CONFIRMADA);

        assertThatThrownBy(() -> reservaService.confirmarReserva(reserva, usuarioProfesional))
                .isInstanceOf(ReservaInvalidaException.class)
                .hasMessageContaining("pendientes");
    }

    // ── cancelarReserva ───────────────────────────────────────────────────────

    @Test
    void cancelarReserva_pendiente_cambiaEstado() {
        when(reservaRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Reserva resultado = reservaService.cancelarReserva(reserva);

        assertThat(resultado.getEstado()).isEqualTo(EstadoReserva.CANCELADA);
    }

    @Test
    void cancelarReserva_completada_lanzaExcepcion() {
        reserva.setEstado(EstadoReserva.COMPLETADA);

        assertThatThrownBy(() -> reservaService.cancelarReserva(reserva))
                .isInstanceOf(ReservaInvalidaException.class)
                .hasMessageContaining("completada");
    }

    // ── Helper para setear ID vía reflexión (no hay setter en entidades JPA) ──

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
