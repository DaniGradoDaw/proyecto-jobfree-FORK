ALTER TABLE conversacion
    ADD COLUMN silenciada_cliente_hasta    DATETIME NULL,
    ADD COLUMN silenciada_profesional_hasta DATETIME NULL,
    ADD COLUMN fijada_cliente              TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN fijada_profesional          TINYINT(1) NOT NULL DEFAULT 0;
