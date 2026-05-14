CREATE TABLE reporte (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    reportador_id   BIGINT NOT NULL,
    reportado_id    BIGINT NOT NULL,
    mensajes_json   TEXT,
    resuelto        TINYINT(1) NOT NULL DEFAULT 0,
    fecha           DATETIME NOT NULL,
    CONSTRAINT fk_reporte_reportador FOREIGN KEY (reportador_id) REFERENCES usuario(id),
    CONSTRAINT fk_reporte_reportado  FOREIGN KEY (reportado_id)  REFERENCES usuario(id)
);
