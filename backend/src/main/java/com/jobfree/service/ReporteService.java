package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Reporte;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.ReporteRepository;
import com.jobfree.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ReporteService {

    private final ReporteRepository reporteRepository;
    private final UsuarioRepository usuarioRepository;

    public ReporteService(ReporteRepository reporteRepository, UsuarioRepository usuarioRepository) {
        this.reporteRepository = reporteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Reporte crearReporte(Long reportadoId, String mensajesJson, Long reportadorId) {
        Usuario reportador = usuarioRepository.findById(reportadorId)
                .orElseThrow(() -> new RuntimeException("Reportador no encontrado"));
        Usuario reportado = usuarioRepository.findById(reportadoId)
                .orElseThrow(() -> new RuntimeException("Usuario reportado no encontrado"));
        return reporteRepository.save(new Reporte(reportador, reportado, mensajesJson));
    }

    public List<Reporte> listarTodos() {
        return reporteRepository.findAllByOrderByFechaDesc();
    }

    public Reporte resolver(Long id) {
        Reporte reporte = reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
        reporte.setResuelto(true);
        return reporteRepository.save(reporte);
    }

    public void eliminar(Long id) {
        reporteRepository.deleteById(id);
    }
}
