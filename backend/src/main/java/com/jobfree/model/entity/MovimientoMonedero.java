package com.jobfree.model.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.jobfree.model.enums.TipoMovimiento;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "movimiento_monedero")
public class MovimientoMonedero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "monedero_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_movimiento_monedero"))
    private Monedero monedero;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimiento tipo;

    @Column(nullable = false, length = 255)
    private String concepto;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal importe;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fecha;

    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
    }

    public MovimientoMonedero() {}

    public MovimientoMonedero(Monedero monedero, TipoMovimiento tipo, String concepto, BigDecimal importe) {
        this.monedero = monedero;
        this.tipo = tipo;
        this.concepto = concepto;
        this.importe = importe;
    }

    public Long getId() { return id; }
    public Monedero getMonedero() { return monedero; }
    public TipoMovimiento getTipo() { return tipo; }
    public String getConcepto() { return concepto; }
    public BigDecimal getImporte() { return importe; }
    public LocalDateTime getFecha() { return fecha; }
}
