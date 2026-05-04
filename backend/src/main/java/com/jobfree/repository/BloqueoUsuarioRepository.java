package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.BloqueoUsuario;

public interface BloqueoUsuarioRepository extends JpaRepository<BloqueoUsuario, Long> {

    boolean existsByBloqueadorIdAndBloqueadoId(Long bloqueadorId, Long bloqueadoId);

    Optional<BloqueoUsuario> findByBloqueadorIdAndBloqueadoId(Long bloqueadorId, Long bloqueadoId);

    List<BloqueoUsuario> findByBloqueadorId(Long bloqueadorId);
}
