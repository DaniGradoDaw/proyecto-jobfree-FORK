package com.jobfree.dto.monedero;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MovimientoMonederoDTO {
    private Long id;
    private String tipo;
    private String concepto;
    private BigDecimal importe;
    private LocalDateTime fecha;

    public MovimientoMonederoDTO() {}

    public MovimientoMonederoDTO(Long id, String tipo, String concepto, BigDecimal importe, LocalDateTime fecha) {
        this.id = id;
        this.tipo = tipo;
        this.concepto = concepto;
        this.importe = importe;
        this.fecha = fecha;
    }

    public Long getId() { return id; }
    public String getTipo() { return tipo; }
    public String getConcepto() { return concepto; }
    public BigDecimal getImporte() { return importe; }
    public LocalDateTime getFecha() { return fecha; }
}
