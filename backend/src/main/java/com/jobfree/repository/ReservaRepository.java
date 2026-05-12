package com.jobfree.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.ServicioOfrecido;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    boolean existsByServicioAndFechaInicio(ServicioOfrecido servicio, LocalDateTime fechaInicio);

    @Query("""
            SELECT r FROM Reserva r
            JOIN FETCH r.servicio s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario
            JOIN FETCH r.cliente
            LEFT JOIN FETCH r.pago
            ORDER BY r.fechaCreacion DESC
            """)
    List<Reserva> findAllWithDetails();

    @Query("""
            SELECT r FROM Reserva r
            JOIN FETCH r.servicio s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario
            JOIN FETCH r.cliente
            LEFT JOIN FETCH r.pago
            WHERE r.cliente.id = :clienteId
            ORDER BY r.fechaCreacion DESC
            """)
    List<Reserva> findByClienteIdOrderByFechaCreacionDesc(@Param("clienteId") Long clienteId);

    @Query("""
            SELECT r FROM Reserva r
            JOIN FETCH r.servicio s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario pu
            JOIN FETCH r.cliente
            LEFT JOIN FETCH r.pago
            WHERE pu.id = :usuarioId
            ORDER BY r.fechaCreacion DESC
            """)
    List<Reserva> findByServicioProfesionalUsuarioIdOrderByFechaCreacionDesc(@Param("usuarioId") Long usuarioId);

    @Query("""
            SELECT r FROM Reserva r
            JOIN FETCH r.servicio s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario
            JOIN FETCH r.cliente
            LEFT JOIN FETCH r.pago
            WHERE s.id = :servicioId
            """)
    List<Reserva> findByServicioId(@Param("servicioId") Long servicioId);

    @Query("""
            SELECT r FROM Reserva r
            JOIN FETCH r.servicio s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario
            JOIN FETCH r.cliente
            LEFT JOIN FETCH r.pago
            WHERE r.id = :id
            """)
    Optional<Reserva> findByIdWithDetails(@Param("id") Long id);
}
