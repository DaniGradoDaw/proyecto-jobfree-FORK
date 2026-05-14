package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jobfree.model.entity.ProfesionalInfo;

public interface ProfesionalInfoRepository extends JpaRepository<ProfesionalInfo, Long> {

	Optional<ProfesionalInfo> findByUsuarioId(Long usuarioId);

	boolean existsByCif(String cif);

	Page<ProfesionalInfo> findAll(Pageable pageable);

	/**
	 * Candidatos para búsqueda por proximidad: profesionales cuya ubicación principal
	 * O alguna de sus zonas de servicio cae dentro del bounding box dado.
	 */
	@Query("SELECT DISTINCT p FROM ProfesionalInfo p LEFT JOIN p.zonasServicio z " +
	       "WHERE (p.latitud BETWEEN :latMin AND :latMax AND p.longitud BETWEEN :lngMin AND :lngMax) " +
	       "OR (z.latitud IS NOT NULL AND z.latitud BETWEEN :latMin AND :latMax " +
	       "    AND z.longitud IS NOT NULL AND z.longitud BETWEEN :lngMin AND :lngMax)")
	List<ProfesionalInfo> findCercanosConZonas(
			@Param("latMin") Double latMin, @Param("latMax") Double latMax,
			@Param("lngMin") Double lngMin, @Param("lngMax") Double lngMax);

	Optional<ProfesionalInfo> findByStripeCustomerId(String stripeCustomerId);

	Optional<ProfesionalInfo> findByStripeSubscriptionId(String stripeSubscriptionId);
}
