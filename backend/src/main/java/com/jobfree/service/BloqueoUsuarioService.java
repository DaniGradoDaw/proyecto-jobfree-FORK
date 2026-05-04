package com.jobfree.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.jobfree.exception.usuario.UsuarioNotFoundException;
import com.jobfree.model.entity.BloqueoUsuario;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.BloqueoUsuarioRepository;
import com.jobfree.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class BloqueoUsuarioService {

    private final BloqueoUsuarioRepository bloqueoRepository;
    private final UsuarioRepository usuarioRepository;

    public BloqueoUsuarioService(BloqueoUsuarioRepository bloqueoRepository, UsuarioRepository usuarioRepository) {
        this.bloqueoRepository = bloqueoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public void bloquear(Long bloqueadorId, Long bloqueadoId, String motivo) {
        if (bloqueadorId.equals(bloqueadoId)) {
            throw new IllegalArgumentException("No puedes bloquearte a ti mismo");
        }
        Usuario bloqueado = usuarioRepository.findById(bloqueadoId)
                .orElseThrow(() -> new UsuarioNotFoundException(bloqueadoId));
        Usuario bloqueador = usuarioRepository.findById(bloqueadorId)
                .orElseThrow(() -> new UsuarioNotFoundException(bloqueadorId));

        if (!bloqueoRepository.existsByBloqueadorIdAndBloqueadoId(bloqueadorId, bloqueadoId)) {
            try {
                String motivoTruncado = (motivo != null && motivo.length() > 500)
                        ? motivo.substring(0, 500) : motivo;
                bloqueoRepository.save(new BloqueoUsuario(bloqueador, bloqueado, motivoTruncado));
            } catch (DataIntegrityViolationException ignored) {
                // ya existía — carrera concurrente, ignorar
            }
        }
    }

    public void desbloquear(Long bloqueadorId, Long bloqueadoId) {
        bloqueoRepository.findByBloqueadorIdAndBloqueadoId(bloqueadorId, bloqueadoId)
                .ifPresent(bloqueoRepository::delete);
    }

    public boolean estaBloqueado(Long bloqueadorId, Long bloqueadoId) {
        return bloqueoRepository.existsByBloqueadorIdAndBloqueadoId(bloqueadorId, bloqueadoId);
    }

    /** Devuelve true si cualquiera de los dos bloqueó al otro. */
    public boolean hayBloqueoMutuo(Long usuarioAId, Long usuarioBId) {
        return bloqueoRepository.existsByBloqueadorIdAndBloqueadoId(usuarioAId, usuarioBId)
                || bloqueoRepository.existsByBloqueadorIdAndBloqueadoId(usuarioBId, usuarioAId);
    }

    public List<BloqueoUsuario> listarBloqueados(Long bloqueadorId) {
        return bloqueoRepository.findByBloqueadorId(bloqueadorId);
    }
}
