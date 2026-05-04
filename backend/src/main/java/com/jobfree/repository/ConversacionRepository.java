package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jobfree.model.entity.Conversacion;

public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {

    Optional<Conversacion> findByReservaId(Long reservaId);

    Optional<Conversacion> findByContactoClave(String contactoClave);

    Optional<Conversacion> findFirstByClienteIdAndProfesionalIdOrderByFechaCreacionDesc(Long clienteId, Long profesionalId);

    @Query("""
            SELECT c FROM Conversacion c
            JOIN FETCH c.cliente
            JOIN FETCH c.profesional
            WHERE c.cliente.id = :clienteId OR c.profesional.id = :profesionalId
            ORDER BY COALESCE(c.ultimoMensajeFecha, c.fechaCreacion) DESC
            """)
    List<Conversacion> findByClienteIdOrProfesionalIdOrderByFechaCreacionDesc(
            @Param("clienteId") Long clienteId,
            @Param("profesionalId") Long profesionalId);

    // Devuelve los IDs de las conversaciones más recientes del usuario (paginado, sin JOIN FETCH para evitar
    // la paginación en memoria de Hibernate). Usar junto a findByIdsWithParticipantes.
    @Query("""
            SELECT c.id FROM Conversacion c
            WHERE c.cliente.id = :usuarioId OR c.profesional.id = :usuarioId
            ORDER BY
                CASE
                    WHEN c.cliente.id = :usuarioId AND c.fijadaCliente = TRUE THEN 1
                    WHEN c.profesional.id = :usuarioId AND c.fijadaProfesional = TRUE THEN 1
                    ELSE 0
                END DESC,
                COALESCE(c.ultimoMensajeFecha, c.fechaCreacion) DESC
            """)
    List<Long> findTopIdsByParticipanteId(@Param("usuarioId") Long usuarioId, org.springframework.data.domain.Pageable pageable);

    @Query("""
            SELECT c FROM Conversacion c
            JOIN FETCH c.cliente
            JOIN FETCH c.profesional
            WHERE c.id IN :ids
            """)
    List<Conversacion> findByIdsWithParticipantes(@Param("ids") List<Long> ids);

    @Query("""
            SELECT c FROM Conversacion c
            JOIN FETCH c.cliente
            JOIN FETCH c.profesional
            WHERE c.id = :id
            """)
    Optional<Conversacion> findByIdWithParticipantes(@Param("id") Long id);

    @Query("SELECT c.id FROM Conversacion c WHERE c.cliente.id = :usuarioId OR c.profesional.id = :usuarioId")
    List<Long> findIdsByParticipanteId(@Param("usuarioId") Long usuarioId);
}
