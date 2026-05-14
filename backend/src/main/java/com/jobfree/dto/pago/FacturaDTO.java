package com.jobfree.dto.pago;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FacturaDTO {

    private Long id;
    private String numeroFactura;
    private BigDecimal importe;
    private String metodo;
    private String estado;
    private LocalDateTime fechaPago;
    private Long reservaId;
    private String servicioTitulo;
    private String profesionalNombre;
    private String clienteNombre;
    private String clienteEmail;
    private LocalDateTime fechaServicio;

    public FacturaDTO() {}

    public FacturaDTO(Long id, String numeroFactura, BigDecimal importe, String metodo, String estado,
                      LocalDateTime fechaPago, Long reservaId, String servicioTitulo,
                      String profesionalNombre, String clienteNombre, String clienteEmail,
                      LocalDateTime fechaServicio) {
        this.id = id;
        this.numeroFactura = numeroFactura;
        this.importe = importe;
        this.metodo = metodo;
        this.estado = estado;
        this.fechaPago = fechaPago;
        this.reservaId = reservaId;
        this.servicioTitulo = servicioTitulo;
        this.profesionalNombre = profesionalNombre;
        this.clienteNombre = clienteNombre;
        this.clienteEmail = clienteEmail;
        this.fechaServicio = fechaServicio;
    }

    public Long getId() { return id; }
    public String getNumeroFactura() { return numeroFactura; }
    public BigDecimal getImporte() { return importe; }
    public String getMetodo() { return metodo; }
    public String getEstado() { return estado; }
    public LocalDateTime getFechaPago() { return fechaPago; }
    public Long getReservaId() { return reservaId; }
    public String getServicioTitulo() { return servicioTitulo; }
    public String getProfesionalNombre() { return profesionalNombre; }
    public String getClienteNombre() { return clienteNombre; }
    public String getClienteEmail() { return clienteEmail; }
    public LocalDateTime getFechaServicio() { return fechaServicio; }
}
