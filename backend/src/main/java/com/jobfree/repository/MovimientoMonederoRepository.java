package com.jobfree.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jobfree.model.entity.MovimientoMonedero;

@Repository
public interface MovimientoMonederoRepository extends JpaRepository<MovimientoMonedero, Long> {
    List<MovimientoMonedero> findByMonederoUsuarioIdOrderByFechaDesc(Long usuarioId);
}
