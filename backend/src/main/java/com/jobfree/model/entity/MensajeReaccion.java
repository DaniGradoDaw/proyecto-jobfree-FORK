package com.jobfree.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensaje_reaccion",
        uniqueConstraints = @UniqueConstraint(name = "uk_msg_user_emoji",
                columnNames = {"mensaje_id", "usuario_id", "emoji"}))
public class MensajeReaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mensaje_id", nullable = false)
    private Mensaje mensaje;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 10)
    private String emoji;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public MensajeReaccion() {}

    public MensajeReaccion(Mensaje mensaje, Usuario usuario, String emoji) {
        this.mensaje = mensaje;
        this.usuario = usuario;
        this.emoji = emoji;
    }

    public Long getId() { return id; }
    public Mensaje getMensaje() { return mensaje; }
    public Usuario getUsuario() { return usuario; }
    public String getEmoji() { return emoji; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
}
