package com.jobfree.dto.reporte;

public class ReporteCreateDTO {
    private Long reportadoId;
    private String mensajesJson;

    public Long getReportadoId() { return reportadoId; }
    public void setReportadoId(Long reportadoId) { this.reportadoId = reportadoId; }
    public String getMensajesJson() { return mensajesJson; }
    public void setMensajesJson(String mensajesJson) { this.mensajesJson = mensajesJson; }
}
