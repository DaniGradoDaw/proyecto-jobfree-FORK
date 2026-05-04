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
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "bloqueo_usuario", uniqueConstraints = {
    @UniqueConstraint(name = "uq_bloqueo", columnNames = { "bloqueador_id", "bloqueado_id" })
})
public class BloqueoUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bloqueador_id", nullable = false, foreignKey = @ForeignKey(name = "fk_bloqueo_bloqueador"))
    private Usuario bloqueador;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bloqueado_id", nullable = false, foreignKey = @ForeignKey(name = "fk_bloqueo_bloqueado"))
    private Usuario bloqueado;

    @Column(name = "fecha_bloqueo", nullable = false)
    private LocalDateTime fechaBloqueo;

    @Column(name = "motivo", length = 500)
    private String motivo;

    @PrePersist
    public void prePersist() {
        this.fechaBloqueo = LocalDateTime.now();
    }

    public BloqueoUsuario() {}

    public BloqueoUsuario(Usuario bloqueador, Usuario bloqueado, String motivo) {
        this.bloqueador = bloqueador;
        this.bloqueado = bloqueado;
        this.motivo = motivo;
    }

    public Long getId() { return id; }
    public Usuario getBloqueador() { return bloqueador; }
    public Usuario getBloqueado() { return bloqueado; }
    public LocalDateTime getFechaBloqueo() { return fechaBloqueo; }
    public String getMotivo() { return motivo; }
}
