package com.jobfree.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jobfree.exception.pago.PagoInvalidoException;
import com.jobfree.exception.pago.PagoNotFoundException;
import com.jobfree.model.entity.Pago;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.EstadoPago;
import com.jobfree.model.enums.MetodoPago;
import com.jobfree.model.enums.Rol;
import com.jobfree.repository.PagoRepository;

@ExtendWith(MockitoExtension.class)
class PagoServiceTest {

    @Mock PagoRepository pagoRepository;
    @Mock NotificacionService notificacionService;

    @InjectMocks PagoService pagoService;

    private Pago pago;
    private Reserva reserva;
    private Usuario cliente;
    private Usuario usuarioProfesional;

    @BeforeEach
    void setUp() {
        cliente = new Usuario();
        setId(cliente, 1L);
        cliente.setRol(Rol.CLIENTE);

        usuarioProfesional = new Usuario();
        setId(usuarioProfesional, 2L);
        usuarioProfesional.setRol(Rol.PROFESIONAL);

        ProfesionalInfo profesional = new ProfesionalInfo();
        setId(profesional, 10L);
        profesional.setUsuario(usuarioProfesional);

        ServicioOfrecido servicio = new ServicioOfrecido();
        setId(servicio, 100L);
        servicio.setProfesional(profesional);

        reserva = new Reserva();
        setId(reserva, 50L);
        reserva.setCliente(cliente);
        reserva.setServicio(servicio);

        pago = new Pago(new BigDecimal("50.00"), MetodoPago.TARJETA, reserva);
        setId(pago, 99L);
        pago.setEstado(EstadoPago.PENDIENTE);
    }

    // ── obtenerPorId ──────────────────────────────────────────────────────────

    @Test
    void obtenerPorId_existente_retorna() {
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));

        Pago resultado = pagoService.obtenerPorId(99L);

        assertThat(resultado).isEqualTo(pago);
    }

    @Test
    void obtenerPorId_inexistente_lanzaPagoNotFoundException() {
        when(pagoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> pagoService.obtenerPorId(99L))
                .isInstanceOf(PagoNotFoundException.class);
    }

    // ── guardarPago ───────────────────────────────────────────────────────────

    @Test
    void guardarPago_valido_guardaEnPendiente() {
        when(pagoRepository.findByReservaId(50L)).thenReturn(Optional.empty());
        when(pagoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Pago resultado = pagoService.guardarPago(pago, cliente);

        assertThat(resultado.getEstado()).isEqualTo(EstadoPago.PENDIENTE);
        verify(pagoRepository).save(pago);
    }

    @Test
    void guardarPago_sinReserva_lanzaExcepcion() {
        pago.setReserva(null);

        assertThatThrownBy(() -> pagoService.guardarPago(pago, cliente))
                .isInstanceOf(PagoInvalidoException.class)
                .hasMessageContaining("reserva");
    }

    @Test
    void guardarPago_importeCero_lanzaExcepcion() {
        pago.setImporte(BigDecimal.ZERO);

        assertThatThrownBy(() -> pagoService.guardarPago(pago, cliente))
                .isInstanceOf(PagoInvalidoException.class)
                .hasMessageContaining("importe");
    }

    @Test
    void guardarPago_duplicado_lanzaExcepcion() {
        when(pagoRepository.findByReservaId(50L)).thenReturn(Optional.of(pago));

        assertThatThrownBy(() -> pagoService.guardarPago(pago, cliente))
                .isInstanceOf(PagoInvalidoException.class)
                .hasMessageContaining("ya tiene");
    }

    @Test
    void guardarPago_usuarioNoCliente_lanzaExcepcion() {
        assertThatThrownBy(() -> pagoService.guardarPago(pago, usuarioProfesional))
                .isInstanceOf(PagoInvalidoException.class)
                .hasMessageContaining("cliente");
    }

    // ── confirmarPago ─────────────────────────────────────────────────────────

    @Test
    void confirmarPago_pendiente_cambiaAPagado() {
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));
        when(pagoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Pago resultado = pagoService.confirmarPagoManualAdmin(99L);

        assertThat(resultado.getEstado()).isEqualTo(EstadoPago.PAGADO);
        verify(notificacionService).crear(anyString(), eq(usuarioProfesional));
    }

    @Test
    void confirmarPago_yaPagado_lanzaExcepcion() {
        pago.setEstado(EstadoPago.PAGADO);
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));

        assertThatThrownBy(() -> pagoService.confirmarPagoManualAdmin(99L))
                .isInstanceOf(PagoInvalidoException.class)
                .hasMessageContaining("ya ha sido");
    }

    @Test
    void confirmarPago_reembolsado_lanzaExcepcion() {
        pago.setEstado(EstadoPago.REEMBOLSADO);
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));

        assertThatThrownBy(() -> pagoService.confirmarPagoManualAdmin(99L))
                .isInstanceOf(PagoInvalidoException.class)
                .hasMessageContaining("reembolsado");
    }

    // ── actualizarEstado (transiciones válidas) ───────────────────────────────

    @Test
    void actualizarEstado_pendienteAPagado_correcto() {
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));
        when(pagoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Pago resultado = pagoService.actualizarEstado(99L, EstadoPago.PAGADO);

        assertThat(resultado.getEstado()).isEqualTo(EstadoPago.PAGADO);
    }

    @Test
    void actualizarEstado_pagadoAReembolsado_correcto() {
        pago.setEstado(EstadoPago.PAGADO);
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));
        when(pagoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Pago resultado = pagoService.actualizarEstado(99L, EstadoPago.REEMBOLSADO);

        assertThat(resultado.getEstado()).isEqualTo(EstadoPago.REEMBOLSADO);
    }

    @Test
    void actualizarEstado_pagadoAPendiente_invalido_lanzaExcepcion() {
        pago.setEstado(EstadoPago.PAGADO);
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));

        assertThatThrownBy(() -> pagoService.actualizarEstado(99L, EstadoPago.PENDIENTE))
                .isInstanceOf(PagoInvalidoException.class)
                .hasMessageContaining("Transición inválida");
    }

    @Test
    void actualizarEstado_reembolsadoACualquiera_invalido_lanzaExcepcion() {
        pago.setEstado(EstadoPago.REEMBOLSADO);
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));

        assertThatThrownBy(() -> pagoService.actualizarEstado(99L, EstadoPago.PAGADO))
                .isInstanceOf(PagoInvalidoException.class)
                .hasMessageContaining("Transición inválida");
    }

    // ── obtenerPorReserva ─────────────────────────────────────────────────────

    @Test
    void obtenerPorReserva_clienteAutorizado_retorna() {
        when(pagoRepository.findByReservaId(50L)).thenReturn(Optional.of(pago));

        Pago resultado = pagoService.obtenerPorReserva(50L, cliente);

        assertThat(resultado).isEqualTo(pago);
    }

    @Test
    void obtenerPorReserva_usuarioSinAcceso_lanzaExcepcion() {
        Usuario extraño = new Usuario();
        setId(extraño, 999L);
        when(pagoRepository.findByReservaId(50L)).thenReturn(Optional.of(pago));

        assertThatThrownBy(() -> pagoService.obtenerPorReserva(50L, extraño))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("acceso");
    }

    @Test
    void obtenerPorIdSeguro_participante_retorna() {
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));

        Pago resultado = pagoService.obtenerPorIdSeguro(99L, usuarioProfesional);

        assertThat(resultado).isEqualTo(pago);
    }

    @Test
    void obtenerPorIdSeguro_usuarioSinAcceso_lanzaExcepcion() {
        Usuario extraño = new Usuario();
        setId(extraño, 999L);
        extraño.setRol(Rol.CLIENTE);
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));

        assertThatThrownBy(() -> pagoService.obtenerPorIdSeguro(99L, extraño))
                .isInstanceOf(PagoInvalidoException.class)
                .hasMessageContaining("acceso");
    }

    @Test
    void obtenerParaPaymentIntent_clientePendienteTarjeta_retorna() {
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));

        Pago resultado = pagoService.obtenerParaPaymentIntent(99L, cliente);

        assertThat(resultado).isEqualTo(pago);
    }

    @Test
    void obtenerParaPaymentIntent_profesional_lanzaExcepcion() {
        when(pagoRepository.findById(99L)).thenReturn(Optional.of(pago));

        assertThatThrownBy(() -> pagoService.obtenerParaPaymentIntent(99L, usuarioProfesional))
                .isInstanceOf(PagoInvalidoException.class)
                .hasMessageContaining("cliente");
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
