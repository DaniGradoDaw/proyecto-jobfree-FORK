CREATE TABLE monedero (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    saldo DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_monedero_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE movimiento_monedero (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    monedero_id BIGINT NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    concepto VARCHAR(255) NOT NULL,
    importe DECIMAL(10, 2) NOT NULL,
    fecha DATETIME NOT NULL,
    CONSTRAINT fk_movimiento_monedero FOREIGN KEY (monedero_id) REFERENCES monedero(id)
);
