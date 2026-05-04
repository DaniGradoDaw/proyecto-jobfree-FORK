package com.jobfree.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.jobfree.exception.resena.ResenaInvalidaException;
import com.jobfree.exception.resena.ResenaNotFoundException;
import com.jobfree.model.entity.ResenaProfesional;
import com.jobfree.model.enums.EstadoReserva;
import com.jobfree.repository.ResenaProfesionalRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ResenaProfesionalService {

    private static final Logger log = LoggerFactory.getLogger(ResenaProfesionalService.class);

    private final ResenaProfesionalRepository resenaRepository;

    public ResenaProfesionalService(ResenaProfesionalRepository resenaRepository) {
        this.resenaRepository = resenaRepository;
    }

    public ResenaProfesional obtenerPorId(Long id) {
        return resenaRepository.findById(id)
                .orElseThrow(() -> new ResenaNotFoundException(id));
    }

    public List<ResenaProfesional> listarPorProfesional(Long profesionalId) {
        return resenaRepository.findByProfesionalIdOrderByFechaCreacionDesc(profesionalId);
    }

    public List<ResenaProfesional> listarPorCliente(Long clienteId) {
        return resenaRepository.findByClienteIdOrderByFechaCreacionDesc(clienteId);
    }

    public double obtenerMediaProfesional(Long profesionalId) {
        Double media = resenaRepository.obtenerMediaPorProfesional(profesionalId);
        return media != null ? media : 0.0;
    }

    public long contarPorProfesional(Long profesionalId) {
        Long total = resenaRepository.contarPorProfesional(profesionalId);
        return total != null ? total : 0L;
    }

    public ResenaProfesional crear(ResenaProfesional resena) {
        validar(resena);

        Long clienteId     = resena.getCliente().getId();
        Long profesionalId = resena.getProfesional().getId();

        // Con reserva: solo una reseña por reserva
        if (resena.getReserva() != null) {
            Long reservaId = resena.getReserva().getId();
            if (resenaRepository.existsByClienteIdAndProfesionalIdAndReservaId(clienteId, profesionalId, reservaId)) {
                throw new ResenaInvalidaException("Ya has dejado una reseña para esta reserva");
            }
        } else {
            // Sin reserva: solo una reseña libre por profesional
            if (resenaRepository.existsByClienteIdAndProfesionalId(clienteId, profesionalId)) {
                throw new ResenaInvalidaException("Ya has dejado una reseña a este profesional");
            }
        }

        ResenaProfesional guardada = resenaRepository.save(resena);
        log.info("Reseña {} creada por cliente {} para profesional {}", guardada.getId(), clienteId, profesionalId);
        return guardada;
    }

    public void eliminar(Long id, Long clienteId) {
        ResenaProfesional resena = obtenerPorId(id);
        if (!resena.getCliente().getId().equals(clienteId)) {
            throw new ResenaInvalidaException("No tienes permiso para eliminar esta reseña");
        }
        resenaRepository.delete(resena);
        log.info("Reseña {} eliminada por cliente {}", id, clienteId);
    }

    private void validar(ResenaProfesional resena) {
        if (resena.getCliente() == null) {
            throw new ResenaInvalidaException("El cliente es obligatorio");
        }
        if (resena.getProfesional() == null) {
            throw new ResenaInvalidaException("El profesional es obligatorio");
        }
        if (resena.getCalificacion() == null || resena.getCalificacion() < 1 || resena.getCalificacion() > 5) {
            throw new ResenaInvalidaException("La calificación debe estar entre 1 y 5");
        }
        if (resena.getComentario() == null || resena.getComentario().isBlank()) {
            throw new ResenaInvalidaException("El comentario es obligatorio");
        }
        if (resena.getCliente().getId().equals(resena.getProfesional().getUsuario().getId())) {
            throw new ResenaInvalidaException("No puedes reseñarte a ti mismo");
        }
        if (resena.getReserva() != null) {
            validarReserva(resena);
        }
    }

    private void validarReserva(ResenaProfesional resena) {
        if (resena.getReserva().getEstado() != EstadoReserva.COMPLETADA) {
            throw new ResenaInvalidaException("Solo puedes reseñar reservas completadas");
        }
        if (!resena.getReserva().getCliente().getId().equals(resena.getCliente().getId())) {
            throw new ResenaInvalidaException("La reserva no pertenece al cliente autenticado");
        }
        if (!resena.getReserva().getServicio().getProfesional().getId().equals(resena.getProfesional().getId())) {
            throw new ResenaInvalidaException("La reserva no corresponde con este profesional");
        }
    }
}
