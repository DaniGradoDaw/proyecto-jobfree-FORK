CREATE TABLE mensaje_reaccion (
    id             BIGINT      NOT NULL AUTO_INCREMENT,
    mensaje_id     BIGINT      NOT NULL,
    usuario_id     BIGINT      NOT NULL,
    emoji          VARCHAR(10) NOT NULL,
    fecha_creacion DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_msg_user_emoji (mensaje_id, usuario_id, emoji),
    CONSTRAINT fk_reaccion_mensaje FOREIGN KEY (mensaje_id) REFERENCES mensaje (id) ON DELETE CASCADE,
    CONSTRAINT fk_reaccion_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
