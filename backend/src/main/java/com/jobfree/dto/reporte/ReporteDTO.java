package com.jobfree.dto.reporte;

import java.time.LocalDateTime;

public class ReporteDTO {
    private Long id;
    private Long reportadorId;
    private String reportadorNombre;
    private String reportadorFotoUrl;
    private Long reportadoId;
    private String reportadoNombre;
    private String reportadoFotoUrl;
    private String mensajesJson;
    private boolean resuelto;
    private LocalDateTime fecha;

    public ReporteDTO() {}

    public ReporteDTO(Long id, Long reportadorId, String reportadorNombre, String reportadorFotoUrl,
                      Long reportadoId, String reportadoNombre, String reportadoFotoUrl,
                      String mensajesJson, boolean resuelto, LocalDateTime fecha) {
        this.id = id;
        this.reportadorId = reportadorId;
        this.reportadorNombre = reportadorNombre;
        this.reportadorFotoUrl = reportadorFotoUrl;
        this.reportadoId = reportadoId;
        this.reportadoNombre = reportadoNombre;
        this.reportadoFotoUrl = reportadoFotoUrl;
        this.mensajesJson = mensajesJson;
        this.resuelto = resuelto;
        this.fecha = fecha;
    }

    public Long getId() { return id; }
    public Long getReportadorId() { return reportadorId; }
    public String getReportadorNombre() { return reportadorNombre; }
    public String getReportadorFotoUrl() { return reportadorFotoUrl; }
    public Long getReportadoId() { return reportadoId; }
    public String getReportadoNombre() { return reportadoNombre; }
    public String getReportadoFotoUrl() { return reportadoFotoUrl; }
    public String getMensajesJson() { return mensajesJson; }
    public boolean isResuelto() { return resuelto; }
    public LocalDateTime getFecha() { return fecha; }
}
