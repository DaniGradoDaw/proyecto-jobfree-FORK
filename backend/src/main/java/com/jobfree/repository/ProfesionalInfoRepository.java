package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.ProfesionalInfo;

public interface ProfesionalInfoRepository extends JpaRepository<ProfesionalInfo, Long> {

	// Busca el perfil profesional de un usuario
	Optional<ProfesionalInfo> findByUsuarioId(Long usuarioId);

	// Comprueba si ya existe un CIF en la base de datos
	boolean existsByCif(String cif);

	// Todos los perfiles paginados
	Page<ProfesionalInfo> findAll(Pageable pageable);

	// Reduce el conjunto candidato para búsquedas por proximidad
	List<ProfesionalInfo> findByLatitudBetweenAndLongitudBetween(
			Double latitudMin, Double latitudMax,
			Double longitudMin, Double longitudMax);

	Optional<ProfesionalInfo> findByStripeCustomerId(String stripeCustomerId);

	Optional<ProfesionalInfo> findByStripeSubscriptionId(String stripeSubscriptionId);
}
