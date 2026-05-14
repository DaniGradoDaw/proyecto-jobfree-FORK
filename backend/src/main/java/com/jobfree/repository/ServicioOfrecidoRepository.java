package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jobfree.model.entity.ServicioOfrecido;

public interface ServicioOfrecidoRepository extends JpaRepository<ServicioOfrecido, Long> {

    // Servicios por subcategoría (paginado)
    Page<ServicioOfrecido> findBySubcategoriaId(Long subcategoriaId, Pageable pageable);

    // Servicios activos por subcategoría (paginado) — excluye profesionales suspendidos
    @Query("""
            SELECT s FROM ServicioOfrecido s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario u
            JOIN FETCH s.subcategoria
            WHERE s.subcategoria.id = :subcategoriaId
            AND s.activa = true
            AND u.activo = true
            """)
    Page<ServicioOfrecido> findBySubcategoriaIdAndActivaTrue(@Param("subcategoriaId") Long subcategoriaId, Pageable pageable);

    @Query("""
            SELECT s FROM ServicioOfrecido s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario u
            JOIN FETCH s.subcategoria sc
            JOIN FETCH sc.categoria
            WHERE sc.categoria.id = :categoriaId
            AND s.activa = true
            AND u.activo = true
            """)
    List<ServicioOfrecido> findBySubcategoriaCategoriaIdAndActivaTrue(@Param("categoriaId") Long categoriaId);

    List<ServicioOfrecido> findBySubcategoriaCategoriaId(Long categoriaId);

    @Query("""
            SELECT s FROM ServicioOfrecido s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario u
            JOIN FETCH s.subcategoria
            WHERE s.activa = true
            AND u.activo = true
            """)
    List<ServicioOfrecido> findByActivaTrue();

    @Query("""
            SELECT s FROM ServicioOfrecido s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario u
            JOIN FETCH s.subcategoria
            WHERE s.activa = true
            AND u.activo = true
            """)
    Page<ServicioOfrecido> findByActivaTrue(Pageable pageable);

    @Query("""
            SELECT s FROM ServicioOfrecido s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario
            JOIN FETCH s.subcategoria
            WHERE p.id = :profesionalId
            """)
    List<ServicioOfrecido> findByProfesionalId(@Param("profesionalId") Long profesionalId);

    @Query("""
            SELECT s FROM ServicioOfrecido s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario u
            JOIN FETCH s.subcategoria
            WHERE u.id = :usuarioId AND s.activa = true
            """)
    List<ServicioOfrecido> findByProfesionalUsuarioIdAndActivaTrue(@Param("usuarioId") Long usuarioId);

    @Query("""
            SELECT s FROM ServicioOfrecido s
            JOIN FETCH s.profesional p
            JOIN FETCH p.usuario u
            JOIN FETCH s.subcategoria sc
            JOIN FETCH sc.categoria
            WHERE s.id = :id
            AND u.activo = true
            """)
    Optional<ServicioOfrecido> findByIdWithDetails(@Param("id") Long id);
}
