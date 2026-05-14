package com.jobfree.model.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "monedero")
public class Monedero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true,
                foreignKey = @ForeignKey(name = "fk_monedero_usuario"))
    private Usuario usuario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal saldo = BigDecimal.ZERO;

    @Column(length = 34)
    private String iban;

    @Column(length = 100)
    private String titular;

    @OneToMany(mappedBy = "monedero", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MovimientoMonedero> movimientos = new ArrayList<>();

    public Monedero() {}

    public Monedero(Usuario usuario) {
        this.usuario = usuario;
        this.saldo = BigDecimal.ZERO;
    }

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public BigDecimal getSaldo() { return saldo; }
    public void setSaldo(BigDecimal saldo) { this.saldo = saldo; }
    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }
    public String getTitular() { return titular; }
    public void setTitular(String titular) { this.titular = titular; }
    public List<MovimientoMonedero> getMovimientos() { return movimientos; }
}
