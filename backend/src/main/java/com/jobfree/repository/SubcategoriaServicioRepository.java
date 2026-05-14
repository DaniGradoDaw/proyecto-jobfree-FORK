package com.jobfree.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.jobfree.model.entity.SubcategoriaServicio;

public interface SubcategoriaServicioRepository extends JpaRepository<SubcategoriaServicio, Long> {

    Page<SubcategoriaServicio> findByCategoria_Id(Long categoriaId, Pageable pageable);

    boolean existsByNombreAndCategoria_Id(String nombre, Long categoriaId);

    @Query("""
        SELECT sc FROM SubcategoriaServicio sc
        LEFT JOIN ServicioOfrecido so ON so.subcategoria.id = sc.id
        LEFT JOIN Reserva r ON r.servicio.id = so.id
        GROUP BY sc.id
        HAVING COUNT(r.id) > 0
        ORDER BY COUNT(r.id) DESC
        """)
    List<SubcategoriaServicio> findTopPopulares(Pageable pageable);
}
