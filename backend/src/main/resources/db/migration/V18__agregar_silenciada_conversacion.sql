ALTER TABLE conversacion
    ADD COLUMN silenciada_cliente    BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN silenciada_profesional BOOLEAN NOT NULL DEFAULT FALSE;
