-- Eliminar la tabla antigua (solo nombres de ciudad, nunca se usó en búsquedas)
DROP TABLE IF EXISTS profesional_ciudad_servicio;

-- Nueva tabla con nombre + coordenadas reales
CREATE TABLE IF NOT EXISTS profesional_zona_servicio (
    profesional_id BIGINT       NOT NULL,
    nombre         VARCHAR(100),
    latitud        DOUBLE,
    longitud       DOUBLE,
    CONSTRAINT fk_zona_profesional
        FOREIGN KEY (profesional_id) REFERENCES profesional_info(id)
        ON DELETE CASCADE
);
