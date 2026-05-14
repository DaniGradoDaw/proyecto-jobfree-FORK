package com.jobfree.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.Reporte;

public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    List<Reporte> findAllByOrderByFechaDesc();
}
