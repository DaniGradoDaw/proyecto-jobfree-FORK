package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jobfree.model.entity.Mensaje;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    @Query("""
            SELECT m FROM Mensaje m
            JOIN FETCH m.remitente
            JOIN FETCH m.destinatario
            WHERE m.destinatario.id = :usuarioId
            """)
    List<Mensaje> findByDestinatarioId(@Param("usuarioId") Long usuarioId);

    @Query("""
            SELECT m FROM Mensaje m
            JOIN FETCH m.remitente
            JOIN FETCH m.destinatario
            WHERE m.remitente.id = :usuarioId
            """)
    List<Mensaje> findByRemitenteId(@Param("usuarioId") Long usuarioId);

    @Query("""
            SELECT m FROM Mensaje m
            JOIN FETCH m.remitente
            JOIN FETCH m.destinatario
            WHERE m.conversacion.id = :conversacionId
            ORDER BY m.fechaEnvio ASC
            """)
    List<Mensaje> findByConversacionIdOrderByFechaEnvioAsc(@Param("conversacionId") Long conversacionId);

    @Query("SELECT m FROM Mensaje m WHERE m.id IN :ids AND m.destinatario.id = :destinatarioId")
    List<Mensaje> findByIdInAndDestinatarioId(@Param("ids") List<Long> ids,
                                              @Param("destinatarioId") Long destinatarioId);

    Optional<Mensaje> findByConversacionIdAndRemitenteIdAndClientMessageId(Long conversacionId, Long remitenteId, String clientMessageId);

    Optional<Mensaje> findByIdAndConversacionId(Long id, Long conversacionId);

    long countByDestinatarioIdAndLeidoFalse(Long destinatarioId);

    @Query("""
            SELECT COUNT(m) FROM Mensaje m
            JOIN m.conversacion c
            WHERE m.destinatario.id = :usuarioId
            AND m.leido = false
            AND NOT (
                (c.cliente.id = :usuarioId AND c.silenciadaClienteHasta IS NOT NULL AND c.silenciadaClienteHasta > CURRENT_TIMESTAMP)
                OR
                (c.profesional.id = :usuarioId AND c.silenciadaProfesionalHasta IS NOT NULL AND c.silenciadaProfesionalHasta > CURRENT_TIMESTAMP)
            )
            """)
    long countNoLeidosExcluyendoSilenciados(@Param("usuarioId") Long usuarioId);

    @Query("SELECT COUNT(m) FROM Mensaje m WHERE m.conversacion.id = :conversacionId AND m.destinatario.id = :usuarioId AND m.leido = false")
    int countNoLeidosPorConversacion(@Param("conversacionId") Long conversacionId, @Param("usuarioId") Long usuarioId);

    @Query("SELECT m.conversacion.id, COUNT(m) FROM Mensaje m WHERE m.conversacion.id IN :conversacionIds AND m.destinatario.id = :usuarioId AND m.leido = false GROUP BY m.conversacion.id")
    List<Object[]> countNoLeidosPorConversaciones(@Param("conversacionIds") List<Long> conversacionIds, @Param("usuarioId") Long usuarioId);

    Optional<Mensaje> findFirstByConversacionIdOrderByFechaEnvioDesc(Long conversacionId);

    @Query("""
            SELECT m FROM Mensaje m
            JOIN FETCH m.remitente
            JOIN FETCH m.destinatario
            LEFT JOIN FETCH m.mensajeRespondido mr
            LEFT JOIN FETCH mr.remitente
            WHERE m.conversacion.id = :conversacionId
            ORDER BY m.id DESC
            """)
    List<Mensaje> findLatestByConversacionId(@Param("conversacionId") Long conversacionId, Pageable pageable);

    @Query("""
            SELECT m FROM Mensaje m
            JOIN FETCH m.remitente
            JOIN FETCH m.destinatario
            LEFT JOIN FETCH m.mensajeRespondido mr
            LEFT JOIN FETCH mr.remitente
            WHERE m.conversacion.id = :conversacionId AND m.id < :before
            ORDER BY m.id DESC
            """)
    List<Mensaje> findByConversacionIdBeforeDesc(@Param("conversacionId") Long conversacionId,
                                                 @Param("before") Long before,
                                                 Pageable pageable);
}
