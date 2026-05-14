package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.Pago;
import com.jobfree.model.enums.EstadoPago;

public interface PagoRepository extends JpaRepository<Pago, Long> {

	Optional<Pago> findByReservaId(Long reservaId);

	List<Pago> findByReservaClienteIdAndEstadoInOrderByFechaPagoDesc(Long clienteId, List<EstadoPago> estados);

	List<Pago> findByReservaServicioProfesionalUsuarioIdAndEstadoInOrderByFechaPagoDesc(Long profesionalUsuarioId, List<EstadoPago> estados);
}
