CREATE TABLE profesional_ciudad_servicio (
    profesional_id BIGINT NOT NULL,
    ciudad         VARCHAR(100) NOT NULL,
    CONSTRAINT fk_pcs_profesional FOREIGN KEY (profesional_id)
        REFERENCES profesional_info(id) ON DELETE CASCADE
);
