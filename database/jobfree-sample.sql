-- ============================================================
--  JobFree — Base de datos de ejemplo (datos inventados)
-- ============================================================
--  Propósito : arranque rápido para desarrollo/pruebas
--  Datos      : completamente ficticios, sin información real
--  Contraseña : todos los usuarios de prueba → "Test1234!"
--               (hash BCrypt incluido a continuación)
--
--  Pasos para usarlo:
--  1. Crea una BD vacía: CREATE DATABASE jobfree;
--  2. Importa este fichero: mysql -u root jobfree < jobfree-sample.sql
--  3. Arranca el backend (Flyway detectará que ya existe la BD
--     y solo ejecutará las migraciones que falten)
--
--  Nota: si prefieres empezar desde cero, registra usuarios
--  nuevos desde la app; Flyway crea las tablas automáticamente.
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `jobfree`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
USE `jobfree`;

-- ────────────────────────────────────────────────────────────
--  TABLAS
-- ────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS `aud_migracion_conversacion`;
CREATE TABLE `aud_migracion_conversacion` (
  `auditoria_id` bigint(20) NOT NULL,
  `conversacion_id_original` bigint(20) NOT NULL,
  `reserva_id` bigint(20) DEFAULT NULL,
  `cliente_id` bigint(20) DEFAULT NULL,
  `profesional_id` bigint(20) DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `motivo` varchar(100) NOT NULL,
  `detalle` varchar(255) DEFAULT NULL,
  `auditado_en` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `aud_migracion_mensaje`;
CREATE TABLE `aud_migracion_mensaje` (
  `auditoria_id` bigint(20) NOT NULL,
  `mensaje_id_original` bigint(20) NOT NULL,
  `contenido` varchar(1000) DEFAULT NULL,
  `fecha_envio` datetime(6) DEFAULT NULL,
  `leido` bit(1) DEFAULT NULL,
  `destinatario_id` bigint(20) DEFAULT NULL,
  `remitente_id` bigint(20) DEFAULT NULL,
  `reserva_id` bigint(20) DEFAULT NULL,
  `conversacion_id` bigint(20) DEFAULT NULL,
  `motivo` varchar(100) NOT NULL,
  `detalle` varchar(255) DEFAULT NULL,
  `auditado_en` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `bloqueo_usuario`;
CREATE TABLE `bloqueo_usuario` (
  `id` bigint(20) NOT NULL,
  `bloqueador_id` bigint(20) NOT NULL,
  `bloqueado_id` bigint(20) NOT NULL,
  `fecha_bloqueo` datetime NOT NULL,
  `motivo` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `categoria_servicio`;
CREATE TABLE `categoria_servicio` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `conversacion`;
CREATE TABLE `conversacion` (
  `id` bigint(20) NOT NULL,
  `reserva_id` bigint(20) DEFAULT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `profesional_id` bigint(20) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `contacto_clave` varchar(64) DEFAULT NULL,
  `ultimo_mensaje_fecha` datetime DEFAULT NULL,
  `ultimo_mensaje_contenido` varchar(200) DEFAULT NULL,
  `silenciada_cliente` tinyint(1) NOT NULL DEFAULT 0,
  `silenciada_profesional` tinyint(1) NOT NULL DEFAULT 0,
  `silenciada_cliente_hasta` datetime DEFAULT NULL,
  `silenciada_profesional_hasta` datetime DEFAULT NULL,
  `fijada_cliente` tinyint(1) NOT NULL DEFAULT 0,
  `fijada_profesional` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `favorito_servicio`;
CREATE TABLE `favorito_servicio` (
  `id` bigint(20) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `servicio_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `flyway_schema_history`;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int(11) NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int(11) DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `execution_time` int(11) NOT NULL,
  `success` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `mensaje`;
CREATE TABLE `mensaje` (
  `id` bigint(20) NOT NULL,
  `contenido` varchar(1000) NOT NULL DEFAULT '',
  `fecha_envio` datetime(6) NOT NULL,
  `leido` bit(1) NOT NULL,
  `destinatario_id` bigint(20) NOT NULL,
  `remitente_id` bigint(20) NOT NULL,
  `conversacion_id` bigint(20) NOT NULL,
  `recibido` bit(1) NOT NULL DEFAULT b'0',
  `client_message_id` varchar(36) NOT NULL,
  `mensaje_respondido_id` bigint(20) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `notificacion`;
CREATE TABLE `notificacion` (
  `id` bigint(20) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `leida` bit(1) NOT NULL,
  `mensaje` varchar(300) NOT NULL,
  `usuario_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `pago`;
CREATE TABLE `pago` (
  `id` bigint(20) NOT NULL,
  `estado` enum('PAGADO','PENDIENTE','REEMBOLSADO') NOT NULL,
  `fecha_pago` datetime(6) NOT NULL,
  `importe` decimal(10,2) NOT NULL,
  `metodo` enum('EFECTIVO','TARJETA','TRANSFERENCIA') NOT NULL,
  `reserva_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `password_reset_token`;
CREATE TABLE `password_reset_token` (
  `id` bigint(20) NOT NULL,
  `expiracion` datetime(6) NOT NULL,
  `token` varchar(100) NOT NULL,
  `usado` bit(1) NOT NULL,
  `usuario_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `profesional_info`;
CREATE TABLE `profesional_info` (
  `id` bigint(20) NOT NULL,
  `cif` varchar(20) DEFAULT NULL,
  `descripcion` varchar(500) NOT NULL,
  `experiencia` int(11) NOT NULL,
  `nombre_empresa` varchar(100) DEFAULT NULL,
  `numero_valoraciones` int(11) NOT NULL,
  `plan` enum('BASICO','PREMIUM','PRO') NOT NULL,
  `valoracion_media` double NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `latitud` double DEFAULT NULL,
  `longitud` double DEFAULT NULL,
  `ubicacion_manual` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `resena_profesional`;
CREATE TABLE `resena_profesional` (
  `id` bigint(20) NOT NULL,
  `calificacion` int(11) NOT NULL,
  `comentario` varchar(1000) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `profesional_id` bigint(20) NOT NULL,
  `reserva_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `reserva`;
CREATE TABLE `reserva` (
  `id` bigint(20) NOT NULL,
  `estado` enum('CANCELADA','COMPLETADA','CONFIRMADA','PENDIENTE') NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `fecha_inicio` datetime(6) NOT NULL,
  `precio_total` decimal(10,2) NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `servicio_id` bigint(20) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `progreso` int(11) NOT NULL DEFAULT 0,
  `notas_progreso` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `servicio_ofrecido`;
CREATE TABLE `servicio_ofrecido` (
  `id` bigint(20) NOT NULL,
  `activa` bit(1) NOT NULL,
  `descripcion` varchar(1000) NOT NULL,
  `duracion_min` int(11) NOT NULL,
  `precio_hora` decimal(10,2) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `profesional_id` bigint(20) NOT NULL,
  `subcategoria_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `subcategoria_servicio`;
CREATE TABLE `subcategoria_servicio` (
  `id` bigint(20) NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `imagen` varchar(200) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `categoria_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` bigint(20) NOT NULL,
  `apellidos` varchar(150) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','CLIENTE','PROFESIONAL') NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `ultima_conexion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `valoracion`;
CREATE TABLE `valoracion` (
  `id` bigint(20) NOT NULL,
  `comentario` varchar(1000) DEFAULT NULL,
  `estrellas` int(11) NOT NULL,
  `fecha` datetime(6) NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `profesional_id` bigint(20) NOT NULL,
  `reserva_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ────────────────────────────────────────────────────────────
--  DATOS — Categorías y subcategorías (datos de referencia)
-- ────────────────────────────────────────────────────────────

INSERT INTO `categoria_servicio` (`id`, `nombre`) VALUES
(1, 'Mantenimiento'),
(2, 'Reparaciones'),
(3, 'Cuidado personal'),
(4, 'Mascotas'),
(5, 'Clases'),
(6, 'Urgencias'),
(7, 'Otros');

INSERT INTO `subcategoria_servicio` (`id`, `descripcion`, `imagen`, `nombre`, `categoria_id`) VALUES
(1,  'Limpieza general de viviendas',                     '/images/servicios/mantenimiento/limpieza_hogar.jpg',       'Limpieza del hogar',              1),
(2,  'Limpieza intensiva de toda la casa',                '/images/servicios/mantenimiento/limpieza_profunda.jpg',    'Limpieza profunda',               1),
(3,  'Limpieza tras reformas o mudanzas',                 '/images/servicios/mantenimiento/post_obra.jpg',            'Limpieza post obra',              1),
(4,  'Revisión y mantenimiento básico del hogar',         '/images/servicios/mantenimiento/mantenimiento_general.jpg','Mantenimiento general del hogar', 1),
(5,  'Servicio general de manitas para tareas básicas',   '/images/servicios/mantenimiento/manitas.jpg',              'Servicio de manitas',             1),
(6,  'Sustitución de bombillas y luminarias',             '/images/servicios/mantenimiento/bombillas.jpg',            'Cambio de bombillas',             1),
(7,  'Montaje de lámparas y focos en vivienda',           '/images/servicios/mantenimiento/lamparas.jpg',             'Instalación de lámparas',         1),
(8,  'Cuidado y mantenimiento de jardines privados',      '/images/servicios/mantenimiento/jardin.jpg',               'Mantenimiento de jardín',         1),
(9,  'Poda de plantas y arbustos en domicilio',           '/images/servicios/mantenimiento/poda.jpg',                 'Poda de plantas',                 1),
(10, 'Corte de césped en viviendas particulares',         '/images/servicios/mantenimiento/cesped.jpg',               'Corte de césped',                 1),
(11, 'Instalación y ajuste de sistemas de riego',         '/images/servicios/mantenimiento/riego.jpg',                'Instalación de riego',            1),
(12, 'Mantenimiento básico de piscinas privadas',         '/images/servicios/mantenimiento/piscina.png',              'Mantenimiento de piscina',        1),
(13, 'Limpieza de piscinas en domicilio',                 '/images/servicios/mantenimiento/piscina_limpieza.jpg',     'Limpieza de piscina',             1),
(14, 'Control de niveles de cloro y pH',                  '/images/servicios/mantenimiento/piscina_ph.png',           'Control químico piscina',         1),
(15, 'Limpieza de garajes y trasteros particulares',      '/images/servicios/mantenimiento/garaje.png',               'Limpieza de garaje',              1),
(16, 'Mantenimiento de espacios exteriores',              '/images/servicios/mantenimiento/exterior.png',             'Mantenimiento de exteriores',     1),
(17, 'Limpieza de cristales y ventanas',                  '/images/servicios/mantenimiento/cristales.jpg',            'Limpieza de cristales',           1),
(18, 'Limpieza de sofás y tapicería en domicilio',        '/images/servicios/mantenimiento/sofa.png',                 'Limpieza de sofás',               1),
(19, 'Limpieza profesional de alfombras',                 '/images/servicios/mantenimiento/alfombras.png',            'Limpieza de alfombras',           1),
(20, 'Servicio de planchado a domicilio',                 '/images/servicios/mantenimiento/planchado.jpg',            'Planchado a domicilio',           1),
(21, 'Organización de espacios y armarios',               '/images/servicios/mantenimiento/organizacion.jpg',         'Organización del hogar',          1),
(22, 'Apoyo en tareas domésticas diarias',                '/images/servicios/mantenimiento/asistencia.jpg',           'Asistencia doméstica',            1),
(23, 'Desinfección completa del hogar',                   '/images/servicios/mantenimiento/desinfeccion.png',         'Desinfección del hogar',          1),
(24, 'Tratamiento básico contra insectos en vivienda',    '/images/servicios/mantenimiento/plagas.png',               'Control básico de plagas',        1),
(25, 'Limpieza de terrazas, patios y balcones',           '/images/servicios/mantenimiento/terraza.png',              'Limpieza de terraza',             1),
(26, 'Reparación de instalaciones eléctricas en vivienda','/images/servicios/reparaciones/electricidad.png',          'Reparación eléctrica',            2),
(27, 'Sustitución de enchufes dañados',                   '/images/servicios/reparaciones/enchufes.jpg',              'Reparación de enchufes',          2),
(28, 'Cambio de interruptores defectuosos',               '/images/servicios/reparaciones/interruptores.png',         'Reparación de interruptores',     2),
(29, 'Revisión y arreglo de cuadros eléctricos',          '/images/servicios/reparaciones/cuadro.png',                'Reparación de cuadro eléctrico',  2),
(30, 'Reparación de tuberías y sistemas de agua',         '/images/servicios/reparaciones/fontaneria.jpg',            'Reparación de fontanería',        2),
(31, 'Detección y reparación de fugas de agua',           '/images/servicios/reparaciones/fugas.png',                 'Reparación de fugas',             2),
(32, 'Reparación de grifos y sanitarios',                 '/images/servicios/reparaciones/grifos.png',                'Reparación de grifos',            2),
(33, 'Desatascos en tuberías domésticas',                 '/images/servicios/reparaciones/desatascos.jpg',            'Desatascos',                      2),
(34, 'Reparación de sistemas de calefacción',             '/images/servicios/reparaciones/calefaccion.jpg',           'Reparación de calefacción',       2),
(35, 'Reparación de radiadores en vivienda',              '/images/servicios/reparaciones/radiadores.png',            'Reparación de radiadores',        2),
(36, 'Reparación de calderas domésticas',                 '/images/servicios/reparaciones/caldera.png',               'Reparación de calderas',          2),
(37, 'Reparación de aire acondicionado',                  '/images/servicios/reparaciones/aire.png',                  'Reparación de aire acondicionado',2),
(38, 'Recarga de gas en equipos de aire',                 '/images/servicios/reparaciones/gas.png',                   'Carga de gas aire acondicionado', 2),
(39, 'Reparación de lavadoras',                           '/images/servicios/reparaciones/lavadora.png',              'Reparación de lavadoras',         2),
(40, 'Reparación de frigoríficos',                        '/images/servicios/reparaciones/frigorifico.png',           'Reparación de frigoríficos',      2),
(41, 'Reparación de hornos',                              '/images/servicios/reparaciones/horno.jpg',                 'Reparación de hornos',            2),
(42, 'Reparación de lavavajillas',                        '/images/servicios/reparaciones/lavavajillas.png',          'Reparación de lavavajillas',      2),
(43, 'Reparación de microondas',                          '/images/servicios/reparaciones/microondas.png',            'Reparación de microondas',        2),
(44, 'Reparación de persianas domésticas',                '/images/servicios/reparaciones/persianas.png',             'Reparación de persianas',         2),
(45, 'Reparación de puertas en vivienda',                 '/images/servicios/reparaciones/puertas.jpg',               'Reparación de puertas',           2),
(46, 'Reparación de ventanas',                            '/images/servicios/reparaciones/ventanas.png',              'Reparación de ventanas',          2),
(47, 'Reparación de cerraduras',                          '/images/servicios/reparaciones/cerraduras.jpg',            'Reparación de cerraduras',        2),
(48, 'Reparación de muebles dañados',                     '/images/servicios/reparaciones/muebles.jpg',               'Reparación de muebles',           2),
(49, 'Reparación de suelos y parquet',                    '/images/servicios/reparaciones/suelos.png',                'Reparación de suelos',            2),
(50, 'Reparación de filtraciones y goteras',              '/images/servicios/reparaciones/goteras.jpg',               'Reparación de goteras',           2),
(51, 'Atención y cuidado de personas mayores en domicilio','/images/servicios/cuidado/mayores.jpg',                   'Cuidado de mayores',              3),
(52, 'Atención a personas dependientes en casa',          '/images/servicios/cuidado/dependientes.png',               'Cuidado de dependientes',         3),
(53, 'Acompañamiento diario en el hogar',                 '/images/servicios/cuidado/acompanamiento.jpg',             'Acompañamiento en casa',          3),
(54, 'Cuidado nocturno de personas en domicilio',         '/images/servicios/cuidado/nocturno.png',                   'Cuidado nocturno',                3),
(55, 'Cuidado de niños en casa',                          '/images/servicios/cuidado/ninos.png',                      'Cuidado de niños',                3),
(56, 'Servicio de niñera por horas',                      '/images/servicios/cuidado/ninera.png',                     'Niñera a domicilio',              3),
(57, 'Cuidado de bebés en domicilio',                     '/images/servicios/cuidado/bebes.png',                      'Cuidado de bebés',                3),
(58, 'Apoyo escolar infantil en casa',                    '/images/servicios/cuidado/escolar.png',                    'Apoyo escolar en casa',           3),
(59, 'Servicio de peluquería a domicilio',                '/images/servicios/cuidado/peluqueria.png',                 'Peluquería a domicilio',          3),
(60, 'Maquillaje profesional en casa',                    '/images/servicios/cuidado/maquillaje.png',                 'Maquillaje a domicilio',          3),
(61, 'Manicura en domicilio',                             '/images/servicios/cuidado/manicura.jpg',                   'Manicura a domicilio',            3),
(62, 'Pedicura en casa',                                  '/images/servicios/cuidado/pedicura.png',                   'Pedicura a domicilio',            3),
(63, 'Depilación en domicilio',                           '/images/servicios/cuidado/depilacion.jpg',                 'Depilación a domicilio',          3),
(64, 'Tratamientos estéticos en casa',                    '/images/servicios/cuidado/estetica.png',                   'Estética a domicilio',            3),
(65, 'Masajes relajantes en domicilio',                   '/images/servicios/cuidado/masajes.jpg',                    'Masajes a domicilio',             3),
(66, 'Fisioterapia en casa',                              '/images/servicios/cuidado/fisio.jpg',                      'Fisioterapia a domicilio',        3),
(67, 'Rehabilitación física en domicilio',                '/images/servicios/cuidado/rehabilitacion.jpg',             'Rehabilitación en casa',          3),
(68, 'Entrenamiento personal en casa',                    '/images/servicios/cuidado/entrenador.jpg',                 'Entrenador personal',             3),
(69, 'Clases de yoga en domicilio',                       '/images/servicios/cuidado/yoga.jpg',                       'Yoga a domicilio',                3),
(70, 'Clases de pilates en casa',                         '/images/servicios/cuidado/pilates.png',                    'Pilates a domicilio',             3),
(71, 'Asistencia postoperatoria en domicilio',            '/images/servicios/cuidado/postoperatorio.png',             'Asistencia postoperatoria',       3),
(72, 'Ayuda en tareas personales diarias',                '/images/servicios/cuidado/ayuda.jpg',                      'Ayuda personal diaria',           3),
(73, 'Servicio de cuidado por horas',                     '/images/servicios/cuidado/horas.png',                      'Cuidado por horas',               3),
(74, 'Cuidado interno en domicilio (larga estancia)',     '/images/servicios/cuidado/interno.jpg',                    'Cuidado interno',                 3),
(75, 'Asesoramiento nutricional en casa',                 '/images/servicios/cuidado/nutricion.png',                  'Nutricionista a domicilio',       3),
(76, 'Paseo de perros desde el domicilio del cliente',    '/images/servicios/mascotas/paseo_perros.png',              'Paseo de perros',                 4),
(77, 'Cuidado de perros en casa del cliente',             '/images/servicios/mascotas/cuidado_perros.jpg',            'Cuidado de perros en casa',       4),
(78, 'Cuidado de gatos en el domicilio',                  '/images/servicios/mascotas/cuidado_gatos.png',             'Cuidado de gatos',                4),
(79, 'Cuidado de mascotas por horas',                     '/images/servicios/mascotas/horas.png',                     'Cuidado por horas',               4),
(80, 'Cuidado nocturno de mascotas en casa',              '/images/servicios/mascotas/nocturno.png',                  'Cuidado nocturno de mascotas',    4),
(81, 'Cuidado de mascotas durante vacaciones',            '/images/servicios/mascotas/vacaciones.jpeg',               'Cuidado en vacaciones',           4),
(82, 'Visitas a domicilio para alimentar mascotas',       '/images/servicios/mascotas/visitas.jpg',                   'Visitas a domicilio',             4),
(83, 'Adiestramiento canino básico en casa',              '/images/servicios/mascotas/adiestramiento.jpg',            'Adiestramiento básico',           4),
(84, 'Adiestramiento avanzado y corrección de conducta',  '/images/servicios/mascotas/adiestramiento_avanzado.png',   'Adiestramiento avanzado',         4),
(85, 'Socialización de perros en entorno doméstico',      '/images/servicios/mascotas/socializacion.png',             'Socialización canina',            4),
(86, 'Peluquería canina a domicilio',                     '/images/servicios/mascotas/peluqueria.jpg',                'Peluquería canina',               4),
(87, 'Baño de mascotas en casa',                          '/images/servicios/mascotas/bano.png',                      'Baño de mascotas',                4),
(88, 'Corte de uñas para mascotas',                       '/images/servicios/mascotas/unas.png',                      'Corte de uñas',                   4),
(89, 'Veterinario a domicilio',                           '/images/servicios/mascotas/veterinario.jpg',               'Veterinario a domicilio',         4),
(90, 'Administración de medicación a mascotas',           '/images/servicios/mascotas/medicacion.jpg',                'Administración de medicación',    4),
(91, 'Cuidado de aves en domicilio',                      '/images/servicios/mascotas/aves.png',                      'Cuidado de aves',                 4),
(92, 'Cuidado de reptiles en casa',                       '/images/servicios/mascotas/reptiles.jpg',                  'Cuidado de reptiles',             4),
(93, 'Cuidado de roedores y pequeños animales',           '/images/servicios/mascotas/roedores.png',                  'Cuidado de roedores',             4),
(94, 'Cuidado de peces y acuarios en domicilio',          '/images/servicios/mascotas/peces.jpg',                     'Cuidado de peces',                4),
(95, 'Mantenimiento y limpieza de acuarios',              '/images/servicios/mascotas/acuario.jpg',                   'Mantenimiento de acuarios',       4),
(96, 'Transporte de mascotas desde el domicilio',         '/images/servicios/mascotas/transporte.png',                'Transporte de mascotas',          4),
(97, 'Acompañamiento a citas veterinarias',               '/images/servicios/mascotas/acompanamiento.jpeg',           'Acompañamiento veterinario',      4),
(98, 'Alimentación programada de mascotas en casa',       '/images/servicios/mascotas/comida.png',                    'Alimentación programada',         4),
(99, 'Ejercicio guiado para mascotas en domicilio',       '/images/servicios/mascotas/ejercicio.png',                 'Ejercicio para mascotas',         4),
(100,'Limpieza de espacios de mascotas en casa',          '/images/servicios/mascotas/limpieza.png',                  'Limpieza de zonas de mascotas',   4),
(101,'Refuerzo de matemáticas nivel primaria en domicilio','/images/servicios/clases/matematicas_primaria.png',       'Matemáticas primaria',            5),
(102,'Apoyo en matemáticas nivel secundaria',             '/images/servicios/clases/matematicas_eso.png',             'Matemáticas ESO',                 5),
(103,'Preparación de matemáticas nivel bachillerato',     '/images/servicios/clases/matematicas_bachiller.png',       'Matemáticas bachillerato',        5),
(104,'Clases de inglés conversación en casa',             '/images/servicios/clases/ingles_speaking.png',             'Inglés conversación',             5),
(105,'Refuerzo de gramática inglesa en domicilio',        '/images/servicios/clases/ingles_grammar.jpg',              'Inglés gramática',                5),
(106,'Clases de lengua y sintaxis en casa',               '/images/servicios/clases/lengua.png',                      'Lengua y sintaxis',               5),
(107,'Clases de física nivel bachillerato en domicilio',  '/images/servicios/clases/fisica.png',                      'Física bachillerato',             5),
(108,'Clases de química nivel bachillerato en casa',      '/images/servicios/clases/quimica.png',                     'Química bachillerato',            5),
(109,'Clases de programación Java a domicilio',           '/images/servicios/clases/programacion_java.png',           'Programación Java',               5),
(110,'Clases de desarrollo web (HTML, CSS, JS)',          '/images/servicios/clases/programacion_web.jpg',            'Programación web',                5),
(111,'Clases de bases de datos SQL en casa',              '/images/servicios/clases/bd_sql.png',                      'Bases de datos SQL',              5),
(112,'Clases de informática básica para principiantes',   '/images/servicios/clases/informatica.jpeg',                'Informática básica',              5),
(113,'Clases de guitarra eléctrica en domicilio',         '/images/servicios/clases/guitarra_electrica.png',          'Guitarra eléctrica',              5),
(114,'Clases de guitarra acústica en casa',               '/images/servicios/clases/guitarra_acustica.png',           'Guitarra acústica',               5),
(115,'Clases de piano para principiantes',                '/images/servicios/clases/piano.png',                       'Piano básico',                    5),
(116,'Clases de canto moderno en domicilio',              '/images/servicios/clases/canto.png',                       'Canto moderno',                   5),
(117,'Clases de dibujo artístico en casa',                '/images/servicios/clases/dibujo.png',                      'Dibujo artístico',                5),
(118,'Clases de pintura acrílica a domicilio',            '/images/servicios/clases/pintura.jpg',                     'Pintura acrílica',                5),
(119,'Clases de baile urbano en casa',                    '/images/servicios/clases/baile_urbano.jpg',                'Baile urbano',                    5),
(120,'Clases de baile latino (salsa, bachata)',           '/images/servicios/clases/baile_latino.jpg',                'Baile latino',                    5),
(121,'Clases de cocina básica en domicilio',              '/images/servicios/clases/cocina_basica.png',               'Cocina básica',                   5),
(122,'Clases de cocina saludable en casa',                '/images/servicios/clases/cocina_saludable.png',            'Cocina saludable',                5),
(123,'Clases de yoga en domicilio',                       '/images/servicios/clases/yoga.jpg',                        'Yoga en casa',                    5),
(124,'Clases de pilates a domicilio',                     '/images/servicios/clases/pilates.png',                     'Pilates en casa',                 5),
(125,'Clases de francés básico en domicilio',             '/images/servicios/clases/frances.jpg',                     'Francés básico',                  5),
(126,'Clases de alemán básico en casa',                   '/images/servicios/clases/aleman.png',                      'Alemán básico',                   5),
(127,'Servicio urgente de fontanería para fugas o roturas','/images/servicios/urgencias/fontanero.png',               'Fontanero urgente 24h',           6),
(128,'Intervención inmediata en averías eléctricas',      '/images/servicios/urgencias/electricista.jpg',             'Electricista urgente 24h',        6),
(129,'Apertura urgente de puertas bloqueadas',            '/images/servicios/urgencias/cerrajero.jpg',                'Cerrajero urgente 24h',           6),
(130,'Desatascos urgentes en tuberías domésticas',        '/images/servicios/urgencias/desatasco.jpg',                'Desatascos urgentes',             6),
(131,'Reparación urgente de fugas de agua',               '/images/servicios/urgencias/fuga.jpg',                     'Fuga de agua urgente',            6),
(132,'Restablecimiento de suministro eléctrico en casa',  '/images/servicios/urgencias/electricidad.jpg',             'Corte de luz urgente',            6),
(133,'Reparación urgente de cuadro eléctrico',            '/images/servicios/urgencias/cuadro.png',                   'Cuadro eléctrico urgente',        6),
(134,'Cambio urgente de cerraduras',                      '/images/servicios/urgencias/cerradura.jpeg',               'Cambio de cerradura urgente',     6),
(135,'Apertura de vivienda sin llaves',                   '/images/servicios/urgencias/puertas.jpg',                  'Apertura de puerta urgente',      6),
(136,'Sustitución urgente de cristales rotos',            '/images/servicios/urgencias/cristal.png',                  'Cristalero urgente',              6),
(137,'Reparación urgente de electrodomésticos',           '/images/servicios/urgencias/electrodomesticos.jpg',        'Electrodomésticos urgente',       6),
(138,'Reparación urgente de aire acondicionado',          '/images/servicios/urgencias/aire.png',                     'Aire acondicionado urgente',      6),
(139,'Reparación urgente de calefacción',                 '/images/servicios/urgencias/calefaccion.jpg',              'Calefacción urgente',             6),
(140,'Control urgente de plagas en vivienda',             '/images/servicios/urgencias/plagas.png',                   'Plagas urgente',                  6),
(141,'Fumigación urgente en domicilio',                   '/images/servicios/urgencias/fumigacion.png',               'Fumigación urgente',              6),
(142,'Limpieza urgente tras inundaciones o suciedad extrema','/images/servicios/urgencias/limpieza.png',              'Limpieza urgente',                6),
(143,'Reparación urgente de persianas bloqueadas',        '/images/servicios/urgencias/persianas.png',                'Persianas urgente',               6),
(144,'Reparación urgente de puertas dañadas',             '/images/servicios/urgencias/puertas.jpg',                  'Puertas urgente',                 6),
(145,'Cuidado urgente de mascotas en domicilio',          '/images/servicios/urgencias/mascotas.png',                 'Mascotas urgente',                6),
(146,'Veterinario urgente a domicilio',                   '/images/servicios/urgencias/veterinario.jpg',              'Veterinario urgente',             6),
(147,'Asistencia informática urgente en casa',            '/images/servicios/urgencias/informatica.png',              'Informático urgente',             6),
(148,'Recuperación urgente de datos en domicilio',        '/images/servicios/urgencias/datos.png',                    'Recuperación de datos urgente',   6),
(149,'Servicio urgente de mudanza o traslado',            '/images/servicios/urgencias/mudanza.jpg',                  'Mudanza urgente',                 6),
(150,'Montaje urgente de muebles en casa',                '/images/servicios/urgencias/muebles.png',                  'Montaje urgente',                 6),
(151,'Reparación urgente de tejados o filtraciones',      '/images/servicios/urgencias/tejado.jpg',                   'Tejado urgente',                  6),
(152,'Organización profesional de armarios y espacios',   '/images/servicios/otros/organizacion.jpg',                 'Organización de espacios',        7),
(153,'Optimización de distribución del hogar',            '/images/servicios/otros/orden.png',                        'Optimización del hogar',          7),
(154,'Asesoramiento en decoración de interiores',         '/images/servicios/otros/decoracion.png',                   'Decoración de interiores',        7),
(155,'Reorganización estética de viviendas',              '/images/servicios/otros/interiorismo.png',                 'Interiorismo básico',             7),
(156,'Asesoría en compra de tecnología para casa',        '/images/servicios/otros/tecnologia.jpg',                   'Asesoría tecnológica',            7),
(157,'Instalación básica de dispositivos inteligentes',   '/images/servicios/otros/domotica.jpg',                     'Domótica básica',                 7),
(158,'Configuración de asistentes virtuales en casa',     '/images/servicios/otros/domotica.png',                     'Configuración Alexa/Google Home', 7),
(159,'Configuración de redes WiFi domésticas',            '/images/servicios/otros/wifi.jpg',                         'Configuración WiFi',              7),
(160,'Optimización de conexión a internet en casa',       '/images/servicios/otros/red.jpg',                          'Optimización de red doméstica',   7),
(161,'Digitalización de documentos en domicilio',         '/images/servicios/otros/documentos.jpg',                   'Digitalización de documentos',    7),
(162,'Organización de archivos digitales',                '/images/servicios/otros/digital.jpg',                      'Organización digital',            7),
(163,'Ayuda en gestiones online desde casa',              '/images/servicios/otros/gestiones.jpg',                    'Gestiones online',                7),
(164,'Asistencia en trámites digitales',                  '/images/servicios/otros/tramites.jpg',                     'Trámites digitales',              7),
(165,'Fotografía profesional en domicilio',               '/images/servicios/otros/fotografia.png',                   'Fotografía a domicilio',          7),
(166,'Grabación de vídeo personal o familiar',            '/images/servicios/otros/video.jpg',                        'Grabación de vídeo',              7),
(167,'Organización de eventos en casa',                   '/images/servicios/otros/eventos.png',                      'Organización de eventos',         7),
(168,'Decoración de fiestas en domicilio',                '/images/servicios/otros/eventos2.jpg',                     'Decoración de eventos',           7),
(169,'Asesoramiento en planificación de viajes',          '/images/servicios/otros/viajes.jpg',                       'Planificación de viajes',         7),
(170,'Sesiones de coaching personal en casa',             '/images/servicios/otros/coaching.jpg',                     'Coaching personal',               7),
(171,'Asesoramiento de imagen personal',                  '/images/servicios/otros/imagen.jpg',                       'Asesoría de imagen',              7),
(172,'Revisión y mejora de currículum en casa',           '/images/servicios/otros/cv.jpg',                           'Revisión de CV',                  7),
(173,'Entrenamiento mental y memoria',                    '/images/servicios/otros/memoria.jpg',                      'Estimulación cognitiva',          7),
(174,'Sesiones de mindfulness en domicilio',              '/images/servicios/otros/mindfulness.jpg',                  'Mindfulness en casa',             7),
(175,'Planificación de rutinas familiares',               '/images/servicios/otros/planificacion.jpg',                'Organización familiar',           7);

-- ────────────────────────────────────────────────────────────
--  DATOS — Usuarios de prueba (FICTICIOS)
--  Contraseña para todas las cuentas: Test1234!
-- ────────────────────────────────────────────────────────────

INSERT INTO `usuario` (`id`, `apellidos`, `ciudad`, `direccion`, `email`, `nombre`, `password`, `rol`, `telefono`, `foto_url`, `ultima_conexion`) VALUES
(1,  'Sistema',       'Madrid',  'Calle Central 1',   'admin@jobfree.com',          'Admin',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'ADMIN',        '+34600000001', NULL, NULL),
(2,  'García López',  'Madrid',  'Calle Mayor 10',    'cliente1@example.com',       'Ana',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'CLIENTE',      '+34611000001', NULL, NULL),
(3,  'Martínez Ruiz', 'Sevilla', 'Avenida Sur 25',    'cliente2@example.com',       'Carlos',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'CLIENTE',      '+34611000002', NULL, NULL),
(4,  'Fernández Díaz','Córdoba', 'Calle Nueva 5',     'profesional1@example.com',   'Laura',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL',  '+34622000001', NULL, NULL),
(5,  'Sánchez Mora',  'Málaga',  'Calle del Mar 8',   'profesional2@example.com',   'Pedro',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL',  '+34622000002', NULL, NULL),
(6,  'López Torres',  'Granada', 'Calle Alta 3',      'profesional3@example.com',   'Sofía',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL',  '+34622000003', NULL, NULL);

-- ────────────────────────────────────────────────────────────
--  DATOS — Información de profesionales
-- ────────────────────────────────────────────────────────────

INSERT INTO `profesional_info` (`id`, `cif`, `descripcion`, `experiencia`, `nombre_empresa`, `numero_valoraciones`, `plan`, `valoracion_media`, `usuario_id`, `codigo_postal`, `latitud`, `longitud`, `ubicacion_manual`) VALUES
(1, 'B11111111', 'Especialista en limpieza y mantenimiento del hogar con amplia experiencia.',         5,  'Servicios Limpieza Demo',  3,  'PREMIUM', 4.3, 4, '28001', 40.416775, -3.703790, b'1'),
(2, 'B22222222', 'Electricista y fontanero profesional. Reparaciones rápidas y económicas.',           8,  'Reparaciones Demo S.L.',   5,  'PRO',     4.7, 5, '41001', 37.388050, -5.982340, b'1'),
(3,  NULL,       'Profesora de clases particulares y actividades al aire libre. Muy dinámica.',        3,  NULL,                       2,  'BASICO',  4.5, 6, '18001', 37.177336, -3.598557, b'1');

-- ────────────────────────────────────────────────────────────
--  DATOS — Servicios de prueba
-- ────────────────────────────────────────────────────────────

INSERT INTO `servicio_ofrecido` (`id`, `activa`, `descripcion`, `duracion_min`, `precio_hora`, `titulo`, `profesional_id`, `subcategoria_id`) VALUES
(1,  b'1', 'Limpieza completa de viviendas, incluyendo cocina y baños. Materiales incluidos.', 120, 13.00, 'Limpieza general del hogar',          1, 1),
(2,  b'1', 'Limpieza profunda con desengrasado y desinfección.',                               180, 15.00, 'Limpieza profunda',                   1, 2),
(3,  b'1', 'Reparación de averías eléctricas y revisión del cuadro.',                           60, 25.00, 'Reparación eléctrica',                2, 26),
(4,  b'1', 'Detección y reparación de fugas. Servicio urgente disponible.',                     60, 28.00, 'Reparación de fugas de agua',         2, 31),
(5,  b'1', 'Clases de guitarra acústica para todos los niveles.',                               60, 15.00, 'Clases de guitarra acústica',         3, 114),
(6,  b'1', 'Entrenamiento personal adaptado a tus objetivos.',                                  60, 20.00, 'Entrenador personal a domicilio',     3, 68),
(7,  b'1', 'Mantenimiento y limpieza de jardines y exteriores.',                               120, 18.00, 'Mantenimiento de jardín',             2, 8),
(8,  b'1', 'Cambio urgente de cerraduras. Disponible 24h.',                                     60, 30.00, 'Cambio de cerradura urgente 24h',     2, 134);

-- ────────────────────────────────────────────────────────────
--  DATOS — Reservas y pagos de ejemplo
-- ────────────────────────────────────────────────────────────

INSERT INTO `reserva` (`id`, `estado`, `fecha_creacion`, `fecha_inicio`, `precio_total`, `cliente_id`, `servicio_id`, `descripcion`, `progreso`, `notas_progreso`) VALUES
(1, 'COMPLETADA', '2026-01-10 09:00:00.000000', '2026-01-15 10:00:00.000000', 26.00,  2, 1, 'Limpieza general tras mudanza.',          0, NULL),
(2, 'COMPLETADA', '2026-01-20 11:00:00.000000', '2026-01-25 09:30:00.000000', 50.00,  3, 3, 'Fallo en varios enchufes del salón.',      0, NULL),
(3, 'CONFIRMADA', '2026-02-01 10:00:00.000000', '2026-02-10 17:00:00.000000', 30.00,  2, 5, 'Clases de guitarra, nivel principiante.',  0, NULL),
(4, 'PENDIENTE',  '2026-02-15 08:30:00.000000', '2026-02-20 11:00:00.000000', 36.00,  3, 7, 'Poda y mantenimiento del jardín.',         0, NULL),
(5, 'CANCELADA',  '2026-03-01 12:00:00.000000', '2026-03-05 16:00:00.000000', 56.00,  2, 2, 'Limpieza profunda después de obra.',       0, NULL);

INSERT INTO `pago` (`id`, `estado`, `fecha_pago`, `importe`, `metodo`, `reserva_id`) VALUES
(1, 'PAGADO',   '2026-01-15 12:00:00.000000', 26.00, 'TARJETA',       1),
(2, 'PAGADO',   '2026-01-25 10:30:00.000000', 50.00, 'EFECTIVO',      2),
(3, 'PENDIENTE','2026-02-10 17:00:00.000000', 30.00, 'TARJETA',       3),
(4, 'PENDIENTE','2026-02-20 11:00:00.000000', 36.00, 'TRANSFERENCIA', 4);

INSERT INTO `valoracion` (`id`, `comentario`, `estrellas`, `fecha`, `cliente_id`, `profesional_id`, `reserva_id`) VALUES
(1, 'Excelente trabajo, muy puntual y dejó todo impecable.', 5, '2026-01-15 14:00:00.000000', 2, 1, 1),
(2, 'Reparó todo rápido y sin complicaciones. Muy recomendable.', 4, '2026-01-25 12:00:00.000000', 3, 2, 2);

INSERT INTO `notificacion` (`id`, `fecha_creacion`, `leida`, `mensaje`, `usuario_id`) VALUES
(1, '2026-01-15 12:00:00.000000', b'1', 'Tu reserva ha sido confirmada correctamente.',              2),
(2, '2026-01-15 12:01:00.000000', b'0', 'Nueva solicitud de reserva recibida.',                      4),
(3, '2026-01-25 10:30:00.000000', b'1', 'Pago recibido. Muchas gracias.',                            5),
(4, '2026-01-25 10:31:00.000000', b'0', 'Has recibido una nueva valoración ⭐⭐⭐⭐',                4);

-- ────────────────────────────────────────────────────────────
--  FLYWAY — Baseline para que no re-ejecute las migraciones
-- ────────────────────────────────────────────────────────────

INSERT INTO `flyway_schema_history` (`installed_rank`, `version`, `description`, `type`, `script`, `checksum`, `installed_by`, `installed_on`, `execution_time`, `success`) VALUES
(1, '0', '<< Flyway Baseline >>', 'BASELINE', '<< Flyway Baseline >>', NULL, 'root', NOW(), 0, 1);

-- ────────────────────────────────────────────────────────────
--  ÍNDICES Y CLAVES PRIMARIAS
-- ────────────────────────────────────────────────────────────

ALTER TABLE `aud_migracion_conversacion`
  ADD PRIMARY KEY (`auditoria_id`),
  ADD UNIQUE KEY `uk_aud_conversacion_motivo` (`conversacion_id_original`,`motivo`);

ALTER TABLE `aud_migracion_mensaje`
  ADD PRIMARY KEY (`auditoria_id`),
  ADD UNIQUE KEY `uk_aud_mensaje_motivo` (`mensaje_id_original`,`motivo`);

ALTER TABLE `bloqueo_usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_bloqueo` (`bloqueador_id`,`bloqueado_id`),
  ADD KEY `fk_bloqueo_bloqueado` (`bloqueado_id`);

ALTER TABLE `categoria_servicio`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKdh5my7t19ko9kqrgy6wr1acbd` (`nombre`);

ALTER TABLE `conversacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_conversacion_reserva` (`reserva_id`),
  ADD UNIQUE KEY `uk_conversacion_contacto_clave` (`contacto_clave`),
  ADD KEY `idx_conversacion_reserva` (`reserva_id`),
  ADD KEY `idx_conversacion_cliente` (`cliente_id`),
  ADD KEY `idx_conversacion_profesional` (`profesional_id`);

ALTER TABLE `favorito_servicio`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_cliente_servicio` (`cliente_id`,`servicio_id`),
  ADD KEY `FK_favorito_servicio` (`servicio_id`);

ALTER TABLE `flyway_schema_history`
  ADD PRIMARY KEY (`installed_rank`),
  ADD KEY `flyway_schema_history_s_idx` (`success`);

ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_mensaje_conversacion_remitente_client_message` (`conversacion_id`,`remitente_id`,`client_message_id`),
  ADD KEY `FKfi1dp7psgd7wi7n4x7aberitn` (`destinatario_id`),
  ADD KEY `FKdvdwp5crky4couuh3eocowubd` (`remitente_id`),
  ADD KEY `idx_mensaje_conversacion` (`conversacion_id`),
  ADD KEY `fk_mensaje_respondido` (`mensaje_respondido_id`);

ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK5hnclv9lmmc1w4335x04warbm` (`usuario_id`);

ALTER TABLE `pago`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKqj02ydo10plxmxqghwned0ng2` (`reserva_id`);

ALTER TABLE `password_reset_token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKg0guo4k8krgpwuagos61oc06j` (`token`),
  ADD KEY `FKaehv7qqwsde87cy79hxhy4lke` (`usuario_id`);

ALTER TABLE `profesional_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKirqu016ab7f4fbtfeyki7r2bq` (`usuario_id`),
  ADD UNIQUE KEY `UK8elir2r3fk0dta4d06xp8sqag` (`cif`);

ALTER TABLE `resena_profesional`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKcliente_resena` (`cliente_id`),
  ADD KEY `FKprofesional_resena` (`profesional_id`),
  ADD KEY `FKreserva_resena` (`reserva_id`);

ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK82e7s21vcbieo07pamsoyi883` (`cliente_id`),
  ADD KEY `FKb3i33pbfl03tn99pdd0x3tngr` (`servicio_id`);

ALTER TABLE `servicio_ofrecido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKonu2su0b1y4qwq0y4sxq17n9w` (`profesional_id`),
  ADD KEY `FKkpm94273aee38r4lwfrd6yr0f` (`subcategoria_id`);

ALTER TABLE `subcategoria_servicio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKcq2a4sargqm9e0kw48wv3yjv8` (`categoria_id`);

ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK5171l57faosmj8myawaucatdw` (`email`),
  ADD UNIQUE KEY `UKlyn4jrsa2ou2meyuarytj8tcc` (`telefono`);

ALTER TABLE `valoracion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK2i16ciqf8y9qhmh75k0d3t4ai` (`reserva_id`),
  ADD KEY `FKrof74syk8s7qjh9bcwidgaxrd` (`cliente_id`),
  ADD KEY `FKroyv0lu79p3c9ufpbc4j9kvoc` (`profesional_id`);

-- ────────────────────────────────────────────────────────────
--  AUTO_INCREMENT
-- ────────────────────────────────────────────────────────────

ALTER TABLE `aud_migracion_conversacion`  MODIFY `auditoria_id` bigint(20) NOT NULL AUTO_INCREMENT;
ALTER TABLE `aud_migracion_mensaje`       MODIFY `auditoria_id` bigint(20) NOT NULL AUTO_INCREMENT;
ALTER TABLE `bloqueo_usuario`             MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
ALTER TABLE `categoria_servicio`          MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
ALTER TABLE `conversacion`                MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `favorito_servicio`           MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `mensaje`                     MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `notificacion`                MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `pago`                        MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `password_reset_token`        MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `profesional_info`            MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `resena_profesional`          MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
ALTER TABLE `reserva`                     MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `servicio_ofrecido`           MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `subcategoria_servicio`       MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;
ALTER TABLE `usuario`                     MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `valoracion`                  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

-- ────────────────────────────────────────────────────────────
--  CLAVES FORÁNEAS
-- ────────────────────────────────────────────────────────────

ALTER TABLE `bloqueo_usuario`
  ADD CONSTRAINT `fk_bloqueo_bloqueado`   FOREIGN KEY (`bloqueado_id`)   REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bloqueo_bloqueador`  FOREIGN KEY (`bloqueador_id`)  REFERENCES `usuario` (`id`) ON DELETE CASCADE;

ALTER TABLE `conversacion`
  ADD CONSTRAINT `fk_conversacion_cliente`      FOREIGN KEY (`cliente_id`)      REFERENCES `usuario`  (`id`),
  ADD CONSTRAINT `fk_conversacion_profesional`  FOREIGN KEY (`profesional_id`)  REFERENCES `usuario`  (`id`),
  ADD CONSTRAINT `fk_conversacion_reserva`      FOREIGN KEY (`reserva_id`)      REFERENCES `reserva`  (`id`);

ALTER TABLE `favorito_servicio`
  ADD CONSTRAINT `FK_favorito_cliente`  FOREIGN KEY (`cliente_id`)  REFERENCES `usuario`          (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_favorito_servicio` FOREIGN KEY (`servicio_id`) REFERENCES `servicio_ofrecido` (`id`) ON DELETE CASCADE;

ALTER TABLE `mensaje`
  ADD CONSTRAINT `FKdvdwp5crky4couuh3eocowubd` FOREIGN KEY (`remitente_id`)       REFERENCES `usuario`      (`id`),
  ADD CONSTRAINT `FKfi1dp7psgd7wi7n4x7aberitn` FOREIGN KEY (`destinatario_id`)    REFERENCES `usuario`      (`id`),
  ADD CONSTRAINT `fk_mensaje_conversacion`      FOREIGN KEY (`conversacion_id`)    REFERENCES `conversacion` (`id`),
  ADD CONSTRAINT `fk_mensaje_respondido`        FOREIGN KEY (`mensaje_respondido_id`) REFERENCES `mensaje`  (`id`) ON DELETE SET NULL;

ALTER TABLE `notificacion`
  ADD CONSTRAINT `FK5hnclv9lmmc1w4335x04warbm` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

ALTER TABLE `pago`
  ADD CONSTRAINT `FKn8jkfq10o8ctrdwbr6nqjd8yd` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`);

ALTER TABLE `password_reset_token`
  ADD CONSTRAINT `FKaehv7qqwsde87cy79hxhy4lke` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

ALTER TABLE `profesional_info`
  ADD CONSTRAINT `FKm2ck32qs2rkn2n7cr4iphpus2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

ALTER TABLE `resena_profesional`
  ADD CONSTRAINT `FKcliente_resena`    FOREIGN KEY (`cliente_id`)      REFERENCES `usuario`          (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FKprofesional_resena`FOREIGN KEY (`profesional_id`)  REFERENCES `profesional_info` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FKreserva_resena`    FOREIGN KEY (`reserva_id`)      REFERENCES `reserva`          (`id`) ON DELETE SET NULL;

ALTER TABLE `reserva`
  ADD CONSTRAINT `FK82e7s21vcbieo07pamsoyi883` FOREIGN KEY (`cliente_id`)  REFERENCES `usuario`          (`id`),
  ADD CONSTRAINT `FKb3i33pbfl03tn99pdd0x3tngr` FOREIGN KEY (`servicio_id`) REFERENCES `servicio_ofrecido`(`id`);

ALTER TABLE `servicio_ofrecido`
  ADD CONSTRAINT `FKkpm94273aee38r4lwfrd6yr0f` FOREIGN KEY (`subcategoria_id`) REFERENCES `subcategoria_servicio` (`id`),
  ADD CONSTRAINT `FKonu2su0b1y4qwq0y4sxq17n9w` FOREIGN KEY (`profesional_id`)  REFERENCES `profesional_info`      (`id`);

ALTER TABLE `subcategoria_servicio`
  ADD CONSTRAINT `FKcq2a4sargqm9e0kw48wv3yjv8` FOREIGN KEY (`categoria_id`) REFERENCES `categoria_servicio` (`id`);

ALTER TABLE `valoracion`
  ADD CONSTRAINT `FK9w0r9rarfrt9o871xp2s2c43h` FOREIGN KEY (`reserva_id`)      REFERENCES `reserva`          (`id`),
  ADD CONSTRAINT `FKrof74syk8s7qjh9bcwidgaxrd` FOREIGN KEY (`cliente_id`)      REFERENCES `usuario`          (`id`),
  ADD CONSTRAINT `FKroyv0lu79p3c9ufpbc4j9kvoc` FOREIGN KEY (`profesional_id`)  REFERENCES `profesional_info` (`id`);

COMMIT;
