ALTER TABLE mensaje ADD COLUMN mensaje_respondido_id BIGINT NULL;
ALTER TABLE mensaje ADD CONSTRAINT fk_mensaje_respondido FOREIGN KEY (mensaje_respondido_id) REFERENCES mensaje(id) ON DELETE SET NULL;
