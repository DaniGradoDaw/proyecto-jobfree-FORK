-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-05-2026 a las 21:01:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `jobfree`
--
CREATE DATABASE IF NOT EXISTS `jobfree` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `jobfree`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aud_migracion_conversacion`
--

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aud_migracion_mensaje`
--

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

--
-- Volcado de datos para la tabla `aud_migracion_mensaje`
--

INSERT INTO `aud_migracion_mensaje` (`auditoria_id`, `mensaje_id_original`, `contenido`, `fecha_envio`, `leido`, `destinatario_id`, `remitente_id`, `reserva_id`, `conversacion_id`, `motivo`, `detalle`, `auditado_en`) VALUES
(1, 6, 'Hola, necesito una limpieza profunda del piso.', '2026-03-02 12:40:00.000000', b'1', 1, 3, 2, 2, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(2, 7, 'Perfecto, ¿incluye cocina y baños?', '2026-03-02 12:45:00.000000', b'1', 3, 1, 2, 2, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(3, 8, 'Sí, todo completo.', '2026-03-02 12:46:00.000000', b'1', 1, 3, 2, 2, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(4, 9, 'Genial, lo dejo todo listo.', '2026-03-05 14:30:00.000000', b'1', 3, 1, 2, 2, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(5, 10, 'Buenas, tengo varias cosas pequeñas que arreglar en casa.', '2026-03-04 09:20:00.000000', b'1', 1, 5, 3, 3, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(6, 11, 'Perfecto, soy manitas, dime qué necesitas.', '2026-03-04 09:25:00.000000', b'1', 5, 1, 3, 3, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(7, 12, 'Colgar cuadros y ajustar una puerta.', '2026-03-04 09:27:00.000000', b'1', 1, 5, 3, 3, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(8, 13, 'Hola, tengo un problema eléctrico en casa.', '2026-03-06 08:10:00.000000', b'1', 2, 9, 5, 5, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(9, 14, '¿Qué tipo de problema?', '2026-03-06 08:12:00.000000', b'1', 9, 2, 5, 5, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(10, 15, 'Salta el automático constantemente.', '2026-03-06 08:13:00.000000', b'1', 2, 9, 5, 5, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(11, 16, 'Vale, lo reviso cuando vaya.', '2026-03-06 08:15:00.000000', b'1', 9, 2, 5, 5, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(12, 17, 'Ya funciona todo perfecto, gracias.', '2026-03-08 12:30:00.000000', b'1', 2, 9, 5, 5, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(13, 18, 'Tengo una fuga en el baño, ¿puedes venir?', '2026-03-10 11:10:00.000000', b'1', 3, 17, 9, 9, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(14, 19, 'Sí, ¿es urgente?', '2026-03-10 11:12:00.000000', b'1', 17, 3, 9, 9, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(15, 20, 'Sí, pierde bastante agua.', '2026-03-10 11:13:00.000000', b'1', 3, 17, 9, 9, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(16, 21, 'Voy en camino.', '2026-03-10 11:15:00.000000', b'1', 17, 3, 9, 9, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(17, 22, 'Fuga solucionada 👍', '2026-03-13 18:30:00.000000', b'1', 3, 17, 9, 9, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(18, 23, 'Hola, mi lavadora no funciona.', '2026-03-13 15:10:00.000000', b'1', 4, 1, 12, 12, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(19, 24, '¿Hace algún ruido o no enciende?', '2026-03-13 15:12:00.000000', b'1', 1, 4, 12, 12, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(20, 25, 'No enciende directamente.', '2026-03-13 15:13:00.000000', b'1', 4, 1, 12, 12, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(21, 26, 'Vale, lo reviso mañana.', '2026-03-13 15:15:00.000000', b'1', 1, 4, 12, 12, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(22, 27, 'Busco cuidado para una persona mayor unas horas al día.', '2026-03-08 16:40:00.000000', b'1', 5, 7, 15, 15, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(23, 28, 'Claro, tengo experiencia en ello.', '2026-03-08 16:42:00.000000', b'1', 7, 5, 15, 15, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(24, 29, 'Perfecto, sería por las mañanas.', '2026-03-08 16:43:00.000000', b'1', 5, 7, 15, 15, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(25, 30, 'Quiero empezar a entrenar en casa.', '2026-03-19 10:10:00.000000', b'1', 6, 13, 18, 18, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(26, 31, 'Perfecto, te preparo un plan personalizado.', '2026-03-19 10:12:00.000000', b'1', 13, 6, 18, 18, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714'),
(27, 32, 'Genial, gracias!', '2026-03-19 10:13:00.000000', b'1', 6, 13, 18, 18, 'PARTICIPANTES_MENSAJE_INVALIDOS', 'Remitente o destinatario no pertenecen a la conversacion final', '2026-04-24 10:23:32.026714');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bloqueo_usuario`
--

DROP TABLE IF EXISTS `bloqueo_usuario`;
CREATE TABLE `bloqueo_usuario` (
  `id` bigint(20) NOT NULL,
  `bloqueador_id` bigint(20) NOT NULL,
  `bloqueado_id` bigint(20) NOT NULL,
  `fecha_bloqueo` datetime NOT NULL,
  `motivo` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_servicio`
--

DROP TABLE IF EXISTS `categoria_servicio`;
CREATE TABLE `categoria_servicio` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria_servicio`
--

INSERT INTO `categoria_servicio` (`id`, `nombre`) VALUES
(5, 'Clases'),
(3, 'Cuidado personal'),
(1, 'Mantenimiento'),
(4, 'Mascotas'),
(7, 'Otros'),
(2, 'Reparaciones'),
(6, 'Urgencias');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conversacion`
--

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

--
-- Volcado de datos para la tabla `conversacion`
--

INSERT INTO `conversacion` (`id`, `reserva_id`, `cliente_id`, `profesional_id`, `fecha_creacion`, `contacto_clave`, `ultimo_mensaje_fecha`, `ultimo_mensaje_contenido`, `silenciada_cliente`, `silenciada_profesional`, `silenciada_cliente_hasta`, `silenciada_profesional_hasta`, `fijada_cliente`, `fijada_profesional`) VALUES
(1, 1, 1, 2, '2026-03-01 10:00:00.000000', NULL, '2026-03-03 13:30:00', NULL, 0, 0, NULL, NULL, 0, 0),
(2, 2, 3, 2, '2026-03-02 12:30:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(3, 3, 5, 4, '2026-03-04 09:15:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(4, 4, 7, 4, '2026-03-05 18:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(5, 5, 9, 4, '2026-03-06 08:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(6, 6, 11, 6, '2026-03-07 14:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(7, 7, 13, 6, '2026-03-08 16:30:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(8, 8, 15, 6, '2026-03-09 20:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(9, 9, 17, 8, '2026-03-10 11:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(10, 10, 19, 8, '2026-03-11 13:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(11, 11, 20, 8, '2026-03-12 09:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(12, 12, 1, 8, '2026-03-13 15:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(13, 13, 3, 10, '2026-03-14 10:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(14, 14, 5, 12, '2026-03-15 18:30:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(15, 15, 7, 12, '2026-03-16 08:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(16, 16, 9, 14, '2026-03-17 12:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(17, 17, 11, 14, '2026-03-18 19:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(18, 18, 13, 16, '2026-03-19 10:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(19, 19, 15, 18, '2026-03-20 14:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(20, 20, 17, 18, '2026-03-21 16:00:00.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(32, 21, 22, 44, '2026-04-24 08:30:38.000000', NULL, '2026-05-02 23:05:10', 'Hola Luis!', 0, 0, NULL, NULL, 0, 0),
(33, 23, 22, 2, '2026-04-24 09:31:43.000000', NULL, '2026-05-04 08:36:42', 'Hola, necesito una limpieza profunda en mi casa, sobre todo cocina y baño. Me gustaría hacerlo esta semana si es posible. ¿Tienes disponibilidad y cuánto sería aproximadamente el precio total?', 0, 0, NULL, NULL, 0, 0),
(34, 22, 22, 45, '2026-04-24 10:28:41.000000', NULL, '2026-04-24 10:30:16', 'IIIIE', 0, 0, NULL, NULL, 0, 0),
(35, NULL, 22, 46, '2026-04-29 21:45:33.000000', '22:46', '2026-04-29 21:53:28', 'Nos vemos el jueves?', 0, 0, '9998-12-31 23:00:00', NULL, 0, 0),
(36, NULL, 22, 47, '2026-04-30 07:53:32.000000', '22:47', '2026-05-02 19:33:03', 'así me gustaría', 0, 0, NULL, NULL, 0, 0),
(37, 25, 22, 48, '2026-05-03 00:02:41.000000', NULL, '2026-05-04 09:24:54', 'Hola', 1, 0, NULL, NULL, 0, 1),
(38, NULL, 22, 16, '2026-05-04 08:41:23.000000', '22:16', '2026-05-04 08:41:53', 'Hola, necesito mantenimiento para mi jardín. Habría que cortar el césped, podar algunas plantas y dejarlo un poco arreglado en general. Me gustaría hacerlo esta semana. ¿Tienes disponibilidad y cuá...', 0, 0, NULL, NULL, 0, 0),
(40, 24, 22, 48, '2026-05-04 09:22:51.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(41, 27, 22, 4, '2026-05-04 18:21:31.000000', NULL, '2026-05-04 18:22:14', 'Hola David, necesito instalar varias lámparas en casa (techo y pared). Me gustaría saber disponibilidad en los próximos días . Gracias.', 0, 0, NULL, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favorito_servicio`
--

DROP TABLE IF EXISTS `favorito_servicio`;
CREATE TABLE `favorito_servicio` (
  `id` bigint(20) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `servicio_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `favorito_servicio`
--

INSERT INTO `favorito_servicio` (`id`, `fecha_creacion`, `cliente_id`, `servicio_id`) VALUES
(9, '2026-04-29 08:34:17.000000', 22, 2),
(11, '2026-04-29 09:00:30.000000', 22, 1),
(15, '2026-05-03 21:46:48.000000', 22, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `flyway_schema_history`
--

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

--
-- Volcado de datos para la tabla `flyway_schema_history`
--

INSERT INTO `flyway_schema_history` (`installed_rank`, `version`, `description`, `type`, `script`, `checksum`, `installed_by`, `installed_on`, `execution_time`, `success`) VALUES
(1, '0', '<< Flyway Baseline >>', 'BASELINE', '<< Flyway Baseline >>', NULL, 'root', '2026-04-24 08:23:31', 0, 1),
(2, '1', 'crear conversacion y columna', 'SQL', 'V1__crear_conversacion_y_columna.sql', 445261371, 'root', '2026-04-24 08:23:31', 100, 1),
(3, '2', 'migrar conversaciones', 'SQL', 'V2__migrar_conversaciones.sql', 1742025954, 'root', '2026-04-24 08:23:31', 11, 1),
(4, '3', 'migrar mensajes', 'SQL', 'V3__migrar_mensajes.sql', -1922727584, 'root', '2026-04-24 08:23:31', 9, 1),
(5, '4', 'auditoria y limpieza', 'SQL', 'V4__auditoria_y_limpieza.sql', -1846478535, 'root', '2026-04-24 08:23:32', 53, 1),
(6, '5', 'constraints finales', 'SQL', 'V5__constraints_finales.sql', -182207747, 'root', '2026-04-24 08:23:32', 335, 1),
(7, '6', 'eliminar reserva id', 'SQL', 'V6__eliminar_reserva_id.sql', -1338622269, 'root', '2026-04-24 08:23:32', 36, 1),
(8, '7', 'agregar estado recibido mensaje', 'SQL', 'V7__agregar_estado_recibido_mensaje.sql', 105016931, 'root', '2026-04-24 08:23:32', 15, 1),
(9, '8', 'agregar client message id mensaje', 'SQL', 'V8__agregar_client_message_id_mensaje.sql', -524272741, 'root', '2026-04-24 08:23:32', 70, 1),
(10, '9', 'permitir conversacion sin reserva', 'SQL', 'V9__permitir_conversacion_sin_reserva.sql', -1096838491, 'root', '2026-04-24 08:23:32', 76, 1),
(11, '10', 'forzar eliminacion reserva id mensaje', 'SQL', 'V10__forzar_eliminacion_reserva_id_mensaje.sql', -1196615924, 'root', '2026-04-24 08:23:32', 15, 1),
(12, '11', 'crear tabla favorito servicio', 'SQL', 'V11__crear_tabla_favorito_servicio.sql', -1742868231, 'root', '2026-04-24 09:24:44', 42, 1),
(13, '12', 'crear tabla resena profesional', 'SQL', 'V12__crear_tabla_resena_profesional.sql', 563435192, 'root', '2026-04-24 09:25:18', 17, 1),
(14, '13', 'agregar ultimo mensaje fecha conversacion', 'SQL', 'V13__agregar_ultimo_mensaje_fecha_conversacion.sql', 255495809, 'root', '2026-04-26 14:23:24', 26, 1),
(15, '14', 'agregar ultimo mensaje contenido', 'SQL', 'V14__agregar_ultimo_mensaje_contenido.sql', 588113210, 'root', '2026-04-29 07:14:12', 31, 1),
(16, '15', 'agregar ultima conexion usuario', 'SQL', 'V15__agregar_ultima_conexion_usuario.sql', 485084286, 'root', '2026-04-30 07:33:48', 31, 1),
(17, '16', 'agregar mensaje respondido', 'SQL', 'V16__agregar_mensaje_respondido.sql', -592111175, 'root', '2026-04-30 09:55:31', 48, 1),
(18, '17', 'agregar imagen mensaje', 'SQL', 'V17__agregar_imagen_mensaje.sql', -741973177, 'root', '2026-05-02 19:28:45', 33, 1),
(19, '18', 'agregar silenciada conversacion', 'SQL', 'V18__agregar_silenciada_conversacion.sql', 1772315099, 'root', '2026-05-02 23:41:17', 27, 1),
(20, '19', 'crear tabla bloqueo usuario', 'SQL', 'V19__crear_tabla_bloqueo_usuario.sql', 1382837671, 'root', '2026-05-02 23:41:18', 17, 1),
(21, '20', 'agregar motivo bloqueo', 'SQL', 'V20__agregar_motivo_bloqueo.sql', -470320110, 'root', '2026-05-03 00:27:53', 21, 1),
(22, '21', 'agregar fijada y silenciada hasta conversacion', 'SQL', 'V21__agregar_fijada_y_silenciada_hasta_conversacion.sql', -40203803, 'root', '2026-05-03 12:59:44', 20, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje`
--

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

--
-- Volcado de datos para la tabla `mensaje`
--

INSERT INTO `mensaje` (`id`, `contenido`, `fecha_envio`, `leido`, `destinatario_id`, `remitente_id`, `conversacion_id`, `recibido`, `client_message_id`, `mensaje_respondido_id`, `imagen_url`) VALUES
(1, 'Hola, ¿podrías venir mañana por la mañana para una limpieza general?', '2026-03-01 10:05:00.000000', b'1', 2, 1, 1, b'1', 'e181b416-3fb6-11f1-ade2-00ff69402a40', NULL, NULL),
(2, 'Sí, sin problema. ¿Sobre qué hora te viene mejor?', '2026-03-01 10:10:00.000000', b'1', 1, 2, 1, b'1', 'e181b749-3fb6-11f1-ade2-00ff69402a40', NULL, NULL),
(3, 'A las 9 estaría perfecto.', '2026-03-01 10:12:00.000000', b'1', 2, 1, 1, b'1', 'e181b8a1-3fb6-11f1-ade2-00ff69402a40', NULL, NULL),
(4, 'Perfecto, allí estaré.', '2026-03-01 10:15:00.000000', b'1', 1, 2, 1, b'1', 'e181b9e2-3fb6-11f1-ade2-00ff69402a40', NULL, NULL),
(5, 'Gracias, todo quedó genial 👍', '2026-03-03 13:30:00.000000', b'1', 2, 1, 1, b'1', 'e181bb06-3fb6-11f1-ade2-00ff69402a40', NULL, NULL),
(33, 'Hola Luis, estoy interesado/a en clases de baile urbano. Me gustaría saber horarios, precios y si hay opción para principiantes. ¡Gracias!', '2026-04-24 08:30:38.000000', b'1', 44, 22, 32, b'1', 'aae6de46-a47c-4450-a2c0-dc9ca21bc7d1', NULL, NULL),
(34, '¡Hola! 👋', '2026-04-24 08:32:17.000000', b'1', 22, 44, 32, b'1', 'd242c33c-2e9b-4ee7-8e55-b80ecd079230', NULL, NULL),
(35, 'Sí, hay clases para principiantes. Horarios flexibles y opción individual o en grupo.', '2026-04-24 08:32:21.000000', b'1', 22, 44, 32, b'1', '2f655115-7403-4349-8f66-f02938752f4e', NULL, NULL),
(36, 'Dime tu disponibilidad y te paso precios y opciones', '2026-04-24 08:32:26.000000', b'1', 22, 44, 32, b'1', '844016d9-5d5b-4ed6-ba1a-2bfff0111173', NULL, NULL),
(37, 'Hola buenas', '2026-04-24 09:27:17.000000', b'1', 44, 22, 32, b'1', 'b9f717bd-3c91-4ad7-a05a-c80f48bcbfc0', NULL, NULL),
(38, 'Puedes por la tarde?', '2026-04-24 09:31:43.000000', b'0', 2, 22, 33, b'0', '1d056702-0a4c-451e-8493-8a3f81718794', NULL, NULL),
(39, 'Buenas', '2026-04-24 09:56:43.000000', b'1', 44, 22, 32, b'1', '9b46ae68-bf22-4233-a3a0-6e9664fd7d50', NULL, NULL),
(40, 'Hola buenas', '2026-04-24 10:28:41.000000', b'1', 45, 22, 34, b'1', 'b9e998fa-2096-4cf6-b709-4aedf87257b9', NULL, NULL),
(41, 'IIIIE', '2026-04-24 10:30:16.000000', b'1', 22, 45, 34, b'1', '8bcb6fd5-eaee-4148-8d7f-38ed93124d7e', NULL, NULL),
(42, 'cscscsc', '2026-04-26 14:44:14.000000', b'0', 2, 22, 33, b'0', '03545dfa-b9c2-4914-85c0-ff15bdfe33f3', NULL, NULL),
(43, 'Buenos días, tengo prioridad para contratar el servicio', '2026-04-28 07:28:15.000000', b'0', 2, 22, 33, b'0', '9f9bd730-a645-497e-901e-90e45a4aacb7', NULL, NULL),
(44, 'fc\n+', '2026-04-28 21:52:45.000000', b'0', 2, 22, 33, b'0', '6631085b-e72f-4765-8060-7dc4ac7150f8', NULL, NULL),
(45, 'Buenas noches', '2026-04-28 22:12:28.000000', b'0', 2, 22, 33, b'0', '76048910-5444-462c-9a97-339871cf3f33', NULL, NULL),
(46, 'Buenas noches', '2026-04-28 22:23:12.000000', b'0', 2, 22, 33, b'0', 'f42d4f8d-eecf-4ee7-9f4a-8f5125946ad0', NULL, NULL),
(47, 'Buenos días', '2026-04-29 08:15:10.000000', b'0', 2, 22, 33, b'0', '2654df7d-1e88-4b68-9e32-06e54692205c', NULL, NULL),
(48, 'Ya hablé contigo', '2026-04-29 08:40:52.000000', b'0', 2, 22, 33, b'0', 'fffee887-bb98-4aa3-9218-a8a8ded92df6', NULL, NULL),
(49, 'Hola!', '2026-04-29 09:02:09.000000', b'0', 2, 22, 33, b'0', '13aa2dfe-578a-4efc-aa77-339d3aedf0a2', NULL, NULL),
(50, 'Hola', '2026-04-29 09:09:03.000000', b'0', 2, 22, 33, b'0', '2bcc72a3-784a-4ac6-833e-4efd2c47a32b', NULL, NULL),
(51, 'Buenas', '2026-04-29 09:09:20.000000', b'0', 2, 22, 33, b'0', 'e30ae410-f75e-4ac5-a3db-1511c46a4408', NULL, NULL),
(52, 'N', '2026-04-29 09:09:38.000000', b'0', 2, 22, 33, b'0', 'f13b1236-a348-48f8-a3a3-33e2c780212e', NULL, NULL),
(53, 'Necesito contratarlo', '2026-04-29 09:12:45.000000', b'0', 2, 22, 33, b'0', '15b2a2f3-c511-48f1-8228-4fff4570b5b1', NULL, NULL),
(54, 'Hola!', '2026-04-29 13:37:06.000000', b'0', 2, 22, 33, b'0', '7aacbbd8-6e09-47ab-bea4-c67f97b05494', NULL, NULL),
(55, 'dsdsdsd', '2026-04-29 21:33:43.000000', b'0', 2, 22, 33, b'0', 'f74b14fb-4223-4ee5-9fc3-c601fa4b4fec', NULL, NULL),
(56, '📌 Consulta sobre: Clases de guitarra acústica para principiantes y nivel medio', '2026-04-29 21:45:33.000000', b'1', 46, 22, 35, b'1', 'f49dd86b-c842-43bd-afee-44f59d235996', NULL, NULL),
(57, 'Hola Elsa, busco clases de guitarra acústica. Nivel principiante/intermedio. ¿Tienes disponibilidad y modalidad (online o presencial)? Gracias.', '2026-04-29 21:45:33.000000', b'1', 46, 22, 35, b'1', '3f370940-6adf-4929-8bd9-b88a142892ac', NULL, NULL),
(58, 'Hola, sí, tengo disponibilidad esta semana 😊\nDoy clases tanto presenciales como online. Las presenciales son en Palma del Río.\n\nPara tu nivel (principiante/intermedio) podemos trabajar acordes, ritmo, técnica y canciones que te gusten.\n\nSi quieres, dime qué días y horarios te vienen bien y lo organizamos.', '2026-04-29 21:46:25.000000', b'1', 22, 46, 35, b'1', '408823c8-f47d-4bb6-8cb8-34e77858b643', NULL, NULL),
(59, 'Genial', '2026-04-29 21:48:14.000000', b'1', 46, 22, 35, b'1', '9e801769-308f-4e8e-8f05-bd8489dd19b1', NULL, NULL),
(60, 'Ok', '2026-04-29 21:48:19.000000', b'1', 22, 46, 35, b'1', '38404d57-0f45-4007-90e6-123087ab9859', NULL, NULL),
(61, 'Nos vemos el jueves?', '2026-04-29 21:53:28.000000', b'1', 22, 46, 35, b'1', 'e019e775-99cd-4ec6-8769-22fb76248b3e', NULL, NULL),
(62, '📌 Consulta sobre: Maquillaje profesional a domicilio para eventos y ocasiones especiales', '2026-04-30 07:53:32.000000', b'1', 47, 22, 36, b'1', '92ebf075-7171-4d94-bad0-57f9a220251b', NULL, NULL),
(63, 'Hola Daniel, estoy buscando un servicio de maquillaje a domicilio para un evento que tengo este fin de semana por la tarde. Me gustaría un maquillaje elegante pero natural. Sería en Málaga. ¿Tienes disponibilidad y podrías confirmarme el precio final? ¡Gracias!', '2026-04-30 07:53:32.000000', b'1', 47, 22, 36, b'1', '58612eff-a14f-4ecd-b0db-135f27bbe9e4', NULL, NULL),
(64, 'Hola, sí tengo disponibilidad este fin de semana. El precio es 25€/hora y el maquillaje estaría listo en 1 hora. Si te parece bien, dime la dirección y la hora para confirmarlo.', '2026-04-30 07:55:16.000000', b'1', 22, 47, 36, b'1', '66824dc3-673f-4ef0-b3d9-8802dac1dcb9', NULL, NULL),
(65, 'Si tienes alguna referencia de maquillaje o estilo que te guste, puedes enviármela para adaptarme mejor a lo que buscas.', '2026-04-30 07:55:52.000000', b'1', 22, 47, 36, b'1', '3bcc281b-6f35-44a9-948d-073cbb336507', NULL, NULL),
(66, 'Perfecto, me viene genial 😊 Sería el sábado sobre las 17:00 en Málaga centro. Te puedo enviar una foto del estilo que me gusta. ¿Necesitas algo más por mi parte?', '2026-04-30 08:00:26.000000', b'1', 47, 22, 36, b'1', '3b1d210a-9b7b-4180-b4bc-38fa954a9c4a', NULL, NULL),
(67, 'Perfecto, el sábado a las 17:00 me viene bien 👍 Envíame la referencia cuando quieras. No necesitas nada más, solo tener la piel limpia antes de empezar. Nos vemos ese día 😊', '2026-04-30 08:01:06.000000', b'1', 22, 47, 36, b'1', '8d717b11-3d1e-41d2-8737-59a27d21c7a2', NULL, NULL),
(68, 'ok', '2026-04-30 08:01:22.000000', b'1', 47, 22, 36, b'1', '8a1fdf9e-e24e-4f3d-b642-930bc7c7d0a5', NULL, NULL),
(69, 'Hasta luego!', '2026-04-30 08:01:39.000000', b'1', 22, 47, 36, b'1', '495e0a20-f8b2-4957-896d-568550732517', NULL, NULL),
(70, 'Hola, al final se me complica a las 17:00 😅 ¿Tendrías disponibilidad un poco más tarde?', '2026-04-30 09:16:19.000000', b'1', 47, 22, 36, b'1', '14db57a4-ebf9-4419-a757-7a25a10450ee', NULL, NULL),
(71, 'Sí, sin problema 👍 ¿Sobre qué hora te vendría mejor?', '2026-04-30 09:18:14.000000', b'1', 22, 47, 36, b'1', '7905699d-e337-4516-acfc-5922834e3220', NULL, NULL),
(72, 'Pues sobre las 6', '2026-04-30 09:28:06.000000', b'1', 47, 22, 36, b'1', '50755761-042b-4bbb-b18c-cf453b2f24f2', NULL, NULL),
(73, 'Ok!', '2026-04-30 09:28:38.000000', b'1', 22, 47, 36, b'1', '044c38e0-d107-4081-9fa4-02d15b6776d8', NULL, NULL),
(74, 'Genial', '2026-04-30 09:29:41.000000', b'1', 47, 22, 36, b'1', '4699ad43-8245-41a9-9e62-7ec86dcdb3f5', NULL, NULL),
(75, 'Hola, buenas!!', '2026-05-02 18:32:03.000000', b'1', 47, 22, 36, b'1', 'be723650-5b99-4a32-aec4-a1f1089bd2d4', NULL, NULL),
(76, 'Hola! Dime!', '2026-05-02 18:32:26.000000', b'1', 22, 47, 36, b'1', '0c5cab0e-54f9-4946-b1b5-684ebb2dd206', 75, NULL),
(77, 'Al final ese día no puedo ir', '2026-05-02 18:35:35.000000', b'1', 47, 22, 36, b'1', 'e705b6eb-4c14-4062-a8c2-6ca9031a8cb2', NULL, NULL),
(78, 'Vaya', '2026-05-02 18:42:26.000000', b'1', 22, 47, 36, b'1', '709fa68f-1d7d-41e1-bc9f-6b94a059ad98', 77, NULL),
(79, '😢', '2026-05-02 18:45:39.000000', b'1', 22, 47, 36, b'1', 'd98e904b-138e-4524-bf04-5f884c42ff27', NULL, NULL),
(80, 'No te preocupes', '2026-05-02 19:02:09.000000', b'1', 47, 22, 36, b'1', '499d0e8b-4792-4c3a-b7e1-24effc43cf23', 78, NULL),
(81, 'Cuándo nos vemos?', '2026-05-02 19:02:28.000000', b'1', 47, 22, 36, b'1', '1693dd17-a29d-451c-b677-1e8d0ba1e342', NULL, NULL),
(82, 'Este viernes?', '2026-05-02 19:02:54.000000', b'1', 22, 47, 36, b'1', '9b056fc1-2b64-4264-97cd-cf78eac52410', NULL, NULL),
(83, 'Perfecto', '2026-05-02 19:03:33.000000', b'1', 47, 22, 36, b'1', '74ef9a8f-80ba-40c6-8fa1-0c335058437e', NULL, NULL),
(84, 'Genial', '2026-05-02 19:03:47.000000', b'1', 22, 47, 36, b'1', '68880b84-8769-4c25-b9d9-53008d3c676f', NULL, NULL),
(85, 'Pues en eso quedamos', '2026-05-02 19:05:52.000000', b'1', 22, 47, 36, b'1', 'd4b4d66c-b418-4236-9c43-95c61e73fa2b', NULL, NULL),
(86, 'Perfe! Pues si te parece lo hablamos el día de antes', '2026-05-02 19:07:17.000000', b'1', 47, 22, 36, b'1', 'cf064273-7d24-4274-9cc3-5df3bf330b7a', 85, NULL),
(87, 'Genial', '2026-05-02 19:21:06.000000', b'1', 22, 47, 36, b'1', '4512b7e3-51b8-41a0-8fd5-93f7ed4b3178', NULL, NULL),
(88, 'Hasta luego!', '2026-05-02 19:21:41.000000', b'1', 22, 47, 36, b'1', '92566cd7-93f9-4db9-be45-664a7518fbc9', NULL, NULL),
(89, 'así me gustaría', '2026-05-02 19:33:03.000000', b'1', 47, 22, 36, b'1', 'f6c7645f-50ff-4e66-a899-ae9da1339662', NULL, '/uploads/mensajes/29577f9e-760f-4799-be00-3830ee552df4.jpg'),
(90, 'Hola Luis!', '2026-05-02 23:05:10.000000', b'0', 44, 22, 32, b'0', '29f4784f-f1e1-475b-8792-8386fbaca386', NULL, NULL),
(91, '📌 Consulta sobre: Cambio de cerradura urgente 24h', '2026-05-03 00:02:42.000000', b'1', 48, 22, 37, b'1', '5e4de1d1-147a-440d-90b1-6f84613335cc', NULL, NULL),
(92, 'Hola, necesito cambiar la cerradura de mi casa lo antes posible, a poder ser hoy. ¿Estás disponible y cuánto sería aproximadamente el precio total?', '2026-05-03 00:02:42.000000', b'1', 48, 22, 37, b'1', '86a3a61a-6e17-4e7c-9145-63a0504064c1', NULL, NULL),
(93, 'Hola, sí, estoy disponible hoy. Puedo acercarme en cuanto me confirmes la dirección. El precio suele estar entre 60€ y 90€ según la cerradura. ¿A qué hora te viene bien?', '2026-05-03 00:04:06.000000', b'1', 22, 48, 37, b'1', '86856b2e-f9b2-4162-aec9-4624fa2dabdb', NULL, NULL),
(94, 'Perfecto', '2026-05-03 00:04:30.000000', b'1', 48, 22, 37, b'1', 'fe14b66a-d51f-4110-aed4-f0e4239a7edc', 93, NULL),
(95, 'Sobre las 19 horas', '2026-05-03 00:05:51.000000', b'1', 48, 22, 37, b'1', '38e1a8d3-b0e3-4270-88cf-d0036d824007', NULL, NULL),
(96, 'Podrías?', '2026-05-03 00:06:04.000000', b'1', 48, 22, 37, b'1', 'a5fdcb74-3443-49a5-874d-53e1ce1051e9', NULL, NULL),
(97, 'Sí, me vendría hasta bien', '2026-05-03 00:30:45.000000', b'1', 22, 48, 37, b'1', '8f253d50-f814-48fa-8b30-768470b47626', NULL, NULL),
(98, 'Nos vemos entonces a las 19?', '2026-05-03 00:30:59.000000', b'1', 22, 48, 37, b'1', '188e95cc-88c3-4370-b71e-f5c6af9eff0c', NULL, NULL),
(99, 'mira el problemón', '2026-05-03 00:32:50.000000', b'1', 48, 22, 37, b'1', '0b63a17c-48ec-4c4a-90b8-44beaaa31f53', NULL, '/uploads/mensajes/96393b59-70ce-45be-9f15-5798afebb56e.png'),
(100, 'puff', '2026-05-03 00:33:13.000000', b'1', 22, 48, 37, b'1', '483fee10-aa68-4f7a-898d-9116dd92ab98', NULL, NULL),
(101, 'ya lo veo...', '2026-05-03 00:35:22.000000', b'1', 22, 48, 37, b'1', '62f6adfa-c628-4d61-a8eb-b838120457c8', NULL, NULL),
(102, 'voy a hacer tiempo...', '2026-05-03 00:35:49.000000', b'1', 48, 22, 37, b'1', 'f49482ba-c313-4254-8365-3bf7e1bdb041', NULL, NULL),
(103, 'a ver si puedo intentar arreglarlo', '2026-05-03 00:36:23.000000', b'1', 48, 22, 37, b'1', '06bca222-e7d5-4dd6-8059-fd99d28a32b0', NULL, NULL),
(104, 'no la líes... puede ser peor', '2026-05-03 00:38:38.000000', b'1', 22, 48, 37, b'1', 'd0d3c672-56cd-4382-b684-694b2c5ae348', NULL, NULL),
(105, 'mejor la verdad', '2026-05-03 00:39:06.000000', b'1', 48, 22, 37, b'1', '5b2676b3-c26c-4a20-833b-6774e7b0906a', NULL, NULL),
(106, 'luego nos vemos!', '2026-05-03 00:40:30.000000', b'1', 48, 22, 37, b'1', 'df57caad-35b2-4ad4-aa7f-eecb28945f1b', NULL, NULL),
(107, 'hasta luego!', '2026-05-03 00:40:56.000000', b'1', 22, 48, 37, b'1', 'b82f1ccd-6147-4b05-b37f-56c7389a9eca', 106, NULL),
(108, '👋', '2026-05-03 00:41:15.000000', b'1', 48, 22, 37, b'1', '56bedd92-b585-4072-b378-d03a19f86bc3', NULL, NULL),
(109, 'Buenos días!', '2026-05-03 12:00:48.000000', b'1', 22, 48, 37, b'1', '1885cae8-439d-4436-998c-dfe7ccf0faba', NULL, NULL),
(110, 'Sigo teniendo tu servicio previsto para hoy a las 19:00. No intentes forzar la cerradura para evitar que empeore el problema.', '2026-05-03 12:01:46.000000', b'1', 22, 48, 37, b'1', '331b5a2b-6c8b-4aaa-b4dc-6b75e5567314', NULL, NULL),
(111, 'Estupendo', '2026-05-03 12:03:16.000000', b'1', 48, 22, 37, b'1', '96008ef6-921a-44e9-9be2-3109210d87d9', NULL, NULL),
(112, '🖐️', '2026-05-03 12:12:16.000000', b'1', 22, 48, 37, b'1', 'e9f5ae69-257f-40db-8ba2-bfa7c54ddd9f', NULL, NULL),
(113, 'Hasta luego!', '2026-05-03 12:12:26.000000', b'1', 22, 48, 37, b'1', '21c9a4fa-3e7e-4f9f-bbdc-d7dd343e91fb', NULL, NULL),
(114, '📌 Consulta sobre: Mantenimiento de piscina completo', '2026-05-04 08:21:44.000000', b'1', 48, 22, 37, b'1', '2ea8b4af-869c-400c-91d7-728e4ef1453c', NULL, NULL),
(115, '📌 Consulta sobre: Mantenimiento de piscina completo', '2026-05-04 08:21:50.000000', b'1', 48, 22, 37, b'1', '7176df01-54ae-45b5-ac23-7e258adb4bc8', NULL, NULL),
(116, '📌 Consulta sobre: Mantenimiento de piscina completo', '2026-05-04 08:22:31.000000', b'1', 48, 22, 37, b'1', '3718ef8c-218e-4078-8e0c-8c1bb080c5b0', NULL, NULL),
(117, '📌 Consulta sobre: Mantenimiento de piscina completo', '2026-05-04 08:27:44.000000', b'1', 48, 22, 37, b'1', 'a2070d2d-6d6f-4a51-b991-da7cf6fd62da', NULL, NULL),
(118, 'Hola!', '2026-05-04 08:28:18.000000', b'1', 48, 22, 37, b'1', 'cfa1810a-c652-4433-8090-351175140132', NULL, NULL),
(119, 'Se bugueó el chat', '2026-05-04 08:28:36.000000', b'1', 48, 22, 37, b'1', 'ed9c8e69-1c87-4c6c-82bf-554bf09e5034', NULL, NULL),
(120, 'Buenas!', '2026-05-04 08:28:43.000000', b'1', 48, 22, 37, b'1', 'bfb89542-c84c-46ee-8d43-67279312321a', NULL, NULL),
(121, 'Buenas!', '2026-05-04 08:29:01.000000', b'1', 22, 48, 37, b'1', '66cf18fd-73f8-4b92-83a4-aa0777e9133e', NULL, NULL),
(122, 'Hola, necesito una limpieza profunda en mi casa, sobre todo cocina y baño. Me gustaría hacerlo esta semana si es posible. ¿Tienes disponibilidad y cuánto sería aproximadamente el precio total?', '2026-05-04 08:36:42.000000', b'0', 2, 22, 33, b'0', 'b82ab175-8710-41b9-89aa-eebabbcef50f', NULL, NULL),
(123, '📌 Consulta sobre: Mantenimiento jardín', '2026-05-04 08:41:23.000000', b'0', 16, 22, 38, b'0', '5c54c332-6ec0-475f-9ec3-f4470b96de16', NULL, NULL),
(124, 'Hola, necesito mantenimiento para mi jardín. Habría que cortar el césped, podar algunas plantas y dejarlo un poco arreglado en general. Me gustaría hacerlo esta semana. ¿Tienes disponibilidad y cuánto sería aproximadamente?', '2026-05-04 08:41:53.000000', b'0', 16, 22, 38, b'0', '69e2ceea-b858-4cf1-aa48-812e4349fb61', NULL, NULL),
(125, 'Hola!', '2026-05-04 08:56:55.000000', b'1', 22, 48, 37, b'1', '86c3350c-b387-4df5-8e83-dcfcf19689f1', NULL, NULL),
(126, 'Hola', '2026-05-04 09:24:54.000000', b'1', 22, 48, 37, b'1', '0c23405f-380f-4f27-9439-3d16366c7b3b', NULL, NULL),
(127, '📌 Consulta sobre: Instalación lámparas', '2026-05-04 18:21:31.000000', b'0', 4, 22, 41, b'0', '8b26e182-33a4-496e-bb35-5538e9a9037c', NULL, NULL),
(128, 'Hola David, necesito instalar varias lámparas en casa (techo y pared). Me gustaría saber disponibilidad en los próximos días . Gracias.', '2026-05-04 18:22:14.000000', b'0', 4, 22, 41, b'0', '7fdfb999-4169-4af6-be5a-e93c6bedc497', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
CREATE TABLE `notificacion` (
  `id` bigint(20) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `leida` bit(1) NOT NULL,
  `mensaje` varchar(300) NOT NULL,
  `usuario_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificacion`
--

INSERT INTO `notificacion` (`id`, `fecha_creacion`, `leida`, `mensaje`, `usuario_id`) VALUES
(1, '2026-03-01 10:16:00.000000', b'1', 'Tu reserva ha sido confirmada correctamente.', 1),
(2, '2026-03-02 12:50:00.000000', b'1', 'Tu reserva ha sido confirmada por el profesional.', 3),
(3, '2026-03-04 09:30:00.000000', b'1', 'El profesional ha aceptado tu solicitud.', 5),
(4, '2026-03-05 18:10:00.000000', b'0', 'Tu reserva está pendiente de confirmación.', 7),
(5, '2026-03-03 08:00:00.000000', b'1', 'Recuerda: tienes un servicio programado hoy a las 09:00.', 1),
(6, '2026-03-10 09:00:00.000000', b'0', 'Hoy tienes un servicio programado a las 11:00.', 5),
(7, '2026-03-15 08:00:00.000000', b'0', 'Recordatorio de servicio para hoy.', 13),
(8, '2026-03-03 12:05:00.000000', b'1', 'Pago realizado correctamente.', 1),
(9, '2026-03-05 13:10:00.000000', b'1', 'Pago confirmado en efectivo.', 3),
(10, '2026-03-12 10:05:00.000000', b'0', 'Tienes un pago pendiente de completar.', 7),
(11, '2026-03-20 10:05:00.000000', b'0', 'Pago pendiente asociado a tu reserva.', 20),
(12, '2026-03-01 10:05:30.000000', b'1', 'Nueva solicitud de reserva recibida.', 2),
(13, '2026-03-02 12:41:00.000000', b'1', 'Tienes una nueva solicitud de servicio.', 1),
(14, '2026-03-06 08:11:00.000000', b'1', 'Nuevo cliente ha solicitado tu servicio.', 2),
(15, '2026-03-10 11:11:00.000000', b'1', 'Solicitud urgente recibida.', 3),
(16, '2026-03-03 14:10:00.000000', b'1', 'Has recibido una nueva valoración ⭐⭐⭐⭐⭐', 2),
(17, '2026-03-05 15:10:00.000000', b'1', 'Un cliente ha valorado tu servicio.', 1),
(18, '2026-03-13 19:10:00.000000', b'1', 'Nueva valoración recibida.', 3),
(19, '2026-03-17 15:10:00.000000', b'1', 'Has recibido una valoración de 3 estrellas.', 4),
(20, '2026-03-01 10:05:10.000000', b'1', 'Tienes un nuevo mensaje de un cliente.', 2),
(21, '2026-03-06 08:10:30.000000', b'1', 'Nuevo mensaje recibido.', 2),
(22, '2026-03-10 11:10:30.000000', b'1', 'Tienes un mensaje sin leer.', 3),
(23, '2026-03-18 10:00:00.000000', b'0', 'Tu perfil ha sido actualizado correctamente.', 12),
(24, '2026-03-19 10:15:00.000000', b'0', 'Nuevo servicio disponible en tu zona.', 13),
(25, '2026-03-20 12:00:00.000000', b'0', 'Revisa tus reservas pendientes.', 17),
(26, '2026-04-24 08:33:18.000000', b'0', 'Nueva solicitud de Pablo para el servicio «Baile urbano».', 44),
(27, '2026-04-24 08:33:30.000000', b'1', 'Tu solicitud para «Baile urbano» ha sido aceptada.', 22),
(28, '2026-04-24 08:47:59.000000', b'1', 'El profesional ha marcado «Baile urbano» como completado. ¡Deja tu valoración!', 22),
(29, '2026-04-24 10:30:48.000000', b'0', 'Nueva solicitud de Pablo para el servicio «Reparación de aire acondicionado».', 45),
(30, '2026-04-24 10:31:31.000000', b'1', 'Tu solicitud para «Reparación de aire acondicionado» ha sido aceptada.', 22),
(31, '2026-04-24 10:32:39.000000', b'1', 'El profesional ha marcado «Reparación de aire acondicionado» como completado. ¡Deja tu valoración!', 22),
(32, '2026-04-28 22:23:59.000000', b'0', 'Nueva solicitud de Pablo para el servicio «Limpieza general del hogar».', 2),
(33, '2026-05-04 08:34:33.000000', b'1', 'Nueva solicitud de Pablo para el servicio «Mantenimiento de piscina completo».', 48),
(34, '2026-05-04 08:34:49.000000', b'1', 'Tu solicitud para «Mantenimiento de piscina completo» ha sido aceptada.', 22),
(35, '2026-05-04 09:04:15.000000', b'1', 'Nueva solicitud de Pablo para el servicio «Mantenimiento de piscina completo».', 48),
(36, '2026-05-04 09:05:34.000000', b'1', 'Tu solicitud para «Mantenimiento de piscina completo» ha sido aceptada.', 22),
(37, '2026-05-04 09:25:15.000000', b'1', 'El profesional ha marcado «Mantenimiento de piscina completo» como completado. ¡Deja tu valoración!', 22),
(38, '2026-05-04 09:36:04.000000', b'0', 'Nueva solicitud de Pablo para el servicio «Cambio de cerradura urgente 24h».', 48),
(39, '2026-05-04 09:37:15.000000', b'1', 'Tu solicitud para «Cambio de cerradura urgente 24h» ha sido aceptada.', 22),
(40, '2026-05-04 18:23:17.000000', b'0', 'Nueva solicitud de Pablo para el servicio «Instalación lámparas».', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

DROP TABLE IF EXISTS `pago`;
CREATE TABLE `pago` (
  `id` bigint(20) NOT NULL,
  `estado` enum('PAGADO','PENDIENTE','REEMBOLSADO') NOT NULL,
  `fecha_pago` datetime(6) NOT NULL,
  `importe` decimal(10,2) NOT NULL,
  `metodo` enum('EFECTIVO','TARJETA','TRANSFERENCIA') NOT NULL,
  `reserva_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`id`, `estado`, `fecha_pago`, `importe`, `metodo`, `reserva_id`) VALUES
(1, 'PAGADO', '2026-03-03 12:00:00.000000', 25.00, 'TARJETA', 1),
(2, 'PAGADO', '2026-03-05 13:00:00.000000', 40.00, 'EFECTIVO', 2),
(3, 'PAGADO', '2026-03-08 11:00:00.000000', 50.00, 'TARJETA', 5),
(4, 'PAGADO', '2026-03-13 18:00:00.000000', 45.00, 'TRANSFERENCIA', 9),
(5, 'PAGADO', '2026-03-17 13:00:00.000000', 20.00, 'EFECTIVO', 12),
(6, 'PAGADO', '2026-03-19 10:30:00.000000', 24.00, 'TARJETA', 15),
(7, 'PAGADO', '2026-03-26 10:00:00.000000', 18.00, 'EFECTIVO', 18),
(8, 'PAGADO', '2026-03-10 12:00:00.000000', 30.00, 'TARJETA', 3),
(9, 'PAGADO', '2026-03-11 13:00:00.000000', 28.00, 'EFECTIVO', 6),
(10, 'PAGADO', '2026-03-18 11:00:00.000000', 30.00, 'TRANSFERENCIA', 10),
(11, 'PAGADO', '2026-03-21 12:00:00.000000', 36.00, 'TARJETA', 13),
(12, 'PAGADO', '2026-03-23 11:00:00.000000', 60.00, 'TRANSFERENCIA', 16),
(13, 'PAGADO', '2026-03-27 13:00:00.000000', 50.00, 'TARJETA', 19),
(14, 'PENDIENTE', '2026-03-12 10:00:00.000000', 60.00, 'TARJETA', 4),
(15, 'PENDIENTE', '2026-03-20 10:00:00.000000', 55.00, 'TRANSFERENCIA', 11),
(16, 'PENDIENTE', '2026-05-04 08:35:18.000000', 40.00, 'TARJETA', 24),
(18, 'PENDIENTE', '2026-05-04 09:07:41.000000', 40.00, 'TARJETA', 25),
(19, 'PENDIENTE', '2026-05-04 18:18:49.000000', 30.00, 'TARJETA', 26);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
CREATE TABLE `password_reset_token` (
  `id` bigint(20) NOT NULL,
  `expiracion` datetime(6) NOT NULL,
  `token` varchar(100) NOT NULL,
  `usado` bit(1) NOT NULL,
  `usuario_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `password_reset_token`
--

INSERT INTO `password_reset_token` (`id`, `expiracion`, `token`, `usado`, `usuario_id`) VALUES
(1, '2026-04-24 08:56:33.000000', '175ae9ad-81cc-45df-8b46-4c7d08a91f3d', b'1', 22),
(2, '2026-04-24 11:03:19.000000', '982cd42c-d781-4e6b-b173-d718102bc0f4', b'0', 30),
(3, '2026-04-27 09:57:19.000000', 'dadb03c4-d977-45f0-a32b-0900bd310444', b'0', 22);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesional_info`
--

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

--
-- Volcado de datos para la tabla `profesional_info`
--

INSERT INTO `profesional_info` (`id`, `cif`, `descripcion`, `experiencia`, `nombre_empresa`, `numero_valoraciones`, `plan`, `valoracion_media`, `usuario_id`, `codigo_postal`, `latitud`, `longitud`, `ubicacion_manual`) VALUES
(1, 'B12345678', 'Especialista en mantenimiento del hogar y pequeñas reparaciones domésticas.', 8, 'Servicios Hogar García', 34, 'PREMIUM', 4.6, 2, NULL, NULL, NULL, b'0'),
(2, 'B23456789', 'Electricista profesional con experiencia en instalaciones y averías domésticas.', 10, 'Electricidad Fernández', 52, 'PRO', 4.8, 4, NULL, NULL, NULL, b'0'),
(3, 'B34567890', 'Fontanero especializado en fugas, desatascos y mantenimiento de tuberías.', 7, 'Fontanería Navarro', 28, 'BASICO', 4.3, 6, NULL, NULL, NULL, b'0'),
(4, 'B45678901', 'Técnico en reparación de electrodomésticos y climatización.', 9, 'Reparaciones Delgado', 41, 'PREMIUM', 4.5, 8, NULL, NULL, NULL, b'0'),
(5, 'B56789012', 'Cuidador profesional de personas mayores y dependientes a domicilio.', 6, 'Cuidado Senior Castro', 19, 'BASICO', 4.4, 10, NULL, NULL, NULL, b'0'),
(6, 'B67890123', 'Especialista en entrenamiento personal y bienestar físico en casa.', 5, 'Fitness Serrano', 23, 'PREMIUM', 4.7, 12, NULL, NULL, NULL, b'0'),
(7, 'B78901234', 'Experto en informática a domicilio: reparación, redes y optimización de equipos.', 11, 'Tech Solutions Ibáñez', 60, 'PRO', 4.9, 14, NULL, NULL, NULL, b'0'),
(8, 'B89012345', 'Servicios de jardinería y mantenimiento de exteriores en viviendas.', 8, 'Jardines Peña', 31, 'BASICO', 4.2, 16, NULL, NULL, NULL, b'0'),
(9, 'B90123456', 'Especialista en cuidado de mascotas y adiestramiento canino en domicilio.', 6, 'Mascotas Herrera', 27, 'PREMIUM', 4.6, 18, NULL, NULL, NULL, b'0'),
(10, NULL, 'Soy un trabajador con experiencia en mi sector y con mucha motivación', 5, 'García Ruiz S.L.', 0, 'BASICO', 0, 39, '14900', NULL, NULL, b'0'),
(11, NULL, 'Perfil en construcción', 35, 'Berger', 0, 'BASICO', 0, 42, '14900', NULL, NULL, b'0'),
(12, NULL, 'Perfil en construcción', 0, NULL, 1, 'BASICO', 3, 44, NULL, 37.55223076605486, -5.08160566576258, b'1'),
(13, NULL, 'Perfil en construcción', 0, NULL, 0, 'BASICO', 0, 45, NULL, NULL, NULL, b'0'),
(14, NULL, 'Perfil en construcción', 0, NULL, 0, 'BASICO', 0, 46, NULL, NULL, NULL, b'0'),
(15, NULL, 'Perfil en construcción', 0, NULL, 0, 'BASICO', 0, 47, NULL, NULL, NULL, b'0'),
(16, NULL, 'Perfil en construcción', 0, NULL, 1, 'BASICO', 4, 48, NULL, NULL, NULL, b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resena_profesional`
--

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

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

--
-- Volcado de datos para la tabla `reserva`
--

INSERT INTO `reserva` (`id`, `estado`, `fecha_creacion`, `fecha_inicio`, `precio_total`, `cliente_id`, `servicio_id`, `descripcion`, `progreso`, `notas_progreso`) VALUES
(1, 'COMPLETADA', '2026-03-01 10:00:00.000000', '2026-03-03 09:00:00.000000', 25.00, 1, 1, NULL, 0, NULL),
(2, 'COMPLETADA', '2026-03-02 12:30:00.000000', '2026-03-05 10:00:00.000000', 40.00, 3, 2, NULL, 0, NULL),
(3, 'CONFIRMADA', '2026-03-04 09:15:00.000000', '2026-03-10 11:00:00.000000', 30.00, 5, 5, NULL, 0, NULL),
(4, 'PENDIENTE', '2026-03-05 18:00:00.000000', '2026-03-12 16:00:00.000000', 60.00, 7, 6, NULL, 0, NULL),
(5, 'COMPLETADA', '2026-03-06 08:00:00.000000', '2026-03-08 09:30:00.000000', 50.00, 9, 7, NULL, 0, NULL),
(6, 'CONFIRMADA', '2026-03-07 14:00:00.000000', '2026-03-11 12:00:00.000000', 28.00, 11, 10, NULL, 0, NULL),
(7, 'PENDIENTE', '2026-03-08 16:30:00.000000', '2026-03-15 10:00:00.000000', 35.00, 13, 11, NULL, 0, NULL),
(8, 'CANCELADA', '2026-03-09 20:00:00.000000', '2026-03-16 09:00:00.000000', 22.00, 15, 12, NULL, 0, NULL),
(9, 'COMPLETADA', '2026-03-10 11:00:00.000000', '2026-03-13 17:00:00.000000', 45.00, 17, 13, NULL, 0, NULL),
(10, 'CONFIRMADA', '2026-03-11 13:00:00.000000', '2026-03-18 10:00:00.000000', 30.00, 19, 14, NULL, 0, NULL),
(11, 'PENDIENTE', '2026-03-12 09:00:00.000000', '2026-03-20 09:00:00.000000', 55.00, 20, 15, NULL, 0, NULL),
(12, 'COMPLETADA', '2026-03-13 15:00:00.000000', '2026-03-17 12:00:00.000000', 20.00, 1, 16, NULL, 0, NULL),
(13, 'CONFIRMADA', '2026-03-14 10:00:00.000000', '2026-03-21 11:00:00.000000', 36.00, 3, 18, NULL, 0, NULL),
(14, 'PENDIENTE', '2026-03-15 18:30:00.000000', '2026-03-22 16:00:00.000000', 40.00, 5, 20, NULL, 0, NULL),
(15, 'COMPLETADA', '2026-03-16 08:00:00.000000', '2026-03-19 09:00:00.000000', 24.00, 7, 22, NULL, 0, NULL),
(16, 'CONFIRMADA', '2026-03-17 12:00:00.000000', '2026-03-23 10:30:00.000000', 60.00, 9, 23, NULL, 0, NULL),
(17, 'CANCELADA', '2026-03-18 19:00:00.000000', '2026-03-25 18:00:00.000000', 32.00, 11, 24, NULL, 0, NULL),
(18, 'COMPLETADA', '2026-03-19 10:00:00.000000', '2026-03-26 09:00:00.000000', 18.00, 13, 27, NULL, 0, NULL),
(19, 'CONFIRMADA', '2026-03-20 14:00:00.000000', '2026-03-27 12:00:00.000000', 50.00, 15, 30, NULL, 0, NULL),
(20, 'PENDIENTE', '2026-03-21 16:00:00.000000', '2026-03-28 11:00:00.000000', 45.00, 17, 32, NULL, 0, NULL),
(21, 'COMPLETADA', '2026-04-24 08:33:18.000000', '2026-05-05 16:30:00.000000', 14.00, 22, 35, 'Hola Luis, quiero reservar una clase de baile urbano el 24/04/2026 a las 09:30. Soy principiante y me gustaría empezar desde lo básico. Gracias.', 0, NULL),
(22, 'COMPLETADA', '2026-04-24 10:30:48.000000', '2026-05-01 14:30:00.000000', 10.00, 22, 36, 'Ahí nos vemos', 0, NULL),
(23, 'CANCELADA', '2026-04-28 22:23:59.000000', '2026-07-25 10:00:00.000000', 25.00, 22, 1, 'Necesito limpieza general tras una gran fiesta', 0, NULL),
(24, 'CANCELADA', '2026-05-04 08:34:33.000000', '2026-05-20 13:37:00.000000', 40.00, 22, 40, '', 0, NULL),
(25, 'COMPLETADA', '2026-05-04 09:04:15.000000', '2026-05-20 14:00:00.000000', 40.00, 22, 40, 'Hola, he visto que se ha cancelado el servicio anterior. Sigo necesitando el mantenimiento de la piscina, así que quería saber si tienes otra disponibilidad para esta semana. Me vendría bien cualquier día por la tarde. ¿Podrías confirmarme?', 0, NULL),
(26, 'CONFIRMADA', '2026-05-04 09:36:04.000000', '2026-05-04 10:34:00.000000', 30.00, 22, 39, 'Necesito un cambio de cerradura urgente en mi vivienda. He perdido las llaves', 0, NULL),
(27, 'PENDIENTE', '2026-05-04 18:23:17.000000', '2026-05-10 15:00:00.000000', 22.00, 22, 8, '', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio_ofrecido`
--

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

--
-- Volcado de datos para la tabla `servicio_ofrecido`
--

INSERT INTO `servicio_ofrecido` (`id`, `activa`, `descripcion`, `duracion_min`, `precio_hora`, `titulo`, `profesional_id`, `subcategoria_id`) VALUES
(1, b'1', 'Servicio completo de limpieza general en viviendas.', 120, 12.50, 'Limpieza general del hogar', 1, 1),
(2, b'1', 'Limpieza profunda incluyendo cocina y baños.', 180, 14.00, 'Limpieza profunda', 1, 2),
(3, b'1', 'Servicio de manitas para tareas básicas del hogar.', 90, 15.00, 'Manitas a domicilio', 1, 5),
(4, b'1', 'Organización y orden de espacios domésticos.', 120, 13.00, 'Organización del hogar', 1, 21),
(5, b'1', 'Reparación de averías eléctricas en domicilio.', 60, 25.00, 'Reparación eléctrica', 2, 26),
(6, b'1', 'Sustitución de enchufes y puntos eléctricos.', 45, 20.00, 'Cambio de enchufes', 2, 27),
(7, b'1', 'Revisión de cuadro eléctrico completo.', 90, 30.00, 'Revisión cuadro eléctrico', 2, 29),
(8, b'1', 'Instalación de iluminación en vivienda.', 60, 22.00, 'Instalación lámparas', 2, 7),
(9, b'1', 'Reparación de fugas de agua en tuberías.', 60, 28.00, 'Reparación de fugas', 3, 31),
(10, b'1', 'Desatascos en fregaderos y tuberías.', 45, 25.00, 'Desatascos', 3, 33),
(11, b'1', 'Reparación de grifos y sanitarios.', 50, 22.00, 'Reparación grifos', 3, 32),
(12, b'1', 'Mantenimiento general de fontanería doméstica.', 90, 30.00, 'Mantenimiento fontanería', 3, 30),
(13, b'1', 'Reparación de lavadoras a domicilio.', 60, 30.00, 'Reparación lavadora', 4, 39),
(14, b'1', 'Reparación de frigoríficos.', 70, 32.00, 'Reparación frigorífico', 4, 40),
(15, b'1', 'Reparación de hornos domésticos.', 60, 28.00, 'Reparación horno', 4, 41),
(16, b'1', 'Reparación de lavavajillas.', 65, 30.00, 'Reparación lavavajillas', 4, 42),
(17, b'1', 'Cuidado de personas mayores en domicilio.', 180, 12.00, 'Cuidado de mayores', 5, 51),
(18, b'1', 'Servicio de acompañamiento en casa.', 120, 10.00, 'Acompañamiento', 5, 53),
(19, b'1', 'Cuidado de niños por horas.', 120, 11.00, 'Cuidado de niños', 5, 55),
(20, b'1', 'Entrenamiento personal adaptado en casa.', 60, 20.00, 'Entrenador personal', 6, 68),
(21, b'1', 'Clases de yoga personalizadas.', 60, 18.00, 'Yoga en casa', 6, 69),
(22, b'1', 'Sesiones de pilates a domicilio.', 60, 18.00, 'Pilates en casa', 6, 70),
(23, b'1', 'Reparación de ordenadores en domicilio.', 60, 25.00, 'Reparación PC', 7, 147),
(24, b'1', 'Configuración de redes WiFi en casa.', 60, 22.00, 'Configuración WiFi', 7, 159),
(25, b'1', 'Optimización de equipos informáticos.', 90, 27.00, 'Optimización PC', 7, 160),
(26, b'1', 'Recuperación de datos en equipos.', 120, 35.00, 'Recuperación de datos', 7, 148),
(27, b'1', 'Mantenimiento general de jardines.', 120, 18.00, 'Mantenimiento jardín', 8, 8),
(28, b'1', 'Poda de plantas y arbustos.', 90, 17.00, 'Poda de plantas', 8, 9),
(29, b'1', 'Corte de césped en domicilio.', 60, 15.00, 'Corte de césped', 8, 10),
(30, b'1', 'Paseo de perros diario.', 60, 10.00, 'Paseo de perros', 9, 76),
(31, b'1', 'Cuidado de mascotas en casa.', 120, 12.00, 'Cuidado de mascotas', 9, 77),
(32, b'1', 'Adiestramiento canino básico.', 90, 18.00, 'Adiestramiento básico', 9, 83),
(33, b'1', 'Baile latino en sala', 60, 12.50, 'Baile latino', 10, 120),
(34, b'1', 'Clases particulares de Alemán', 60, 12.50, 'Alemán básico', 11, 126),
(35, b'1', 'Clases de baile urbano para todos los niveles. Aprende hip hop y coreografías actuales de forma rápida y divertida. Mejora tu ritmo, coordinación y confianza mientras disfrutas.', 60, 14.00, 'Baile urbano', 12, 119),
(36, b'1', 'Reparo aires', 60, 10.00, 'Reparación de aire acondicionado', 13, 37),
(37, b'1', 'Ofrezco clases personalizadas de guitarra acústica adaptadas a tu nivel. Aprenderás acordes, ritmos, técnicas básicas y canciones desde el primer día. Las clases son dinámicas y prácticas, ideales tanto para principiantes como para quienes quieren mejorar su técnica.', 60, 15.00, 'Clases de guitarra acústica para principiantes y nivel medio', 14, 114),
(38, b'1', 'Maquillaje a domicilio para eventos, día o noche. Me adapto a tu estilo (natural o glam) y utilizo productos de buena calidad para un resultado duradero. Incluye asesoramiento básico.', 60, 25.00, 'Maquillaje profesional a domicilio para eventos y ocasiones especiales', 15, 60),
(39, b'1', 'Cerrajero rápido y fiable. Cambio de cerraduras, apertura de puertas y reparación. Servicio urgente en el día.', 60, 30.00, 'Cambio de cerradura urgente 24h', 16, 134),
(40, b'1', 'Limpieza, control de cloro y pH, revisión de filtros y mantenimiento general. Servicio puntual o periódico para mantener el agua en perfecto estado.', 120, 20.00, 'Mantenimiento de piscina completo', 16, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategoria_servicio`
--

DROP TABLE IF EXISTS `subcategoria_servicio`;
CREATE TABLE `subcategoria_servicio` (
  `id` bigint(20) NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `imagen` varchar(200) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `categoria_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subcategoria_servicio`
--

INSERT INTO `subcategoria_servicio` (`id`, `descripcion`, `imagen`, `nombre`, `categoria_id`) VALUES
(1, 'Limpieza general de viviendas', '/images/servicios/mantenimiento/limpieza_hogar.jpg', 'Limpieza del hogar', 1),
(2, 'Limpieza intensiva de toda la casa', '/images/servicios/mantenimiento/limpieza_profunda.jpg', 'Limpieza profunda', 1),
(3, 'Limpieza tras reformas o mudanzas', '/images/servicios/mantenimiento/post_obra.jpg', 'Limpieza post obra', 1),
(4, 'Revisión y mantenimiento básico del hogar', '/images/servicios/mantenimiento/mantenimiento_general.jpg', 'Mantenimiento general del hogar', 1),
(5, 'Servicio general de manitas para tareas básicas', '/images/servicios/mantenimiento/manitas.jpg', 'Servicio de manitas', 1),
(6, 'Sustitución de bombillas y luminarias', '/images/servicios/mantenimiento/bombillas.jpg', 'Cambio de bombillas', 1),
(7, 'Montaje de lámparas y focos en vivienda', '/images/servicios/mantenimiento/lamparas.jpg', 'Instalación de lámparas', 1),
(8, 'Cuidado y mantenimiento de jardines privados', '/images/servicios/mantenimiento/jardin.jpg', 'Mantenimiento de jardín', 1),
(9, 'Poda de plantas y arbustos en domicilio', '/images/servicios/mantenimiento/poda.jpg', 'Poda de plantas', 1),
(10, 'Corte de césped en viviendas particulares', '/images/servicios/mantenimiento/cesped.jpg', 'Corte de césped', 1),
(11, 'Instalación y ajuste de sistemas de riego', '/images/servicios/mantenimiento/riego.jpg', 'Instalación de riego', 1),
(12, 'Mantenimiento básico de piscinas privadas', '/images/servicios/mantenimiento/piscina.png', 'Mantenimiento de piscina', 1),
(13, 'Limpieza de piscinas en domicilio', '/images/servicios/mantenimiento/piscina_limpieza.jpg', 'Limpieza de piscina', 1),
(14, 'Control de niveles de cloro y pH', '/images/servicios/mantenimiento/piscina_ph.png', 'Control químico piscina', 1),
(15, 'Limpieza de garajes y trasteros particulares', '/images/servicios/mantenimiento/garaje.png', 'Limpieza de garaje', 1),
(16, 'Mantenimiento de espacios exteriores de la vivienda', '/images/servicios/mantenimiento/exterior.png', 'Mantenimiento de exteriores', 1),
(17, 'Limpieza de cristales y ventanas', '/images/servicios/mantenimiento/cristales.jpg', 'Limpieza de cristales', 1),
(18, 'Limpieza de sofás y tapicería en domicilio', '/images/servicios/mantenimiento/sofa.png', 'Limpieza de sofás', 1),
(19, 'Limpieza profesional de alfombras', '/images/servicios/mantenimiento/alfombras.png', 'Limpieza de alfombras', 1),
(20, 'Servicio de planchado a domicilio', '/images/servicios/mantenimiento/planchado.jpg', 'Planchado a domicilio', 1),
(21, 'Organización de espacios y armarios', '/images/servicios/mantenimiento/organizacion.jpg', 'Organización del hogar', 1),
(22, 'Apoyo en tareas domésticas diarias', '/images/servicios/mantenimiento/asistencia.jpg', 'Asistencia doméstica', 1),
(23, 'Desinfección completa del hogar', '/images/servicios/mantenimiento/desinfeccion.png', 'Desinfección del hogar', 1),
(24, 'Tratamiento básico contra insectos en vivienda', '/images/servicios/mantenimiento/plagas.png', 'Control básico de plagas', 1),
(25, 'Limpieza de terrazas, patios y balcones', '/images/servicios/mantenimiento/terraza.png', 'Limpieza de terraza', 1),
(26, 'Reparación de instalaciones eléctricas en vivienda', '/images/servicios/reparaciones/electricidad.png', 'Reparación eléctrica', 2),
(27, 'Sustitución de enchufes dañados', '/images/servicios/reparaciones/enchufes.jpg', 'Reparación de enchufes', 2),
(28, 'Cambio de interruptores defectuosos', '/images/servicios/reparaciones/interruptores.png', 'Reparación de interruptores', 2),
(29, 'Revisión y arreglo de cuadros eléctricos', '/images/servicios/reparaciones/cuadro.png', 'Reparación de cuadro eléctrico', 2),
(30, 'Reparación de tuberías y sistemas de agua', '/images/servicios/reparaciones/fontaneria.jpg', 'Reparación de fontanería', 2),
(31, 'Detección y reparación de fugas de agua', '/images/servicios/reparaciones/fugas.png', 'Reparación de fugas', 2),
(32, 'Reparación de grifos y sanitarios', '/images/servicios/reparaciones/grifos.png', 'Reparación de grifos', 2),
(33, 'Desatascos en tuberías domésticas', '/images/servicios/reparaciones/desatascos.jpg', 'Desatascos', 2),
(34, 'Reparación de sistemas de calefacción', '/images/servicios/reparaciones/calefaccion.jpg', 'Reparación de calefacción', 2),
(35, 'Reparación de radiadores en vivienda', '/images/servicios/reparaciones/radiadores.png', 'Reparación de radiadores', 2),
(36, 'Reparación de calderas domésticas', '/images/servicios/reparaciones/caldera.png', 'Reparación de calderas', 2),
(37, 'Reparación de aire acondicionado', '/images/servicios/reparaciones/aire.png', 'Reparación de aire acondicionado', 2),
(38, 'Recarga de gas en equipos de aire', '/images/servicios/reparaciones/gas.png', 'Carga de gas aire acondicionado', 2),
(39, 'Reparación de lavadoras', '/images/servicios/reparaciones/lavadora.png', 'Reparación de lavadoras', 2),
(40, 'Reparación de frigoríficos', '/images/servicios/reparaciones/frigorifico.png', 'Reparación de frigoríficos', 2),
(41, 'Reparación de hornos', '/images/servicios/reparaciones/horno.jpg', 'Reparación de hornos', 2),
(42, 'Reparación de lavavajillas', '/images/servicios/reparaciones/lavavajillas.png', 'Reparación de lavavajillas', 2),
(43, 'Reparación de microondas', '/images/servicios/reparaciones/microondas.png', 'Reparación de microondas', 2),
(44, 'Reparación de persianas domésticas', '/images/servicios/reparaciones/persianas.png', 'Reparación de persianas', 2),
(45, 'Reparación de puertas en vivienda', '/images/servicios/reparaciones/puertas.jpg', 'Reparación de puertas', 2),
(46, 'Reparación de ventanas', '/images/servicios/reparaciones/ventanas.png', 'Reparación de ventanas', 2),
(47, 'Reparación de cerraduras', '/images/servicios/reparaciones/cerraduras.jpg', 'Reparación de cerraduras', 2),
(48, 'Reparación de muebles dañados', '/images/servicios/reparaciones/muebles.jpg', 'Reparación de muebles', 2),
(49, 'Reparación de suelos y parquet', '/images/servicios/reparaciones/suelos.png', 'Reparación de suelos', 2),
(50, 'Reparación de filtraciones y goteras', '/images/servicios/reparaciones/goteras.jpg', 'Reparación de goteras', 2),
(51, 'Atención y cuidado de personas mayores en domicilio', '/images/servicios/cuidado/mayores.jpg', 'Cuidado de mayores', 3),
(52, 'Atención a personas dependientes en casa', '/images/servicios/cuidado/dependientes.png', 'Cuidado de dependientes', 3),
(53, 'Acompañamiento diario en el hogar', '/images/servicios/cuidado/acompanamiento.jpg', 'Acompañamiento en casa', 3),
(54, 'Cuidado nocturno de personas en domicilio', '/images/servicios/cuidado/nocturno.png', 'Cuidado nocturno', 3),
(55, 'Cuidado de niños en casa', '/images/servicios/cuidado/ninos.png', 'Cuidado de niños', 3),
(56, 'Servicio de niñera por horas', '/images/servicios/cuidado/ninera.png', 'Niñera a domicilio', 3),
(57, 'Cuidado de bebés en domicilio', '/images/servicios/cuidado/bebes.png', 'Cuidado de bebés', 3),
(58, 'Apoyo escolar infantil en casa', '/images/servicios/cuidado/escolar.png', 'Apoyo escolar en casa', 3),
(59, 'Servicio de peluquería a domicilio', '/images/servicios/cuidado/peluqueria.png', 'Peluquería a domicilio', 3),
(60, 'Maquillaje profesional en casa', '/images/servicios/cuidado/maquillaje.png', 'Maquillaje a domicilio', 3),
(61, 'Manicura en domicilio', '/images/servicios/cuidado/manicura.jpg', 'Manicura a domicilio', 3),
(62, 'Pedicura en casa', '/images/servicios/cuidado/pedicura.png', 'Pedicura a domicilio', 3),
(63, 'Depilación en domicilio', '/images/servicios/cuidado/depilacion.jpg', 'Depilación a domicilio', 3),
(64, 'Tratamientos estéticos en casa', '/images/servicios/cuidado/estetica.png', 'Estética a domicilio', 3),
(65, 'Masajes relajantes en domicilio', '/images/servicios/cuidado/masajes.jpg', 'Masajes a domicilio', 3),
(66, 'Fisioterapia en casa', '/images/servicios/cuidado/fisio.jpg', 'Fisioterapia a domicilio', 3),
(67, 'Rehabilitación física en domicilio', '/images/servicios/cuidado/rehabilitacion.jpg', 'Rehabilitación en casa', 3),
(68, 'Entrenamiento personal en casa', '/images/servicios/cuidado/entrenador.jpg', 'Entrenador personal', 3),
(69, 'Clases de yoga en domicilio', '/images/servicios/cuidado/yoga.jpg', 'Yoga a domicilio', 3),
(70, 'Clases de pilates en casa', '/images/servicios/cuidado/pilates.png', 'Pilates a domicilio', 3),
(71, 'Asistencia postoperatoria en domicilio', '/images/servicios/cuidado/postoperatorio.png', 'Asistencia postoperatoria', 3),
(72, 'Ayuda en tareas personales diarias', '/images/servicios/cuidado/ayuda.jpg', 'Ayuda personal diaria', 3),
(73, 'Servicio de cuidado por horas', '/images/servicios/cuidado/horas.png', 'Cuidado por horas', 3),
(74, 'Cuidado interno en domicilio (larga estancia)', '/images/servicios/cuidado/interno.jpg', 'Cuidado interno', 3),
(75, 'Asesoramiento nutricional en casa', '/images/servicios/cuidado/nutricion.png', 'Nutricionista a domicilio', 3),
(76, 'Paseo de perros desde el domicilio del cliente', '/images/servicios/mascotas/paseo_perros.png', 'Paseo de perros', 4),
(77, 'Cuidado de perros en casa del cliente', '/images/servicios/mascotas/cuidado_perros.jpg', 'Cuidado de perros en casa', 4),
(78, 'Cuidado de gatos en el domicilio', '/images/servicios/mascotas/cuidado_gatos.png', 'Cuidado de gatos', 4),
(79, 'Cuidado de mascotas por horas', '/images/servicios/mascotas/horas.png', 'Cuidado por horas', 4),
(80, 'Cuidado nocturno de mascotas en casa', '/images/servicios/mascotas/nocturno.png', 'Cuidado nocturno de mascotas', 4),
(81, 'Cuidado de mascotas durante vacaciones', '/images/servicios/mascotas/vacaciones.jpeg', 'Cuidado en vacaciones', 4),
(82, 'Visitas a domicilio para alimentar mascotas', '/images/servicios/mascotas/visitas.jpg', 'Visitas a domicilio', 4),
(83, 'Adiestramiento canino básico en casa', '/images/servicios/mascotas/adiestramiento.jpg', 'Adiestramiento básico', 4),
(84, 'Adiestramiento avanzado y corrección de conducta', '/images/servicios/mascotas/adiestramiento_avanzado.png', 'Adiestramiento avanzado', 4),
(85, 'Socialización de perros en entorno doméstico', '/images/servicios/mascotas/socializacion.png', 'Socialización canina', 4),
(86, 'Peluquería canina a domicilio', '/images/servicios/mascotas/peluqueria.jpg', 'Peluquería canina', 4),
(87, 'Baño de mascotas en casa', '/images/servicios/mascotas/bano.png', 'Baño de mascotas', 4),
(88, 'Corte de uñas para mascotas', '/images/servicios/mascotas/unas.png', 'Corte de uñas', 4),
(89, 'Veterinario a domicilio', '/images/servicios/mascotas/veterinario.jpg', 'Veterinario a domicilio', 4),
(90, 'Administración de medicación a mascotas', '/images/servicios/mascotas/medicacion.jpg', 'Administración de medicación', 4),
(91, 'Cuidado de aves en domicilio', '/images/servicios/mascotas/aves.png', 'Cuidado de aves', 4),
(92, 'Cuidado de reptiles en casa', '/images/servicios/mascotas/reptiles.jpg', 'Cuidado de reptiles', 4),
(93, 'Cuidado de roedores y pequeños animales', '/images/servicios/mascotas/roedores.png', 'Cuidado de roedores', 4),
(94, 'Cuidado de peces y acuarios en domicilio', '/images/servicios/mascotas/peces.jpg', 'Cuidado de peces', 4),
(95, 'Mantenimiento y limpieza de acuarios', '/images/servicios/mascotas/acuario.jpg', 'Mantenimiento de acuarios', 4),
(96, 'Transporte de mascotas desde el domicilio', '/images/servicios/mascotas/transporte.png', 'Transporte de mascotas', 4),
(97, 'Acompañamiento a citas veterinarias', '/images/servicios/mascotas/acompanamiento.jpeg', 'Acompañamiento veterinario', 4),
(98, 'Alimentación programada de mascotas en casa', '/images/servicios/mascotas/comida.png', 'Alimentación programada', 4),
(99, 'Ejercicio guiado para mascotas en domicilio', '/images/servicios/mascotas/ejercicio.png', 'Ejercicio para mascotas', 4),
(100, 'Limpieza de espacios de mascotas en casa', '/images/servicios/mascotas/limpieza.png', 'Limpieza de zonas de mascotas', 4),
(101, 'Refuerzo de matemáticas nivel primaria en domicilio', '/images/servicios/clases/matematicas_primaria.png', 'Matemáticas primaria', 5),
(102, 'Apoyo en matemáticas nivel secundaria', '/images/servicios/clases/matematicas_eso.png', 'Matemáticas ESO', 5),
(103, 'Preparación de matemáticas nivel bachillerato', '/images/servicios/clases/matematicas_bachiller.png', 'Matemáticas bachillerato', 5),
(104, 'Clases de inglés conversación en casa', '/images/servicios/clases/ingles_speaking.png', 'Inglés conversación', 5),
(105, 'Refuerzo de gramática inglesa en domicilio', '/images/servicios/clases/ingles_grammar.jpg', 'Inglés gramática', 5),
(106, 'Clases de lengua y sintaxis en casa', '/images/servicios/clases/lengua.png', 'Lengua y sintaxis', 5),
(107, 'Clases de física nivel bachillerato en domicilio', '/images/servicios/clases/fisica.png', 'Física bachillerato', 5),
(108, 'Clases de química nivel bachillerato en casa', '/images/servicios/clases/quimica.png', 'Química bachillerato', 5),
(109, 'Clases de programación Java a domicilio', '/images/servicios/clases/programacion_java.png', 'Programación Java', 5),
(110, 'Clases de desarrollo web (HTML, CSS, JS)', '/images/servicios/clases/programacion_web.jpg', 'Programación web', 5),
(111, 'Clases de bases de datos SQL en casa', '/images/servicios/clases/bd_sql.png', 'Bases de datos SQL', 5),
(112, 'Clases de informática básica para principiantes', '/images/servicios/clases/informatica.jpeg', 'Informática básica', 5),
(113, 'Clases de guitarra eléctrica en domicilio', '/images/servicios/clases/guitarra_electrica.png', 'Guitarra eléctrica', 5),
(114, 'Clases de guitarra acústica en casa', '/images/servicios/clases/guitarra_acustica.png', 'Guitarra acústica', 5),
(115, 'Clases de piano para principiantes', '/images/servicios/clases/piano.png', 'Piano básico', 5),
(116, 'Clases de canto moderno en domicilio', '/images/servicios/clases/canto.png', 'Canto moderno', 5),
(117, 'Clases de dibujo artístico en casa', '/images/servicios/clases/dibujo.png', 'Dibujo artístico', 5),
(118, 'Clases de pintura acrílica a domicilio', '/images/servicios/clases/pintura.jpg', 'Pintura acrílica', 5),
(119, 'Clases de baile urbano en casa', '/images/servicios/clases/baile_urbano.jpg', 'Baile urbano', 5),
(120, 'Clases de baile latino (salsa, bachata)', '/images/servicios/clases/baile_latino.jpg', 'Baile latino', 5),
(121, 'Clases de cocina básica en domicilio', '/images/servicios/clases/cocina_basica.png', 'Cocina básica', 5),
(122, 'Clases de cocina saludable en casa', '/images/servicios/clases/cocina_saludable.png', 'Cocina saludable', 5),
(123, 'Clases de yoga en domicilio', '/images/servicios/clases/yoga.jpg', 'Yoga en casa', 5),
(124, 'Clases de pilates a domicilio', '/images/servicios/clases/pilates.png', 'Pilates en casa', 5),
(125, 'Clases de francés básico en domicilio', '/images/servicios/clases/frances.jpg', 'Francés básico', 5),
(126, 'Clases de alemán básico en casa', '/images/servicios/clases/aleman.png', 'Alemán básico', 5),
(127, 'Servicio urgente de fontanería para fugas o roturas', '/images/servicios/urgencias/fontanero.png', 'Fontanero urgente 24h', 6),
(128, 'Intervención inmediata en averías eléctricas', '/images/servicios/urgencias/electricista.jpg', 'Electricista urgente 24h', 6),
(129, 'Apertura urgente de puertas bloqueadas', '/images/servicios/urgencias/cerrajero.jpg', 'Cerrajero urgente 24h', 6),
(130, 'Desatascos urgentes en tuberías domésticas', '/images/servicios/urgencias/desatasco.jpg', 'Desatascos urgentes', 6),
(131, 'Reparación urgente de fugas de agua', '/images/servicios/urgencias/fuga.jpg', 'Fuga de agua urgente', 6),
(132, 'Restablecimiento de suministro eléctrico en casa', '/images/servicios/urgencias/electricidad.jpg', 'Corte de luz urgente', 6),
(133, 'Reparación urgente de cuadro eléctrico', '/images/servicios/urgencias/cuadro.png', 'Cuadro eléctrico urgente', 6),
(134, 'Cambio urgente de cerraduras', '/images/servicios/urgencias/cerradura.jpeg', 'Cambio de cerradura urgente', 6),
(135, 'Apertura de vivienda sin llaves', '/images/servicios/urgencias/puerta.jpg', 'Apertura de puerta urgente', 6),
(136, 'Sustitución urgente de cristales rotos', '/images/servicios/urgencias/cristal.png', 'Cristalero urgente', 6),
(137, 'Reparación urgente de electrodomésticos', '/images/servicios/urgencias/electrodomesticos.jpg', 'Electrodomésticos urgente', 6),
(138, 'Reparación urgente de aire acondicionado', '/images/servicios/urgencias/aire.png', 'Aire acondicionado urgente', 6),
(139, 'Reparación urgente de calefacción', '/images/servicios/urgencias/calefaccion.jpg', 'Calefacción urgente', 6),
(140, 'Control urgente de plagas en vivienda', '/images/servicios/urgencias/plagas.png', 'Plagas urgente', 6),
(141, 'Fumigación urgente en domicilio', '/images/servicios/urgencias/fumigacion.png', 'Fumigación urgente', 6),
(142, 'Limpieza urgente tras inundaciones o suciedad extrema', '/images/servicios/urgencias/limpieza.png', 'Limpieza urgente', 6),
(143, 'Reparación urgente de persianas bloqueadas', '/images/servicios/urgencias/persianas.png', 'Persianas urgente', 6),
(144, 'Reparación urgente de puertas dañadas', '/images/servicios/urgencias/puertas.jpg', 'Puertas urgente', 6),
(145, 'Cuidado urgente de mascotas en domicilio', '/images/servicios/urgencias/mascotas.png', 'Mascotas urgente', 6),
(146, 'Veterinario urgente a domicilio', '/images/servicios/urgencias/veterinario.jpg', 'Veterinario urgente', 6),
(147, 'Asistencia informática urgente en casa', '/images/servicios/urgencias/informatica.png', 'Informático urgente', 6),
(148, 'Recuperación urgente de datos en domicilio', '/images/servicios/urgencias/datos.png', 'Recuperación de datos urgente', 6),
(149, 'Servicio urgente de mudanza o traslado', '/images/servicios/urgencias/mudanza.jpg', 'Mudanza urgente', 6),
(150, 'Montaje urgente de muebles en casa', '/images/servicios/urgencias/muebles.png', 'Montaje urgente', 6),
(151, 'Reparación urgente de tejados o filtraciones', '/images/servicios/urgencias/tejado.jpg', 'Tejado urgente', 6),
(152, 'Organización profesional de armarios y espacios', '/images/servicios/otros/organizacion.jpg', 'Organización de espacios', 7),
(153, 'Optimización de distribución del hogar', '/images/servicios/otros/orden.png', 'Optimización del hogar', 7),
(154, 'Asesoramiento en decoración de interiores', '/images/servicios/otros/decoracion.png', 'Decoración de interiores', 7),
(155, 'Reorganización estética de viviendas', '/images/servicios/otros/interiorismo.png', 'Interiorismo básico', 7),
(156, 'Asesoría en compra de tecnología para casa', '/images/servicios/otros/tecnologia.jpg', 'Asesoría tecnológica', 7),
(157, 'Instalación básica de dispositivos inteligentes', '/images/servicios/otros/domotica.jpg', 'Domótica básica', 7),
(158, 'Configuración de asistentes virtuales en casa', '/images/servicios/otros/domotica.png', 'Configuración Alexa/Google Home', 7),
(159, 'Configuración de redes WiFi domésticas', '/images/servicios/otros/wifi.jpg', 'Configuración WiFi', 7),
(160, 'Optimización de conexión a internet en casa', '/images/servicios/otros/red.jpg', 'Optimización de red doméstica', 7),
(161, 'Digitalización de documentos en domicilio', '/images/servicios/otros/documentos.jpg', 'Digitalización de documentos', 7),
(162, 'Organización de archivos digitales', '/images/servicios/otros/digital.jpg', 'Organización digital', 7),
(163, 'Ayuda en gestiones online desde casa', '/images/servicios/otros/gestiones.jpg', 'Gestiones online', 7),
(164, 'Asistencia en trámites digitales', '/images/servicios/otros/tramites.jpg', 'Trámites digitales', 7),
(165, 'Fotografía profesional en domicilio', '/images/servicios/otros/fotografia.png', 'Fotografía a domicilio', 7),
(166, 'Grabación de vídeo personal o familiar', '/images/servicios/otros/video.jpg', 'Grabación de vídeo', 7),
(167, 'Organización de eventos en casa', '/images/servicios/otros/eventos.png', 'Organización de eventos', 7),
(168, 'Decoración de fiestas en domicilio', '/images/servicios/otros/eventos2.jpg', 'Decoración de eventos', 7),
(169, 'Asesoramiento en planificación de viajes', '/images/servicios/otros/viajes.jpg', 'Planificación de viajes', 7),
(170, 'Sesiones de coaching personal en casa', '/images/servicios/otros/coaching.jpg', 'Coaching personal', 7),
(171, 'Asesoramiento de imagen personal', '/images/servicios/otros/imagen.jpg', 'Asesoría de imagen', 7),
(172, 'Revisión y mejora de currículum en casa', '/images/servicios/otros/cv.jpg', 'Revisión de CV', 7),
(173, 'Entrenamiento mental y memoria', '/images/servicios/otros/memoria.jpg', 'Estimulación cognitiva', 7),
(174, 'Sesiones de mindfulness en domicilio', '/images/servicios/otros/mindfulness.jpg', 'Mindfulness en casa', 7),
(175, 'Planificación de rutinas familiares', '/images/servicios/otros/planificacion.jpg', 'Organización familiar', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

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

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `apellidos`, `ciudad`, `direccion`, `email`, `nombre`, `password`, `rol`, `telefono`, `foto_url`, `ultima_conexion`) VALUES
(1, 'García López', 'Córdoba', 'Calle Sevilla 12', 'maria.garcia.lopez@gmail.com', 'María', '$2a$10$fizdrns/l8d11ysGeW9gxuKhzaww40/jdNAQXk9bJXZZPhKzGM2UK', 'CLIENTE', '+34612345678', NULL, NULL),
(2, 'Fernández Ruiz', 'Sevilla', 'Avenida Andalucía 45', 'juan.fernandez88@hotmail.com', 'Juan', '$2a$10$z1lXU5n1Ww7L/IQcEZVjGeBtIrUuHd0gTqC2tQRExsLLFbi6YjNc2', 'PROFESIONAL', '+34623456789', NULL, NULL),
(3, 'Martínez Pérez', 'Madrid', 'Calle Alcalá 102', 'lucia.martinez.p@gmail.com', 'Lucía', '$2a$10$QcZbp5dSgLJqDZZvKSGHFuUrzqJxMItwbnaMu4syn0mneN0dfvebW', 'CLIENTE', '+34634567890', NULL, NULL),
(4, 'Sánchez Gómez', 'Málaga', 'Calle Larios 8', 'david.sanchezg@gmail.com', 'David', '$2a$10$M1HGT3EKr4ayLmn9/0TS5ewSVgdHhXCSJH2lgsoEp.82UycB8FoEm', 'PROFESIONAL', '+34645678901', NULL, NULL),
(5, 'Romero Torres', 'Córdoba', 'Calle Palma 3', 'carmen.romero.torres@gmail.com', 'Carmen', '$2a$10$0K3yEhZVhQZ3mJdVrzFZmuLPJ7y3I956h5RL2wNS0VCFRw8fvV4wa', 'CLIENTE', '+34656789012', NULL, NULL),
(6, 'Navarro Jiménez', 'Granada', 'Calle Recogidas 21', 'antonio.navarro.j@gmail.com', 'Antonio', '$2a$10$NG.ghUcDcpA.5iEReA8zJ.Qc2KYu4/0i4DW1KtdJ6dSGnH/KdtNju', 'PROFESIONAL', '+34667890123', NULL, NULL),
(7, 'Moreno Castillo', 'Jaén', 'Calle Úbeda 14', 'laura.moreno.c@gmail.com', 'Laura', '$2a$10$2egsOQWwX/QfK0g6iflNs.oSSCC/2EcipR96.Dl0mj1wmSj5rUBLi', 'CLIENTE', '+34678901234', NULL, NULL),
(8, 'Delgado Herrera', 'Cádiz', 'Avenida del Mar 9', 'sergio.delgado.h@gmail.com', 'Sergio', '$2a$10$cl0csAEWoyKlqkTBym1fXuqYm5BNtQpj9.JqoMf33vAceBmscIxt2', 'PROFESIONAL', '+34689012345', NULL, NULL),
(9, 'Ortega Medina', 'Valencia', 'Calle Colón 56', 'ana.ortega.medina@gmail.com', 'Ana', '$2a$10$Ee9QrtrzRA8p3gudYzUEDOtcMxrFA/qEol/fAdf5CIxR6H/Vx4tRi', 'CLIENTE', '+34690123456', NULL, NULL),
(10, 'Castro Molina', 'Barcelona', 'Calle Aragón 210', 'javier.castro.m@gmail.com', 'Javier', '$2a$10$f8r4EOBoUyuhMSiPVo6LfeScpMSuFMyfHm/2gvTPVw37icP/ESApC', 'PROFESIONAL', '+34601234567', NULL, NULL),
(11, 'Ramos Vidal', 'Sevilla', 'Calle Triana 33', 'paula.ramos.vidal@gmail.com', 'Paula', '$2a$10$gY21F1kTCIT7XmR7urAY2eekK4qtu/jpixL5YBTu9SfeXazrNiMJG', 'CLIENTE', '+34612987654', NULL, NULL),
(12, 'Reyes Santos', 'Córdoba', 'Calle Cruz Conde 7', 'alberto.reyes.s@gmail.com', 'Alberto', '$2a$10$V1OI.zWh6xpJwsLpNGeS0OFWr59yN7xupmYmCw5h4slJZunLZf7h2', 'PROFESIONAL', '+34623876543', NULL, NULL),
(13, 'Molina Vega', 'Málaga', 'Calle Carretería 19', 'elena.molina.v@gmail.com', 'Elena', '$2a$10$0kvX7CtuR0X9PmlpjM55xujBqSL.rm0trZU9SFPq.i.IuntpSzJba', 'CLIENTE', '+34634765432', NULL, NULL),
(14, 'Ibáñez Navarro', 'Madrid', 'Calle Gran Vía 88', 'daniel.ibanez.n@gmail.com', 'Daniel', '$2a$10$AbkMfAdm2Dk/eNG/L3k/duWZOSKNyCkgn0ruecT5BbAbJ3DWwj1UC', 'PROFESIONAL', '+34645654321', NULL, NULL),
(15, 'Campos Ríos', 'Granada', 'Calle Alhambra 4', 'silvia.campos.rios@gmail.com', 'Silvia', '$2a$10$wWpqdZndKD0mooD4qcZ1HuFjc17J.bVibzKeIbH5EP2RCHewQhFQi', 'CLIENTE', '+34656543210', NULL, NULL),
(16, 'Serrano Fuentes', 'Sevilla', 'Calle Nervión 22', 'miguel.serrano.f@gmail.com', 'Miguel', '$2a$10$Y9d8LZziNA9utgtJvThnleSz0F818.5BTtJrqdlPwpWWtuYj.w6G.', 'PROFESIONAL', '+34667432109', NULL, NULL),
(17, 'Vargas León', 'Córdoba', 'Calle Feria 11', 'rocio.vargas.leon@gmail.com', 'Rocío', '$2a$10$lDnt9dXlZbWngYuVCaJYqeY1b8iH32c3L2CS.M8qVObOTBz0NnF3a', 'CLIENTE', '+34678321098', NULL, NULL),
(18, 'Peña Cortés', 'Cádiz', 'Calle San Juan 6', 'fernando.pena.c@gmail.com', 'Fernando', '$2a$10$sJwUp17xo/M21/llRkVR3udJeZtotTkkcQwGVraEVzh2cvgFM9fRK', 'PROFESIONAL', '+34689210987', NULL, NULL),
(19, 'Herrera Márquez', 'Jaén', 'Calle Linares 15', 'marta.herrera.m@gmail.com', 'Marta', '$2a$10$IdC21Mo/.7zGVfyHxCnye.Eky17c1t3SBFkhWr8SNx5pKnB7ArwNa', 'CLIENTE', '+34690198765', NULL, NULL),
(20, 'Admin Sistema', 'Madrid', 'Calle Central 1', 'admin@jobfree.com', 'Admin', '$2y$10$HDxxNVbkUVFZLmWCdFPI4.Zar/HOIFeJrYcq1pMPUhD8akcH/L2j6', 'ADMIN', '+34600000000', NULL, '2026-05-02 20:15:09'),
(21, 'Heredia López', 'Córdoba', 'Sin especificar', 'pacoro@gmail.com', 'Pablo', '$2a$10$reHmE0UbUWIyAPZ.h3uGTudpGWWX6S6owfoezHbLYsO2PzOrPsXUe', 'CLIENTE', '+34627719120', NULL, NULL),
(22, 'Heredia Ruiz', 'Córdoba', 'Sin especificar', 'pablorh20042007redes@gmail.com', 'Pablo', '$2a$10$tyK8u3Gst9Lhm0nkpi7MY.GAVTZ9x/dFXBCaMBdLc1CXd/3mwSL7m', 'CLIENTE', '+34627719121', '/uploads/fotos/1fbe728e-e506-4cca-bca7-d6b4bae97f2a.jpg', '2026-05-04 18:41:09'),
(23, 'Heredia Sánchez', 'Córdoba', 'Sin especificar', 'alberto.heredia@gmail.com', 'Alberto', '$2a$10$xFiji5I6Q7uEym9vezHcBuItLoAgSVPUeqeMKgI7xiLr5xRb2/nMi', 'CLIENTE', '+34627719122', NULL, NULL),
(24, 'Heredia Torres', 'Palma del Río', 'Calle Ancha 31', 'pacoroca@gmail.com', 'Pablo', '$2a$10$fhhqEr0/5WHMC0lImgHiKOxChskB3LclqDIbV3r8ZnucRqw3AW2am', 'CLIENTE', '+34626638923', NULL, NULL),
(25, 'Martínez López', 'Palma del Río', 'Calle Ancha 31', 'luis.profesional@gmail.com', 'Luis', '$2a$10$kvQLVi4T3CJauQasU1Eqtu6gmYUpWuS.iIywMuf633xdCzkIMzGA.', 'PROFESIONAL', '+3467732836433', NULL, NULL),
(26, 'León', 'Palma del Río', 'Calle Alberca', 'pacoleon123@gmail.com', 'Paco', '$2a$10$XMIWIgSN/iJ2lpksvF7IqeJ6Zm75Lr5y2CQRgPfPhi32ItbCJ5D.q', 'PROFESIONAL', '+44612236537', NULL, NULL),
(27, 'García Gutiérrez', 'Huelva', 'Calle Ancha', 'pruebagarcia@gmail.com', 'Luis Antonio', '$2a$10$kh04524gSXwBUpE.Q5rVNOeJjuQbbqYbSkD7fPG.e.AcBTVEaIIqC', 'CLIENTE', '+351617723485', NULL, NULL),
(28, 'Heredia Valenzuela', 'Peñaflor', 'Calle Pera', 'yolandita@gmail.com', 'Yolanda', '$2a$10$jcmmC6XInQX94fhtKg5AxeQiGOg5.ExAb9qWyME8oZjI45rWJ5WCi', 'CLIENTE', '+34664828077', NULL, NULL),
(29, 'Román Martín', 'Cádiz capital', 'Calle Jaén', 'gustavorm@hotmail.com', 'Gustavo', '$2a$10$Z2Re.ucGj3QtPtyj.ePkrOgDwhsIvyclDkNF2IFkgAe3FI/Jd8S1e', 'PROFESIONAL', '+33456472843', NULL, NULL),
(30, 'Heredia Gómez', 'Córdoba', 'Calle Ancha 31', 'pablorh20042007@gmail.com', 'Pablo', '$2a$10$vQ64xHBaIsPsVetRh/BffuZUMrrrr016U.VWxngtAjAtlFLcICf4u', 'CLIENTE', '+34612234576', NULL, NULL),
(31, 'Baena', 'Murcia', 'Calle Ácaro', 'javierbaena@gmail.com', 'Javier', '$2a$10$MqicbHql5kmuC8tuW1HVKebJg09lZxNtYNCo79qD4ZwRW/Em2P59a', 'CLIENTE', '+34616634589', NULL, NULL),
(35, 'Guti', 'Jaén', 'Calle Perla', 'beti@gmail.com', 'Betty', '$2a$10$q2hw2Zm0dmLjaFaPpKt7LOdu8aRsOv7QtTluuOMZyY0NQJ7fDZZQ2', 'CLIENTE', '+34617723458', NULL, NULL),
(36, 'García Márquez', 'Palma del Río', 'Calle Ancha 31', 'joanmarquez@gmail.com', 'Joan', '$2a$10$GmtKiwtMLWFMgyWCndVB.OLICoMgwDkaCXW.HRMY7x0bsz8jU5wCu', 'PROFESIONAL', '+34617719273', NULL, NULL),
(37, 'García Márquez', 'Aljaraque', 'Calle Villaverde', 'maria.garcia.lopez1@gmail.com', 'Maria', '$2a$10$wUdDBezu4wgcTkiKjjrxMeUPQxkYyo45jZfPN4pLr2w3evTYuwFZa', 'CLIENTE', '+34727734568', NULL, NULL),
(38, 'Heredia Martín', 'Madrid', 'Calle Huelva', 'yolandeva2020@gmail.com', 'Yolanda', '$2a$10$l8JFNs6jWEQ6bK8rPKWp0erh7ReErPhHlyUCkBaHc6hVZ/Q1F7MSK', 'PROFESIONAL', '+34623345782', NULL, NULL),
(39, 'Márquez', 'Palma', 'Calle Ancha 30', 'javiermarquez@gmail.com', 'Javier', '$2a$10$z3mhFwiv8TWwqkbxX1VMe.svYnKodZc6QKx5g064cNQJIwoJovBLy', 'PROFESIONAL', '+34662345566', '/uploads/fotos/bec074fc-2fbe-43af-b8bf-fbdecf23d506.png', NULL),
(40, 'Paredes', 'Hornachuelos', 'C. Murcia', 'juanvazquez1979@gmail.com', 'Marta', '$2a$10$mpeWWvjWrO7rJ.r89op9KeaXzDvUCD8ZofemssCql9qaDttG0npGa', 'PROFESIONAL', '+34623418234', '/uploads/fotos/5130c183-5ebe-42e2-bde8-67ea3ba003cf.png', NULL),
(41, 'Martínez Morales', 'Córdoba', 'Calle Gran Vía 123, 1ºB', 'juan.martinez93@gmail.com', 'Juan Carlos', '$2a$10$fnZZ7C3gxxNKPPxvcwZZf.Y4jaQxAkOh5GwIKfSbuwNBYiWKv7EUG', 'CLIENTE', '+34673221234', '/uploads/fotos/f69ca673-355b-4110-a119-6e435bc3ac3f.png', NULL),
(42, 'Martínez Ruiz', 'Córdoba', 'Avenida del Gran Capitán 12, 2ºA', 'javier.martinez.ruiz1989@gmail.com', 'Javier', '$2a$10$izXZD7V/gFGe8V8O06etHuQ0.RXdlG0GvazqOvdCUJQr19dSHxOPu', 'PROFESIONAL', '+34623546211', '/uploads/fotos/dd773540-85a7-46ff-a065-384b7edbd8fb.png', NULL),
(43, 'López', 'Córdoba', 'Calle Ronda de los Tejares 34, 1ºB', 'maria.lopez.garcia1992@gmail.com', 'María', '$2a$10$Jdf6XACRoTOdFbUToPeY6OowhIS6YqNtnLvDlDpEaQii3ejk2/lOW', 'CLIENTE', '+34622914500', '/uploads/fotos/1560441e-2ed3-4844-9ca5-a60b857904f4.jpg', NULL),
(44, 'Gómez Vargas', 'Valencia', 'Calle de Colón 45, 3ºB', 'luis.gomez.pro@gmail.com', 'Luis', '$2a$10$1Oi2dp3wfbGG6X6dTSxO3.j8ZTBcvP8VyL1BjMgqqcNlaSkEVbP/.', 'PROFESIONAL', '+34612335678', '/uploads/fotos/a54c3fa9-0dc7-4fe8-8641-210c714ee53d.png', NULL),
(45, 'Nevado', 'Exija', 'Mariana pineda 73', 'pruebaclase@gmail.com', 'Pablo', '$2a$10$y.BKiN1iadYixAUaAUU.p.FtEYzsFQTvDPT8BMZVF3qDDgeowisV.', 'PROFESIONAL', '+34644984355', '/uploads/fotos/7919515f-c954-49cb-9b01-b0e37e24e072.png', NULL),
(46, 'García Romero', 'Córdoba', 'Avenida de la Libertad 45, 3ºA', 'elsa.garciaromero122@gmail.com', 'Elsa', '$2a$10$8EpxPtEqWq3zj.NVaoudwudu7eFt/GYKboF94PswPb1MVdqWihKjm', 'PROFESIONAL', '+34623847519', NULL, '2026-04-30 07:35:46'),
(47, 'Thompson', 'Málaga', 'Avenida de Andalucía 54, 4ºD', 'daniel.thompson.uk@gmail.com', 'Daniel', '$2a$10$qoK37zxX0T5/5Lq7vURCmOK7Q8B/oIMV0718DT6uKrgECEtu8N0ki', 'PROFESIONAL', '+34611274983', NULL, '2026-05-02 20:01:24'),
(48, 'García Romero', 'El Palmar de Troya', 'Calle Virgen de Fátima 7', 'manugarcia88@gmail.com', 'Manuel', '$2a$10$gIYF5B3OAgFV.uNZfiqNBu.G7uMQfdK36l81qzEDG5KtrdQr7zZ5W', 'PROFESIONAL', '+34622518374', NULL, '2026-05-04 09:38:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valoracion`
--

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

--
-- Volcado de datos para la tabla `valoracion`
--

INSERT INTO `valoracion` (`id`, `comentario`, `estrellas`, `fecha`, `cliente_id`, `profesional_id`, `reserva_id`) VALUES
(1, 'Muy buen servicio, todo quedó impecable. Repetiré sin duda.', 5, '2026-03-03 14:00:00.000000', 1, 1, 1),
(2, 'Buen trabajo, aunque llegó un poco tarde. Aun así satisfecho.', 4, '2026-03-05 15:00:00.000000', 3, 1, 2),
(3, 'Servicio rápido y profesional. Solucionó el problema sin complicaciones.', 5, '2026-03-08 12:00:00.000000', 9, 2, 5),
(4, 'Muy contento con el resultado, lo recomiendo totalmente.', 5, '2026-03-13 19:00:00.000000', 17, 3, 9),
(5, 'Trabajo correcto, aunque podría mejorar en limpieza tras la reparación.', 3, '2026-03-17 15:00:00.000000', 1, 4, 12),
(6, 'Servicio rápido y eficaz, muy amable.', 4, '2026-03-19 12:00:00.000000', 7, 5, 15),
(7, 'Todo perfecto, muy profesional y puntual.', 5, '2026-03-26 12:30:00.000000', 13, 6, 18),
(8, '', 3, '2026-04-24 09:30:01.000000', 22, 12, 21),
(9, '', 4, '2026-05-04 09:26:08.000000', 22, 16, 25);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aud_migracion_conversacion`
--
ALTER TABLE `aud_migracion_conversacion`
  ADD PRIMARY KEY (`auditoria_id`),
  ADD UNIQUE KEY `uk_aud_conversacion_motivo` (`conversacion_id_original`,`motivo`);

--
-- Indices de la tabla `aud_migracion_mensaje`
--
ALTER TABLE `aud_migracion_mensaje`
  ADD PRIMARY KEY (`auditoria_id`),
  ADD UNIQUE KEY `uk_aud_mensaje_motivo` (`mensaje_id_original`,`motivo`);

--
-- Indices de la tabla `bloqueo_usuario`
--
ALTER TABLE `bloqueo_usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_bloqueo` (`bloqueador_id`,`bloqueado_id`),
  ADD KEY `fk_bloqueo_bloqueado` (`bloqueado_id`);

--
-- Indices de la tabla `categoria_servicio`
--
ALTER TABLE `categoria_servicio`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKdh5my7t19ko9kqrgy6wr1acbd` (`nombre`);

--
-- Indices de la tabla `conversacion`
--
ALTER TABLE `conversacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_conversacion_reserva` (`reserva_id`),
  ADD UNIQUE KEY `uk_conversacion_contacto_clave` (`contacto_clave`),
  ADD KEY `idx_conversacion_reserva` (`reserva_id`),
  ADD KEY `idx_conversacion_cliente` (`cliente_id`),
  ADD KEY `idx_conversacion_profesional` (`profesional_id`);

--
-- Indices de la tabla `favorito_servicio`
--
ALTER TABLE `favorito_servicio`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_cliente_servicio` (`cliente_id`,`servicio_id`),
  ADD KEY `FK_favorito_servicio` (`servicio_id`);

--
-- Indices de la tabla `flyway_schema_history`
--
ALTER TABLE `flyway_schema_history`
  ADD PRIMARY KEY (`installed_rank`),
  ADD KEY `flyway_schema_history_s_idx` (`success`);

--
-- Indices de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_mensaje_conversacion_remitente_client_message` (`conversacion_id`,`remitente_id`,`client_message_id`),
  ADD KEY `FKfi1dp7psgd7wi7n4x7aberitn` (`destinatario_id`),
  ADD KEY `FKdvdwp5crky4couuh3eocowubd` (`remitente_id`),
  ADD KEY `idx_mensaje_conversacion` (`conversacion_id`),
  ADD KEY `fk_mensaje_respondido` (`mensaje_respondido_id`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK5hnclv9lmmc1w4335x04warbm` (`usuario_id`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKqj02ydo10plxmxqghwned0ng2` (`reserva_id`);

--
-- Indices de la tabla `password_reset_token`
--
ALTER TABLE `password_reset_token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKg0guo4k8krgpwuagos61oc06j` (`token`),
  ADD KEY `FKaehv7qqwsde87cy79hxhy4lke` (`usuario_id`);

--
-- Indices de la tabla `profesional_info`
--
ALTER TABLE `profesional_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKirqu016ab7f4fbtfeyki7r2bq` (`usuario_id`),
  ADD UNIQUE KEY `UK8elir2r3fk0dta4d06xp8sqag` (`cif`);

--
-- Indices de la tabla `resena_profesional`
--
ALTER TABLE `resena_profesional`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKcliente_resena` (`cliente_id`),
  ADD KEY `FKprofesional_resena` (`profesional_id`),
  ADD KEY `FKreserva_resena` (`reserva_id`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK82e7s21vcbieo07pamsoyi883` (`cliente_id`),
  ADD KEY `FKb3i33pbfl03tn99pdd0x3tngr` (`servicio_id`);

--
-- Indices de la tabla `servicio_ofrecido`
--
ALTER TABLE `servicio_ofrecido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKonu2su0b1y4qwq0y4sxq17n9w` (`profesional_id`),
  ADD KEY `FKkpm94273aee38r4lwfrd6yr0f` (`subcategoria_id`);

--
-- Indices de la tabla `subcategoria_servicio`
--
ALTER TABLE `subcategoria_servicio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKcq2a4sargqm9e0kw48wv3yjv8` (`categoria_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK5171l57faosmj8myawaucatdw` (`email`),
  ADD UNIQUE KEY `UKlyn4jrsa2ou2meyuarytj8tcc` (`telefono`);

--
-- Indices de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK2i16ciqf8y9qhmh75k0d3t4ai` (`reserva_id`),
  ADD KEY `FKrof74syk8s7qjh9bcwidgaxrd` (`cliente_id`),
  ADD KEY `FKroyv0lu79p3c9ufpbc4j9kvoc` (`profesional_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `aud_migracion_conversacion`
--
ALTER TABLE `aud_migracion_conversacion`
  MODIFY `auditoria_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `aud_migracion_mensaje`
--
ALTER TABLE `aud_migracion_mensaje`
  MODIFY `auditoria_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `bloqueo_usuario`
--
ALTER TABLE `bloqueo_usuario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `categoria_servicio`
--
ALTER TABLE `categoria_servicio`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `conversacion`
--
ALTER TABLE `conversacion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `favorito_servicio`
--
ALTER TABLE `favorito_servicio`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `password_reset_token`
--
ALTER TABLE `password_reset_token`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `profesional_info`
--
ALTER TABLE `profesional_info`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `resena_profesional`
--
ALTER TABLE `resena_profesional`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `servicio_ofrecido`
--
ALTER TABLE `servicio_ofrecido`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `subcategoria_servicio`
--
ALTER TABLE `subcategoria_servicio`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bloqueo_usuario`
--
ALTER TABLE `bloqueo_usuario`
  ADD CONSTRAINT `fk_bloqueo_bloqueado` FOREIGN KEY (`bloqueado_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bloqueo_bloqueador` FOREIGN KEY (`bloqueador_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `conversacion`
--
ALTER TABLE `conversacion`
  ADD CONSTRAINT `fk_conversacion_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `fk_conversacion_profesional` FOREIGN KEY (`profesional_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `fk_conversacion_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`);

--
-- Filtros para la tabla `favorito_servicio`
--
ALTER TABLE `favorito_servicio`
  ADD CONSTRAINT `FK_favorito_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_favorito_servicio` FOREIGN KEY (`servicio_id`) REFERENCES `servicio_ofrecido` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD CONSTRAINT `FKdvdwp5crky4couuh3eocowubd` FOREIGN KEY (`remitente_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `FKfi1dp7psgd7wi7n4x7aberitn` FOREIGN KEY (`destinatario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `fk_mensaje_conversacion` FOREIGN KEY (`conversacion_id`) REFERENCES `conversacion` (`id`),
  ADD CONSTRAINT `fk_mensaje_respondido` FOREIGN KEY (`mensaje_respondido_id`) REFERENCES `mensaje` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `FK5hnclv9lmmc1w4335x04warbm` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `FKn8jkfq10o8ctrdwbr6nqjd8yd` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`);

--
-- Filtros para la tabla `password_reset_token`
--
ALTER TABLE `password_reset_token`
  ADD CONSTRAINT `FKaehv7qqwsde87cy79hxhy4lke` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `profesional_info`
--
ALTER TABLE `profesional_info`
  ADD CONSTRAINT `FKm2ck32qs2rkn2n7cr4iphpus2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `resena_profesional`
--
ALTER TABLE `resena_profesional`
  ADD CONSTRAINT `FKcliente_resena` FOREIGN KEY (`cliente_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FKprofesional_resena` FOREIGN KEY (`profesional_id`) REFERENCES `profesional_info` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FKreserva_resena` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `FK82e7s21vcbieo07pamsoyi883` FOREIGN KEY (`cliente_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `FKb3i33pbfl03tn99pdd0x3tngr` FOREIGN KEY (`servicio_id`) REFERENCES `servicio_ofrecido` (`id`);

--
-- Filtros para la tabla `servicio_ofrecido`
--
ALTER TABLE `servicio_ofrecido`
  ADD CONSTRAINT `FKkpm94273aee38r4lwfrd6yr0f` FOREIGN KEY (`subcategoria_id`) REFERENCES `subcategoria_servicio` (`id`),
  ADD CONSTRAINT `FKonu2su0b1y4qwq0y4sxq17n9w` FOREIGN KEY (`profesional_id`) REFERENCES `profesional_info` (`id`);

--
-- Filtros para la tabla `subcategoria_servicio`
--
ALTER TABLE `subcategoria_servicio`
  ADD CONSTRAINT `FKcq2a4sargqm9e0kw48wv3yjv8` FOREIGN KEY (`categoria_id`) REFERENCES `categoria_servicio` (`id`);

--
-- Filtros para la tabla `valoracion`
--
ALTER TABLE `valoracion`
  ADD CONSTRAINT `FK9w0r9rarfrt9o871xp2s2c43h` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`),
  ADD CONSTRAINT `FKrof74syk8s7qjh9bcwidgaxrd` FOREIGN KEY (`cliente_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `FKroyv0lu79p3c9ufpbc4j9kvoc` FOREIGN KEY (`profesional_id`) REFERENCES `profesional_info` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
