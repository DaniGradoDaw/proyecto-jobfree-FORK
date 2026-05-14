package com.jobfree.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "reporte")
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reportador_id", nullable = false, foreignKey = @ForeignKey(name = "fk_reporte_reportador"))
    private Usuario reportador;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reportado_id", nullable = false, foreignKey = @ForeignKey(name = "fk_reporte_reportado"))
    private Usuario reportado;

    // Snapshot JSON de los últimos mensajes del reportado
    @Column(name = "mensajes_json", length = 10000)
    private String mensajesJson;

    @Column(nullable = false)
    private boolean resuelto = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fecha;

    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
    }

    public Reporte() {}

    public Reporte(Usuario reportador, Usuario reportado, String mensajesJson) {
        this.reportador = reportador;
        this.reportado = reportado;
        this.mensajesJson = mensajesJson;
    }

    public Long getId() { return id; }
    public Usuario getReportador() { return reportador; }
    public Usuario getReportado() { return reportado; }
    public String getMensajesJson() { return mensajesJson; }
    public boolean isResuelto() { return resuelto; }
    public void setResuelto(boolean resuelto) { this.resuelto = resuelto; }
    public LocalDateTime getFecha() { return fecha; }
}
