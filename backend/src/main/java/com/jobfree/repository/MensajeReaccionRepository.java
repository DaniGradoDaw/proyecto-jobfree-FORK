package com.jobfree.repository;

import com.jobfree.model.entity.MensajeReaccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MensajeReaccionRepository extends JpaRepository<MensajeReaccion, Long> {

    Optional<MensajeReaccion> findByMensajeIdAndUsuarioIdAndEmoji(Long mensajeId, Long usuarioId, String emoji);

    Optional<MensajeReaccion> findByMensajeIdAndUsuarioId(Long mensajeId, Long usuarioId);

    List<MensajeReaccion> findByMensajeIdOrderByFechaCreacionAsc(Long mensajeId);
}
