CREATE TABLE bloqueo_usuario (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    bloqueador_id BIGINT       NOT NULL,
    bloqueado_id  BIGINT       NOT NULL,
    fecha_bloqueo DATETIME     NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_bloqueo (bloqueador_id, bloqueado_id),
    CONSTRAINT fk_bloqueo_bloqueador FOREIGN KEY (bloqueador_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_bloqueo_bloqueado  FOREIGN KEY (bloqueado_id)  REFERENCES usuario(id) ON DELETE CASCADE
);
