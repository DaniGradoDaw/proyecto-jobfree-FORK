-- schema-prod.sql — crea el esquema completo en MySQL 9.4 (idempotente con IF NOT EXISTS)

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'CLIENTE',
    direccion VARCHAR(150),
    ciudad VARCHAR(100),
    foto_url VARCHAR(255),
    ultima_conexion DATETIME(6),
    activo TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuario_email (email),
    UNIQUE KEY uk_usuario_telefono (telefono)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS categoria_servicio (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_categoria_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS subcategoria_servicio (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(300),
    imagen VARCHAR(200),
    categoria_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_subcategoria_categoria FOREIGN KEY (categoria_id) REFERENCES categoria_servicio (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS profesional_info (
    id BIGINT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(500) NOT NULL,
    experiencia INT NOT NULL,
    nombre_empresa VARCHAR(100),
    cif VARCHAR(20),
    plan VARCHAR(20) NOT NULL,
    codigo_postal VARCHAR(10),
    latitud DOUBLE,
    longitud DOUBLE,
    ubicacion_manual TINYINT NOT NULL DEFAULT 0,
    valoracion_media DOUBLE NOT NULL DEFAULT 0.0,
    numero_valoraciones INT NOT NULL DEFAULT 0,
    usuario_id BIGINT NOT NULL,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE KEY uk_profesional_cif (cif),
    UNIQUE KEY uk_profesional_usuario (usuario_id),
    CONSTRAINT fk_profesional_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS profesional_zona_servicio (
    profesional_id BIGINT NOT NULL,
    nombre VARCHAR(100),
    latitud DOUBLE,
    longitud DOUBLE,
    CONSTRAINT fk_zona_profesional FOREIGN KEY (profesional_id) REFERENCES profesional_info (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS servicio_ofrecido (
    id BIGINT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    duracion_min INT NOT NULL,
    precio_hora DECIMAL(10,2) NOT NULL,
    activa TINYINT NOT NULL DEFAULT 1,
    profesional_id BIGINT NOT NULL,
    subcategoria_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_servicio_profesional FOREIGN KEY (profesional_id) REFERENCES profesional_info (id),
    CONSTRAINT fk_servicio_subcategoria FOREIGN KEY (subcategoria_id) REFERENCES subcategoria_servicio (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS reserva (
    id BIGINT NOT NULL AUTO_INCREMENT,
    fecha_inicio DATETIME(6) NOT NULL,
    descripcion VARCHAR(1000),
    precio_total DECIMAL(10,2) NOT NULL,
    fecha_creacion DATETIME(6) NOT NULL,
    progreso INT NOT NULL DEFAULT 0,
    notas_progreso VARCHAR(500),
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    cliente_id BIGINT NOT NULL,
    servicio_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_reserva_cliente FOREIGN KEY (cliente_id) REFERENCES usuario (id),
    CONSTRAINT fk_reserva_servicio FOREIGN KEY (servicio_id) REFERENCES servicio_ofrecido (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS conversacion (
    id BIGINT NOT NULL AUTO_INCREMENT,
    fecha_creacion DATETIME(6) NOT NULL,
    ultimo_mensaje_fecha DATETIME(6),
    ultimo_mensaje_contenido VARCHAR(200),
    reserva_id BIGINT,
    silenciada_cliente_hasta DATETIME(6),
    silenciada_profesional_hasta DATETIME(6),
    fijada_cliente TINYINT NOT NULL DEFAULT 0,
    fijada_profesional TINYINT NOT NULL DEFAULT 0,
    contacto_clave VARCHAR(64),
    cliente_id BIGINT NOT NULL,
    profesional_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_conversacion_reserva (reserva_id),
    UNIQUE KEY uk_conversacion_contacto (contacto_clave),
    CONSTRAINT fk_conversacion_reserva FOREIGN KEY (reserva_id) REFERENCES reserva (id),
    CONSTRAINT fk_conversacion_cliente FOREIGN KEY (cliente_id) REFERENCES usuario (id),
    CONSTRAINT fk_conversacion_profesional FOREIGN KEY (profesional_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS mensaje (
    id BIGINT NOT NULL AUTO_INCREMENT,
    contenido VARCHAR(1000) NOT NULL,
    imagen_url VARCHAR(500),
    client_message_id VARCHAR(36) NOT NULL,
    leido TINYINT NOT NULL DEFAULT 0,
    recibido TINYINT NOT NULL DEFAULT 0,
    editado TINYINT NOT NULL DEFAULT 0,
    fecha_edicion DATETIME(6),
    eliminado TINYINT NOT NULL DEFAULT 0,
    fecha_envio DATETIME(6) NOT NULL,
    remitente_id BIGINT NOT NULL,
    destinatario_id BIGINT NOT NULL,
    conversacion_id BIGINT NOT NULL,
    mensaje_respondido_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT fk_mensaje_remitente FOREIGN KEY (remitente_id) REFERENCES usuario (id),
    CONSTRAINT fk_mensaje_destinatario FOREIGN KEY (destinatario_id) REFERENCES usuario (id),
    CONSTRAINT fk_mensaje_conversacion FOREIGN KEY (conversacion_id) REFERENCES conversacion (id),
    CONSTRAINT fk_mensaje_respondido FOREIGN KEY (mensaje_respondido_id) REFERENCES mensaje (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS valoracion (
    id BIGINT NOT NULL AUTO_INCREMENT,
    estrellas INT NOT NULL,
    comentario VARCHAR(1000),
    fecha DATETIME(6) NOT NULL,
    reserva_id BIGINT NOT NULL,
    cliente_id BIGINT NOT NULL,
    profesional_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_valoracion_reserva (reserva_id),
    CONSTRAINT fk_valoracion_reserva FOREIGN KEY (reserva_id) REFERENCES reserva (id),
    CONSTRAINT fk_valoracion_cliente FOREIGN KEY (cliente_id) REFERENCES usuario (id),
    CONSTRAINT fk_valoracion_profesional FOREIGN KEY (profesional_id) REFERENCES profesional_info (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS pago (
    id BIGINT NOT NULL AUTO_INCREMENT,
    importe DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    fecha_pago DATETIME(6) NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    reserva_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_pago_reserva (reserva_id),
    CONSTRAINT fk_pago_reserva FOREIGN KEY (reserva_id) REFERENCES reserva (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS notificacion (
    id BIGINT NOT NULL AUTO_INCREMENT,
    mensaje VARCHAR(300) NOT NULL,
    leida TINYINT NOT NULL DEFAULT 0,
    fecha_creacion DATETIME(6) NOT NULL,
    usuario_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_notificacion_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS password_reset_token (
    id BIGINT NOT NULL AUTO_INCREMENT,
    token VARCHAR(100) NOT NULL,
    usuario_id BIGINT NOT NULL,
    expiracion DATETIME(6) NOT NULL,
    usado TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_token (token),
    CONSTRAINT fk_token_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS favorito_servicio (
    id BIGINT NOT NULL AUTO_INCREMENT,
    fecha_creacion DATETIME(6) NOT NULL,
    cliente_id BIGINT NOT NULL,
    servicio_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY UK_cliente_servicio (cliente_id, servicio_id),
    CONSTRAINT fk_favorito_cliente FOREIGN KEY (cliente_id) REFERENCES usuario (id),
    CONSTRAINT fk_favorito_servicio FOREIGN KEY (servicio_id) REFERENCES servicio_ofrecido (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS resena_profesional (
    id BIGINT NOT NULL AUTO_INCREMENT,
    calificacion INT NOT NULL,
    comentario VARCHAR(1000) NOT NULL,
    fecha_creacion DATETIME(6) NOT NULL,
    cliente_id BIGINT NOT NULL,
    profesional_id BIGINT NOT NULL,
    reserva_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT fk_resena_cliente FOREIGN KEY (cliente_id) REFERENCES usuario (id),
    CONSTRAINT fk_resena_profesional FOREIGN KEY (profesional_id) REFERENCES profesional_info (id),
    CONSTRAINT fk_resena_reserva FOREIGN KEY (reserva_id) REFERENCES reserva (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS bloqueo_usuario (
    id BIGINT NOT NULL AUTO_INCREMENT,
    bloqueador_id BIGINT NOT NULL,
    bloqueado_id BIGINT NOT NULL,
    fecha_bloqueo DATETIME(6) NOT NULL,
    motivo VARCHAR(500),
    PRIMARY KEY (id),
    UNIQUE KEY uq_bloqueo (bloqueador_id, bloqueado_id),
    CONSTRAINT fk_bloqueo_bloqueador FOREIGN KEY (bloqueador_id) REFERENCES usuario (id),
    CONSTRAINT fk_bloqueo_bloqueado FOREIGN KEY (bloqueado_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS mensaje_reaccion (
    id BIGINT NOT NULL AUTO_INCREMENT,
    mensaje_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    fecha_creacion DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_msg_user_emoji (mensaje_id, usuario_id, emoji),
    CONSTRAINT fk_reaccion_mensaje FOREIGN KEY (mensaje_id) REFERENCES mensaje (id),
    CONSTRAINT fk_reaccion_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS profesional_ciudad_servicio (
    profesional_id BIGINT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    CONSTRAINT fk_pcs_profesional FOREIGN KEY (profesional_id) REFERENCES profesional_info (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS reporte (
    id BIGINT NOT NULL AUTO_INCREMENT,
    reportador_id BIGINT NOT NULL,
    reportado_id BIGINT NOT NULL,
    mensajes_json VARCHAR(10000),
    resuelto TINYINT NOT NULL DEFAULT 0,
    fecha DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_reporte_reportador FOREIGN KEY (reportador_id) REFERENCES usuario (id),
    CONSTRAINT fk_reporte_reportado FOREIGN KEY (reportado_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS monedero (
    id BIGINT NOT NULL AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL,
    saldo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    iban VARCHAR(34),
    titular VARCHAR(100),
    PRIMARY KEY (id),
    UNIQUE KEY uk_monedero_usuario (usuario_id),
    CONSTRAINT fk_monedero_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS movimiento_monedero (
    id BIGINT NOT NULL AUTO_INCREMENT,
    monedero_id BIGINT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    concepto VARCHAR(255) NOT NULL,
    importe DECIMAL(10,2) NOT NULL,
    fecha DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_movimiento_monedero FOREIGN KEY (monedero_id) REFERENCES monedero (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;
