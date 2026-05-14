-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-05-2026 a las 14:17:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS=0;
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
(33, 23, 22, 2, '2026-04-24 09:31:43.000000', NULL, '2026-05-13 08:32:20', '📌 Consulta sobre: Limpieza profunda', 0, 0, NULL, NULL, 0, 0),
(34, 22, 22, 45, '2026-04-24 10:28:41.000000', NULL, '2026-04-24 10:30:16', 'IIIIE', 0, 0, NULL, NULL, 0, 0),
(35, NULL, 22, 46, '2026-04-29 21:45:33.000000', '22:46', '2026-04-29 21:53:28', 'Nos vemos el jueves?', 0, 0, '9998-12-31 23:00:00', NULL, 0, 0),
(36, NULL, 22, 47, '2026-04-30 07:53:32.000000', '22:47', '2026-05-02 19:33:03', 'así me gustaría', 0, 0, NULL, NULL, 0, 0),
(37, 25, 22, 48, '2026-05-03 00:02:41.000000', NULL, '2026-05-04 09:24:54', 'Hola', 1, 0, NULL, NULL, 0, 1),
(38, NULL, 22, 16, '2026-05-04 08:41:23.000000', '22:16', '2026-05-04 08:41:53', 'Hola, necesito mantenimiento para mi jardín. Habría que cortar el césped, podar algunas plantas y dejarlo un poco arreglado en general. Me gustaría hacerlo esta semana. ¿Tienes disponibilidad y cuá...', 0, 0, NULL, NULL, 0, 0),
(40, 24, 22, 48, '2026-05-04 09:22:51.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(41, 27, 22, 4, '2026-05-04 18:21:31.000000', NULL, '2026-05-04 18:22:14', 'Hola David, necesito instalar varias lámparas en casa (techo y pared). Me gustaría saber disponibilidad en los próximos días . Gracias.', 0, 0, NULL, NULL, 0, 0),
(42, 28, 22, 49, '2026-05-07 08:32:14.000000', NULL, '2026-05-13 09:52:49', 'Hola, estoy interesado/a en tu servicio de organización de eventos personalizados. Me gustaría recibir más información sobre cómo trabajas, disponibilidad y qué incluye el servicio. Gracias.', 0, 0, '9998-12-31 23:00:00', '9998-12-31 23:00:00', 0, 1),
(43, NULL, 22, 73, '2026-05-13 08:37:12.000000', '22:73', '2026-05-13 08:37:12', '📌 Consulta sobre: Manitas Zaragoza', 0, 0, NULL, NULL, 0, 0),
(44, NULL, 22, 79, '2026-05-13 08:40:27.000000', '22:79', '2026-05-13 08:40:27', '📌 Consulta sobre: Lámparas Málaga\n\nHola Víctor, necesito ayuda con unas lámparas en Málaga. Quiero instalar/revisar varias lámparas en casa y me gustaría saber disponibilidad y presupuesto aproxim...', 0, 0, NULL, NULL, 0, 0),
(45, 29, 22, 49, '2026-05-13 11:03:53.000000', NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0),
(46, 30, 103, 102, '2026-05-13 11:27:31.000000', NULL, '2026-05-13 11:44:25', '!!', 0, 0, '9998-12-31 23:00:00', NULL, 0, 0);

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
(24, '2026-05-11 10:35:41.000000', 22, 90),
(25, '2026-05-12 08:58:49.000000', 22, 47),
(26, '2026-05-12 08:58:50.000000', 22, 83),
(27, '2026-05-12 09:00:01.000000', 22, 27),
(28, '2026-05-12 09:00:03.000000', 22, 62),
(29, '2026-05-12 09:00:04.000000', 22, 105),
(30, '2026-05-12 09:00:05.000000', 22, 112),
(31, '2026-05-13 09:43:23.000000', 22, 284);

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
(22, '21', 'agregar fijada y silenciada hasta conversacion', 'SQL', 'V21__agregar_fijada_y_silenciada_hasta_conversacion.sql', -40203803, 'root', '2026-05-03 12:59:44', 20, 1),
(23, '22', 'crear tabla mensaje reaccion', 'SQL', 'V22__crear_tabla_mensaje_reaccion.sql', -2102424138, 'root', '2026-05-07 09:58:40', 45, 1),
(24, '23', 'crear tabla profesional ciudad servicio', 'SQL', 'V23__crear_tabla_profesional_ciudad_servicio.sql', -1655665971, 'root', '2026-05-07 12:42:31', 30, 1),
(25, '24', 'agregar stripe payment intent id pago', 'SQL', 'V24__agregar_stripe_payment_intent_id_pago.sql', 1188637412, 'root', '2026-05-13 09:25:14', 25, 1);

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
(128, 'Hola David, necesito instalar varias lámparas en casa (techo y pared). Me gustaría saber disponibilidad en los próximos días . Gracias.', '2026-05-04 18:22:14.000000', b'0', 4, 22, 41, b'0', '7fdfb999-4169-4af6-be5a-e93c6bedc497', NULL, NULL),
(129, '📌 Consulta sobre: Eliminación de cucarachas, hormigas y plagas comunes', '2026-05-07 08:32:14.000000', b'1', 49, 22, 42, b'1', 'a35ce4c4-3326-4140-95db-338cda64c682', NULL, NULL),
(130, 'Hola Elena, buenas. He visto tu anuncio de control de plagas porque tengo un problema de cucarachas en casa y me gustaría saber si podrías venir esta semana. El piso es pequeño y el problema está sobre todo en la cocina. Gracias.', '2026-05-07 08:33:09.000000', b'1', 49, 22, 42, b'1', 'e86e2c82-dda5-4ed0-ae18-579e29a7b58f', NULL, NULL),
(131, 'Hola, buenas 😊 Sí, claro, podría pasarme esta semana sin problema. Normalmente ese tipo de plaga en cocina tiene solución rápida. Si quieres, dime qué día y hora te viene mejor y hablamos para organizarlo.', '2026-05-07 08:50:40.000000', b'1', 22, 49, 42, b'1', '2129a361-a109-4293-b065-f34119e2da46', NULL, NULL),
(132, 'También te recomiendo evitar dejar comida fuera y revisar si hay zonas húmedas cerca de la cocina hasta que pueda pasar a verlo 😊', '2026-05-07 08:53:27.000000', b'1', 22, 49, 42, b'1', '713464dd-4621-40ec-961a-4b95b0c5544e', NULL, NULL),
(133, 'Perfecto, muchas gracias Elena. Te mando una foto para que veas más o menos cómo está la zona de la cocina y dónde suelen aparecer.🤮', '2026-05-07 08:57:51.000000', b'1', 49, 22, 42, b'1', '3faa2461-f0f8-42bc-b36b-17179b7f5e5b', NULL, '/uploads/mensajes/73001217-e18a-4873-adbb-aad33f3415df.png'),
(134, 'Uf, sí, viendo la foto parece que vienen de esa zona de la cocina 😅 No te preocupes, este tipo de casos suelen tener solución. Cuando vaya revisaré bien los rincones y aplicaré el tratamiento para eliminar la plaga y evitar que vuelva a salir.', '2026-05-07 09:15:50.000000', b'1', 22, 49, 42, b'1', '1242f1e4-2730-4c09-a43c-2436e0254bb0', NULL, NULL),
(135, 'Hola!', '2026-05-12 10:50:59.000000', b'1', 49, 22, 42, b'1', 'b336727b-539f-4642-b028-46395a8cffee', NULL, NULL),
(136, 'Buenas, q tal?', '2026-05-12 11:03:00.000000', b'1', 22, 49, 42, b'1', '4dc024f7-6686-47ec-aa66-c75fa35be800', NULL, NULL),
(137, 'Hola 😊 Todo bien. ¿Cuándo podrías venir a echarle un vistazo?', '2026-05-12 11:03:51.000000', b'1', 49, 22, 42, b'1', '70913dda-7e3a-44c6-b254-89fb4eb6c017', NULL, NULL),
(138, 'Hoy?', '2026-05-12 11:04:35.000000', b'1', 49, 22, 42, b'1', 'dd6803a9-9887-4228-8d05-a01cd257bd4e', NULL, NULL),
(139, 'Puff', '2026-05-12 11:05:11.000000', b'1', 22, 49, 42, b'1', '6fe81113-42ad-470a-b659-23cb27d31d74', NULL, NULL),
(140, 'Pues mira, sobre las 17 tengo un hueco', '2026-05-12 11:17:09.000000', b'1', 22, 49, 42, b'1', 'd79f60f9-0bd6-4a63-853e-1cde721b7521', NULL, NULL),
(141, 'Puedes?', '2026-05-12 11:17:28.000000', b'1', 22, 49, 42, b'1', 'b7a79612-f595-4614-83be-447f327e3395', NULL, NULL),
(142, 'Pues mira, me viene perfecto', '2026-05-12 11:22:57.000000', b'1', 49, 22, 42, b'1', 'e27718a9-7c39-4b81-bc3b-900ddef6cd47', NULL, NULL),
(143, 'Tu doy mi dirección', '2026-05-12 11:23:17.000000', b'1', 49, 22, 42, b'1', 'c0ac1a1f-ec16-459e-9b1c-d6e1e01ba364', NULL, NULL),
(144, 'Calle Gran Capitán, 5, 14008 Córdoba, España', '2026-05-12 11:37:02.000000', b'1', 49, 22, 42, b'1', 'fffef709-56f4-495f-8519-7cce7c478b81', NULL, NULL),
(145, 'Perfe!', '2026-05-12 11:37:53.000000', b'1', 22, 49, 42, b'1', '6608336f-2414-40c4-89ce-04230ece777f', 144, NULL),
(146, 'Genial', '2026-05-12 13:14:29.000000', b'1', 49, 22, 42, b'1', '55c50ffa-2bdb-4302-9387-a8504b5569ec', NULL, NULL),
(147, 'Buenos días, estupendo trabajo 😃', '2026-05-13 07:50:32.000000', b'1', 49, 22, 42, b'1', 'd3ab15eb-e9c3-4a58-a362-43f7d94ddb7e', NULL, NULL),
(148, 'mira!!', '2026-05-13 07:51:21.000000', b'1', 49, 22, 42, b'1', '5368378b-673d-4b87-a541-761c864edfd0', NULL, '/uploads/mensajes/e0a5805a-3378-46d7-a79f-f2b8d4347b26.png'),
(149, '📌 Consulta sobre: Cuidado de gatos', '2026-05-13 08:29:18.000000', b'1', 49, 22, 42, b'1', 'a4323619-8c2a-4e0a-8620-a2606df93d00', NULL, NULL),
(150, 'Hola Elena, estoy buscando a alguien de confianza para el cuidado de mi gato. Necesitaría ayuda durante algunas horas y me gustaría saber tu disponibilidad y cómo trabajas normalmente. Mi gato es tranquilo y está acostumbrado a convivir con personas. Quedo atento/a a tu respuesta. ¡Gracias!', '2026-05-13 08:29:28.000000', b'1', 49, 22, 42, b'1', 'e3878807-e60e-4269-be24-348a6ccc55d1', NULL, NULL),
(151, '📌 Consulta sobre: Limpieza profunda', '2026-05-13 08:32:20.000000', b'0', 2, 22, 33, b'0', '48c7c468-ac7a-45e8-9aa2-66a3ccca8452', NULL, NULL),
(152, '📌 Consulta sobre: Manitas Zaragoza', '2026-05-13 08:37:12.000000', b'0', 73, 22, 43, b'0', 'e575969c-8db4-438e-9587-59c48fa899a9', NULL, NULL),
(153, '📌 Consulta sobre: Lámparas Málaga\n\nHola Víctor, necesito ayuda con unas lámparas en Málaga. Quiero instalar/revisar varias lámparas en casa y me gustaría saber disponibilidad y presupuesto aproximado. Sería ideal hacerlo esta semana. Gracias.', '2026-05-13 08:40:27.000000', b'0', 79, 22, 44, b'0', 'c3b1143e-848a-4952-9359-aeae9cfd4e3d', NULL, NULL),
(154, 'Hola, estoy interesado/a en tu servicio de organización de eventos personalizados. Me gustaría recibir más información sobre cómo trabajas, disponibilidad y qué incluye el servicio. Gracias.', '2026-05-13 09:44:57.000000', b'1', 49, 22, 42, b'1', '1778665497258-olaolr4', NULL, NULL),
(155, 'Hola, estoy interesado/a en tu servicio de organización de eventos personalizados. Me gustaría recibir más información sobre cómo trabajas, disponibilidad y qué incluye el servicio. Gracias.', '2026-05-13 09:45:30.000000', b'1', 49, 22, 42, b'1', '1778665530430-jn0a5f1', NULL, NULL),
(156, 'Hola, estoy interesado/a en tu servicio de organización de eventos personalizados. Me gustaría recibir más información sobre cómo trabajas, disponibilidad y qué incluye el servicio. Gracias.', '2026-05-13 09:45:38.000000', b'1', 49, 22, 42, b'1', '1778665538096-9pwelgr', NULL, NULL),
(157, 'Hola, estoy interesado/a en tu servicio de organización de eventos personalizados. Me gustaría recibir más información sobre cómo trabajas, disponibilidad y qué incluye el servicio. Gracias.', '2026-05-13 09:47:04.000000', b'1', 49, 22, 42, b'1', '1778665624323-jrauwj0', NULL, NULL),
(158, 'Hola, estoy interesado/a en tu servicio de organización de eventos personalizados. Me gustaría recibir más información sobre cómo trabajas, disponibilidad y qué incluye el servicio. Gracias.', '2026-05-13 09:52:49.000000', b'1', 49, 22, 42, b'1', '1778665969788-eqrkbji', NULL, NULL),
(159, '📌 Consulta sobre: Cuidado de bebés responsable y con experiencia\n\nHola Javier, necesito cuidado para mi bebé de 8 meses por las tardes de lunes a viernes durante 3 horas. ¿Tienes disponibilidad?', '2026-05-13 11:27:31.000000', b'1', 102, 103, 46, b'1', 'ae828dad-35fa-4546-95e3-492ce334238e', NULL, NULL),
(160, 'Hola!', '2026-05-13 11:43:35.000000', b'1', 103, 102, 46, b'1', '784ba863-8514-4ba3-a41d-3938d2934437', NULL, NULL),
(161, 'Pues mira...', '2026-05-13 11:44:03.000000', b'1', 103, 102, 46, b'1', '1c1ba077-1a2f-4662-be8c-becf91413da1', NULL, NULL),
(162, 'Dime', '2026-05-13 11:44:13.000000', b'1', 102, 103, 46, b'1', '52952105-d156-45e5-b1a6-cbddf448d543', NULL, NULL),
(163, '!!', '2026-05-13 11:44:25.000000', b'1', 102, 103, 46, b'1', '603c4e0c-43d6-4efb-89dc-2a0189e633aa', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje_reaccion`
--

DROP TABLE IF EXISTS `mensaje_reaccion`;
CREATE TABLE `mensaje_reaccion` (
  `id` bigint(20) NOT NULL,
  `mensaje_id` bigint(20) NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  `emoji` varchar(10) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mensaje_reaccion`
--

INSERT INTO `mensaje_reaccion` (`id`, `mensaje_id`, `usuario_id`, `emoji`, `fecha_creacion`) VALUES
(14, 134, 22, '😢', '2026-05-07 10:08:10'),
(17, 163, 102, '👍', '2026-05-13 11:44:53');

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
(40, '2026-05-04 18:23:17.000000', b'0', 'Nueva solicitud de Pablo para el servicio «Instalación lámparas».', 4),
(41, '2026-05-07 07:39:22.000000', b'0', 'Pago #19 confirmado por 30.00 €. Reserva #26 lista para completar.', 48),
(42, '2026-05-13 08:30:34.000000', b'1', 'Nueva solicitud de Pablo para el servicio «Eliminación de cucarachas, hormigas y plagas comunes».', 49),
(43, '2026-05-13 08:43:05.000000', b'1', 'Tu solicitud para «Eliminación de cucarachas, hormigas y plagas comunes» ha sido aceptada.', 22),
(44, '2026-05-13 11:03:53.000000', b'1', 'Nueva solicitud de Pablo para el servicio «Organización de eventos personalizados».', 49),
(45, '2026-05-13 11:15:13.000000', b'1', 'Tu solicitud para «Organización de eventos personalizados» ha sido aceptada.', 22),
(46, '2026-05-13 11:45:44.000000', b'0', 'Nueva solicitud de María para el servicio «Cuidado de bebés responsable y con experiencia».', 102),
(47, '2026-05-13 11:45:58.000000', b'1', 'Tu solicitud para «Cuidado de bebés responsable y con experiencia» ha sido aceptada.', 103);

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
  `reserva_id` bigint(20) NOT NULL,
  `stripe_payment_intent_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`id`, `estado`, `fecha_pago`, `importe`, `metodo`, `reserva_id`, `stripe_payment_intent_id`) VALUES
(1, 'PAGADO', '2026-03-03 12:00:00.000000', 25.00, 'TARJETA', 1, NULL),
(2, 'PAGADO', '2026-03-05 13:00:00.000000', 40.00, 'EFECTIVO', 2, NULL),
(3, 'PAGADO', '2026-03-08 11:00:00.000000', 50.00, 'TARJETA', 5, NULL),
(4, 'PAGADO', '2026-03-13 18:00:00.000000', 45.00, 'TRANSFERENCIA', 9, NULL),
(5, 'PAGADO', '2026-03-17 13:00:00.000000', 20.00, 'EFECTIVO', 12, NULL),
(6, 'PAGADO', '2026-03-19 10:30:00.000000', 24.00, 'TARJETA', 15, NULL),
(7, 'PAGADO', '2026-03-26 10:00:00.000000', 18.00, 'EFECTIVO', 18, NULL),
(8, 'PAGADO', '2026-03-10 12:00:00.000000', 30.00, 'TARJETA', 3, NULL),
(9, 'PAGADO', '2026-03-11 13:00:00.000000', 28.00, 'EFECTIVO', 6, NULL),
(10, 'PAGADO', '2026-03-18 11:00:00.000000', 30.00, 'TRANSFERENCIA', 10, NULL),
(11, 'PAGADO', '2026-03-21 12:00:00.000000', 36.00, 'TARJETA', 13, NULL),
(12, 'PAGADO', '2026-03-23 11:00:00.000000', 60.00, 'TRANSFERENCIA', 16, NULL),
(13, 'PAGADO', '2026-03-27 13:00:00.000000', 50.00, 'TARJETA', 19, NULL),
(14, 'PENDIENTE', '2026-03-12 10:00:00.000000', 60.00, 'TARJETA', 4, NULL),
(15, 'PENDIENTE', '2026-03-20 10:00:00.000000', 55.00, 'TRANSFERENCIA', 11, NULL),
(16, 'PENDIENTE', '2026-05-04 08:35:18.000000', 40.00, 'TARJETA', 24, NULL),
(18, 'PENDIENTE', '2026-05-04 09:07:41.000000', 40.00, 'TARJETA', 25, NULL),
(19, 'PAGADO', '2026-05-04 18:18:49.000000', 30.00, 'TARJETA', 26, NULL),
(21, 'PAGADO', '2026-05-13 08:43:29.000000', 50.00, 'TARJETA', 28, 'pi_3TWYcXHqDwC4Xr6G00z09NbZ'),
(23, 'PAGADO', '2026-05-13 11:15:21.000000', 25.00, 'TARJETA', 29, 'pi_3TWal4HqDwC4Xr6G0yDwgR1D'),
(25, 'PAGADO', '2026-05-13 11:46:09.000000', 10.00, 'TARJETA', 30, 'pi_3TWbEsHqDwC4Xr6G1LZ4jOLt');

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
-- Estructura de tabla para la tabla `profesional_ciudad_servicio`
--

DROP TABLE IF EXISTS `profesional_ciudad_servicio`;
CREATE TABLE `profesional_ciudad_servicio` (
  `profesional_id` bigint(20) NOT NULL,
  `ciudad` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesional_ciudad_servicio`
--

INSERT INTO `profesional_ciudad_servicio` (`profesional_id`, `ciudad`) VALUES
(17, 'Sevilla');

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
(13, NULL, 'Perfil en construcción', 0, NULL, 1, 'BASICO', 5, 45, NULL, NULL, NULL, b'0'),
(14, NULL, 'Perfil en construcción', 0, NULL, 0, 'BASICO', 0, 46, NULL, NULL, NULL, b'0'),
(15, NULL, 'Perfil en construcción', 0, NULL, 0, 'BASICO', 0, 47, NULL, NULL, NULL, b'0'),
(16, NULL, 'Perfil en construcción', 0, NULL, 1, 'BASICO', 4, 48, NULL, NULL, NULL, b'0'),
(17, NULL, 'Perfil en construcción', 0, NULL, 0, 'BASICO', 0, 49, NULL, NULL, NULL, b'0'),
(18, 'B33333333', 'Electricista certificado con 10 años en Madrid. Instalaciones y reparaciones garantizadas.', 10, 'ElectraMiguel', 12, 'PRO', 4.8, 50, '28010', 40.4237, -3.6916, b'1'),
(19, 'B44444444', 'Fontanera profesional en Barcelona. Urgencias 24h, presupuesto siempre gratis.', 7, NULL, 8, 'PREMIUM', 4.6, 51, '08008', 41.3951, 2.1599, b'1'),
(20, NULL, 'Servicio de limpieza económico y de calidad en Valencia. Materiales propios incluidos.', 2, NULL, 4, 'BASICO', 3.9, 52, '46001', 39.4728, -0.3696, b'1'),
(21, NULL, 'Profesor nativo de inglés. Preparación Cambridge, IELTS y conversación fluida.', 5, NULL, 6, 'BASICO', 4.2, 53, '48001', 43.2632, -2.9254, b'1'),
(22, 'B55555555', 'Cuidadora de mayores con titulación oficial. 12 años de experiencia y referencias.', 12, 'CuidadosCármen', 20, 'PREMIUM', 4.9, 54, '50001', 41.6565, -0.8773, b'1'),
(23, 'B66666666', 'Entrenador personal certificado. Planes de ejercicio y nutrición totalmente personalizados.', 8, 'FitRaúl', 15, 'PRO', 4.7, 55, '03001', 38.346, -0.4907, b'1'),
(24, NULL, 'Apasionada de los animales. Paseos, cuidados y hospedaje de mascotas en Murcia.', 3, NULL, 7, 'BASICO', 4.4, 56, '30001', 37.9866, -1.1285, b'1'),
(25, 'B77777777', 'Fontanero urgente con 15 años en Baleares. Disponible 24h todos los días del año.', 15, 'Fontanería Urgente Baleares', 25, 'PRO', 4.3, 57, '07001', 39.5697, 2.6501, b'1'),
(26, NULL, 'Profesora de matemáticas para ESO y bachillerato. Clases individuales con resultados.', 6, NULL, 9, 'BASICO', 4.1, 58, '47001', 41.6523, -4.7213, b'1'),
(27, NULL, 'Masajista y fisioterapeuta titulada. Relajante, deportivo y terapéutico en Santander.', 9, 'PatriciaRelax', 18, 'PREMIUM', 4.8, 59, '39001', 43.4627, -3.8045, b'1'),
(28, NULL, 'Jardinero con pasión por los jardines. Diseño, mantenimiento y poda en Salamanca.', 4, NULL, 5, 'BASICO', 3.7, 60, '37001', 40.9668, -5.6638, b'1'),
(29, 'B88888888', 'Cerrajero urgente en Toledo. Aperturas sin daños, cambios de cerradura y copias de llave.', 11, 'CerrajeríaAndrés', 16, 'PRO', 4.5, 61, '45001', 39.86, -4.0245, b'1'),
(30, NULL, 'Peluquera y estilista a domicilio en Madrid. Cortes, tintes, peinados y maquillaje.', 7, NULL, 11, 'PREMIUM', 4.6, 62, '28004', 40.4239, -3.7009, b'1'),
(31, NULL, 'Fontanero económico en Barcelona. Precios ajustados y trabajos garantizados.', 2, NULL, 3, 'BASICO', 3.5, 63, '08003', 41.3846, 2.1786, b'1'),
(32, 'B99999999', 'Veterinaria a domicilio en Valencia. Consultas, vacunas y urgencias sin salir de casa.', 8, 'VetCasa Valencia', 14, 'PRO', 4.9, 64, '46003', 39.4759, -0.3554, b'1'),
(33, NULL, 'Electricista en Sevilla. Servicio económico para instalaciones básicas y reparaciones menores.', 1, NULL, 2, 'BASICO', 2.8, 65, '41001', 37.3892, -5.9845, b'1'),
(34, 'C11111111', 'Coach certificada ICF. Sesiones individuales de coaching, mindfulness y gestión del estrés.', 10, 'CoachingNatalia', 22, 'PRO', 4.7, 66, '28006', 40.435, -3.6943, b'1'),
(35, NULL, 'Cuidadora de niños con experiencia y paciencia. Referencias disponibles a petición.', 5, NULL, 8, 'PREMIUM', 4.3, 67, '48011', 43.2712, -2.9419, b'1'),
(36, 'C22222222', 'Desarrollador y formador. Clases de Java, Python, web y bases de datos desde cero.', 7, 'CodeDavid', 17, 'PREMIUM', 4.8, 68, '08026', 41.411, 2.19, b'1'),
(37, NULL, 'Especialista en limpieza post obra y garajes en Madrid. Equipos profesionales.', 6, NULL, 9, 'PRO', 4.1, 69, '28020', 40.454, -3.6941, b'1'),
(38, NULL, 'Profesional de la limpieza en Madrid con 6 años. Hogares, oficinas y locales.', 6, NULL, 8, 'PREMIUM', 4.5, 70, '28012', 40.4138, -3.7025, b'1'),
(39, NULL, 'Limpieza y mantenimiento del hogar en Barcelona. Puntual y concienzudo.', 4, NULL, 6, 'BASICO', 4.1, 71, '08007', 41.3925, 2.1602, b'1'),
(40, NULL, 'Servicio integral de limpieza en Valencia. Materiales incluidos.', 3, NULL, 5, 'BASICO', 3.8, 72, '46010', 39.4753, -0.3584, b'1'),
(41, NULL, 'Manitas y jardinería en Zaragoza. Amplia experiencia en servicios del hogar.', 5, NULL, 7, 'PREMIUM', 4.2, 73, '50001', 41.6502, -0.8825, b'1'),
(42, NULL, 'Limpieza económica y eficiente en Sevilla. Horarios flexibles, trato cercano.', 2, NULL, 4, 'BASICO', 3.6, 74, '41002', 37.3951, -5.9932, b'1'),
(43, 'B11100001', 'Electricista industrial y doméstico en Madrid. 12 años de experiencia. Certificado.', 12, 'ElectraMadrid', 18, 'PRO', 4.7, 75, '28010', 40.4304, -3.6833, b'1'),
(44, 'B11100002', 'Electricista certificado en Barcelona. Instalaciones y reparaciones con garantía.', 8, 'Ferrer Electricidad', 14, 'PREMIUM', 4.5, 76, '08036', 41.3802, 2.1546, b'1'),
(45, NULL, 'Electricista autónomo en Valencia. Precios ajustados y trabajo garantizado.', 5, NULL, 9, 'BASICO', 4, 77, '46005', 39.463, -0.3972, b'1'),
(46, 'B11100003', 'Electricista en Bilbao. Urgencias 24h y revisiones de cuadros eléctricos.', 10, 'Lozano Elec', 16, 'PRO', 4.6, 78, '48010', 43.268, -2.942, b'1'),
(47, NULL, 'Técnico electricidad en Málaga. Servicio rápido y económico.', 3, NULL, 5, 'BASICO', 3.9, 79, '29015', 36.72, -4.4196, b'1'),
(48, 'B11100004', 'Fontanero con 14 años en Madrid. Urgencias, fugas y averías de todo tipo. Garantía.', 14, 'PascualFontanería', 22, 'PRO', 4.8, 80, '28004', 40.4226, -3.7022, b'1'),
(49, NULL, 'Fontanero en Barcelona. Rápido, serio y con precios transparentes.', 7, NULL, 11, 'PREMIUM', 4.4, 81, '08003', 41.3831, 2.1825, b'1'),
(50, NULL, 'Fontanería a domicilio en Valencia. Urgencias y reparaciones programadas.', 4, NULL, 6, 'BASICO', 4, 82, '46007', 39.4612, -0.3902, b'1'),
(51, NULL, 'Auxiliar titulada en ayuda a domicilio. Cuidado de mayores y dependientes en Madrid.', 9, NULL, 15, 'PREMIUM', 4.6, 83, '28006', 40.4304, -3.6852, b'1'),
(52, 'B11100005', 'Cuidadora profesional en Barcelona con certificado en gerontología y primeros auxilios.', 6, 'CuidaBeat', 10, 'PREMIUM', 4.4, 84, '08022', 41.401, 2.149, b'1'),
(53, NULL, 'Cuidadora y niñera en Sevilla. Cariñosa, responsable, con referencias.', 4, NULL, 7, 'BASICO', 4.2, 85, '41004', 37.3762, -5.992, b'1'),
(54, NULL, 'Amante de los animales. Paseos, cuidados y adiestramiento en Madrid.', 5, NULL, 9, 'PREMIUM', 4.5, 86, '28015', 40.4276, -3.7182, b'1'),
(55, NULL, 'Cuidadora de mascotas en Barcelona. Tu perro siempre en buenas manos.', 3, NULL, 6, 'BASICO', 4.3, 87, '08026', 41.4122, 2.189, b'1'),
(56, NULL, 'Veterinaria y cuidadora de animales en Valencia. Amor y profesionalidad.', 4, NULL, 7, 'PREMIUM', 4.6, 88, '46019', 39.4811, -0.362, b'1'),
(57, NULL, 'Profesor particular con 10 años. Matemáticas, inglés, programación y baile.', 10, NULL, 20, 'PRO', 4.8, 89, '28009', 40.419, -3.672, b'1'),
(58, 'B11100006', 'Profesora y formadora en Barcelona. Idiomas, informática y música.', 8, 'HidalgoAcademia', 13, 'PREMIUM', 4.5, 90, '08028', 41.3742, 2.1264, b'1'),
(59, NULL, 'Clases particulares de inglés, programación y baile en Valencia.', 5, NULL, 8, 'BASICO', 4.1, 91, '46010', 39.486, -0.3541, b'1'),
(60, NULL, 'Profesora de matemáticas, inglés, programación y baile en Bilbao.', 6, NULL, 10, 'PREMIUM', 4.4, 92, '48001', 43.2562, -2.9221, b'1'),
(61, NULL, 'Peluquera, maquilladora, masajista y entrenadora personal en Madrid.', 8, NULL, 14, 'PREMIUM', 4.6, 93, '28004', 40.4259, -3.7001, b'1'),
(62, NULL, 'Estilista, fisioterapeuta e instructor de yoga y pilates en Barcelona.', 6, NULL, 10, 'PREMIUM', 4.4, 94, '08008', 41.3945, 2.1622, b'1'),
(63, NULL, 'Peluquería, masajes, yoga y entrenamiento a domicilio en Sevilla.', 3, NULL, 5, 'BASICO', 4, 95, '41003', 37.3818, -5.9714, b'1'),
(64, 'B11100007', 'Técnico informático y cerrajero urgente en Madrid. Respuesta inmediata, 24h.', 10, 'SolucionesUrgente', 19, 'PRO', 4.7, 96, '28013', 40.418, -3.701, b'1'),
(65, NULL, 'Informático urgente y cerrajero en Barcelona. Disponible 24h todos los días.', 6, NULL, 11, 'PREMIUM', 4.3, 97, '08001', 41.3808, 2.1751, b'1'),
(66, NULL, 'Técnico en redes WiFi, cerrajería urgente y coaching en Valencia.', 4, NULL, 7, 'BASICO', 4.1, 98, '46002', 39.4704, -0.376, b'1'),
(67, NULL, 'Informático, coach y técnico de redes en Bilbao. Multidisciplinar.', 5, NULL, 8, 'PREMIUM', 4.4, 99, '48003', 43.266, -2.9271, b'1'),
(68, NULL, 'Perfil en construcción', 0, NULL, 0, 'BASICO', 0, 102, NULL, NULL, NULL, b'0');

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
(27, 'PENDIENTE', '2026-05-04 18:23:17.000000', '2026-05-10 15:00:00.000000', 22.00, 22, 8, '', 0, NULL),
(28, 'CONFIRMADA', '2026-05-13 08:30:34.000000', '2026-05-20 10:30:00.000000', 50.00, 22, 41, 'Hola, necesito ayuda porque han aparecido cucarachas y algunas hormigas en mi piso, sobre todo por la zona de la cocina. Soy estudiante y no sé muy bien de dónde vienen, pero cada vez veo más. Me gustaría hacer un tratamiento para eliminarlas y evitar que vuelvan a salir.', 0, NULL),
(29, 'CONFIRMADA', '2026-05-13 11:03:53.000000', '2026-05-30 16:00:00.000000', 25.00, 22, 284, 'Hola, necesito ayuda para organizar un evento personalizado. No lo tengo muy claro todavía, así que me gustaría que me ayudaras con ideas, actividades y cómo organizarlo paso a paso. También necesito orientación para decidir el tipo de evento y que todo quede bien montado.', 0, NULL),
(30, 'CONFIRMADA', '2026-05-13 11:45:44.000000', '2026-05-20 13:45:00.000000', 10.00, 103, 285, 'Hola, necesitaría cuidado para un bebé el día 20/05/2026 sobre las 15:45. Busco a una persona responsable, puntual y con experiencia. Sería para unas horas mientras trabajo. Gracias.', 0, NULL);

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
(40, b'1', 'Limpieza, control de cloro y pH, revisión de filtros y mantenimiento general. Servicio puntual o periódico para mantener el agua en perfecto estado.', 120, 20.00, 'Mantenimiento de piscina completo', 16, 12),
(41, b'1', 'Ofrezco un servicio de control básico de plagas para casas, pisos, oficinas y pequeños locales. Me encargo de eliminar insectos comunes como cucarachas, hormigas, arañas y otros problemas similares usando productos seguros y efectivos. Trabajo de forma limpia y rápida, intentando también prevenir que la plaga vuelva a aparecer en el futuro.', 120, 25.00, 'Eliminación de cucarachas, hormigas y plagas comunes', 17, 24),
(42, b'1', 'Reparación de instalaciones eléctricas residenciales. Diagnóstico y presupuesto gratuito.', 60, 35.00, 'Reparación eléctrica Madrid', 18, 26),
(43, b'1', 'Intervención en menos de 2h. Disponible 24h incluidos festivos y fines de semana.', 60, 50.00, 'Electricista urgente 24h Madrid', 18, 128),
(44, b'1', 'Detección y reparación de fugas, averías y tuberías. Servicio garantizado.', 60, 30.00, 'Reparación fontanería Barcelona', 19, 30),
(45, b'1', 'Urgencias de fontanería en Barcelona. Respuesta en menos de 60 minutos.', 60, 45.00, 'Fontanero urgente Barcelona', 19, 127),
(46, b'1', 'Limpieza completa del hogar. Cocina, baños y habitaciones. Materiales incluidos.', 120, 12.00, 'Limpieza del hogar Valencia', 20, 1),
(47, b'1', 'Limpieza en profundidad con desinfección y desengrasado. Ideal tras mudanza.', 180, 14.00, 'Limpieza profunda Valencia', 20, 2),
(48, b'1', 'Clases individuales de inglés conversacional. Nivel A1 a C2. Flexible de horario.', 60, 20.00, 'Inglés conversación Bilbao', 21, 104),
(49, b'1', 'Preparación para exámenes Cambridge, IELTS y TOEFL con metodología probada.', 60, 22.00, 'Inglés exámenes Bilbao', 21, 105),
(50, b'1', 'Cuidado profesional de personas mayores en su domicilio. Higiene, medicación y compañía.', 240, 15.00, 'Cuidado de mayores Zaragoza', 22, 51),
(51, b'1', 'Atención integral a personas con dependencia reconocida. Titulación oficial.', 480, 14.00, 'Cuidado de dependientes Zaragoza', 22, 52),
(52, b'1', 'Entrenamiento personal adaptado a tus objetivos, condición física y disponibilidad.', 60, 40.00, 'Entrenador personal Alicante', 23, 68),
(53, b'1', 'Sesiones de yoga para todos los niveles. Respiración, relajación y flexibilidad.', 60, 25.00, 'Yoga a domicilio Alicante', 23, 69),
(54, b'1', 'Paseos de 30 y 60 minutos. Grupos reducidos. Rutas variadas por la ciudad.', 60, 12.00, 'Paseo de perros Murcia', 24, 76),
(55, b'1', 'Cuidado de perros en tu domicilio mientras estás fuera o trabajas.', 480, 10.00, 'Cuidado de perros en casa Murcia', 24, 77),
(56, b'1', 'Fontanería urgente en Mallorca. Garantía de satisfacción. Sin desplazamiento.', 60, 60.00, 'Fontanero urgente Palma 24h', 25, 127),
(57, b'1', 'Resolución urgente de atascos en tuberías domésticas sin obra.', 90, 45.00, 'Desatascos urgentes Palma', 25, 130),
(58, b'1', 'Clases de matemáticas para la ESO. Refuerzo y preparación de exámenes.', 60, 25.00, 'Matemáticas ESO Valladolid', 26, 102),
(59, b'1', 'Preparación para selectividad y bachillerato. Resultados garantizados.', 60, 30.00, 'Matemáticas bachillerato Valladolid', 26, 103),
(60, b'1', 'Masaje relajante sueco y de tejido profundo en tu domicilio. Camilla propia.', 60, 45.00, 'Masajes a domicilio Santander', 27, 65),
(61, b'1', 'Fisioterapia de rehabilitación y tratamiento de lesiones deportivas.', 60, 55.00, 'Fisioterapia a domicilio Santander', 27, 66),
(62, b'1', 'Diseño y mantenimiento de jardines privados en Salamanca y alrededores.', 120, 20.00, 'Mantenimiento de jardín Salamanca', 28, 8),
(63, b'1', 'Corte de césped y recorte de bordes. Precio cerrado por sesión.', 60, 15.00, 'Corte de césped Salamanca', 28, 10),
(64, b'1', 'Apertura de puertas sin daños en 30 minutos. Servicio en toda la provincia.', 60, 55.00, 'Cerrajero urgente Toledo', 29, 129),
(65, b'1', 'Instalación de cerraduras de alta seguridad. Asesoramiento incluido.', 60, 50.00, 'Cambio de cerradura Toledo', 29, 134),
(66, b'1', 'Cortes, tintes y peinados en tu domicilio. Productos profesionales de primera calidad.', 60, 35.00, 'Peluquería a domicilio Madrid', 30, 59),
(67, b'1', 'Maquillaje profesional para bodas, eventos y fotografía.', 90, 40.00, 'Maquillaje profesional Madrid', 30, 60),
(68, b'1', 'Reparación de grifos, cisternas y sanitarios. Presupuesto previo sin coste.', 60, 18.00, 'Reparación de grifos Barcelona', 31, 32),
(69, b'1', 'Desatascos sin obra con máquina de presión de alta potencia.', 60, 22.00, 'Desatascos Barcelona', 31, 33),
(70, b'1', 'Consultas veterinarias, vacunas y diagnóstico en casa. Sin estrés para tu mascota.', 60, 70.00, 'Veterinario a domicilio Valencia', 32, 89),
(71, b'1', 'Administración de tratamientos y medicación para mascotas. Pauta incluida.', 30, 35.00, 'Administración medicación mascotas', 32, 90),
(72, b'1', 'Instalación y reparación de enchufes e interruptores. Precio cerrado.', 60, 15.00, 'Reparación de enchufes Sevilla', 33, 27),
(73, b'1', 'Cambio de bombillas normales, LED y de bajo consumo.', 30, 10.00, 'Cambio de bombillas Sevilla', 33, 6),
(74, b'1', 'Sesiones de coaching individual para alcanzar tus metas personales y profesionales.', 60, 80.00, 'Coaching personal Madrid', 34, 170),
(75, b'1', 'Introducción al mindfulness. Técnicas de reducción del estrés y meditación.', 60, 60.00, 'Mindfulness en casa Madrid', 34, 174),
(76, b'1', 'Cuidado de niños de 0 a 12 años en su domicilio. Actividades educativas y juego.', 480, 14.00, 'Cuidado de niños Bilbao', 35, 55),
(77, b'1', 'Servicio de niñera flexible por horas. Sin mínimo de horas.', 120, 12.00, 'Niñera a domicilio Bilbao', 35, 56),
(78, b'1', 'Clases de Java, Spring Boot y patrones de diseño. Nivel básico a avanzado.', 60, 45.00, 'Programación Java Barcelona', 36, 109),
(79, b'1', 'Aprende HTML, CSS, JavaScript y React desde cero hasta nivel profesional.', 60, 40.00, 'Desarrollo web Barcelona', 36, 110),
(80, b'1', 'Limpieza especializada tras obras de construcción o reforma. Equipo propio.', 180, 16.00, 'Limpieza post obra Madrid', 37, 3),
(81, b'1', 'Limpieza de garajes, trasteros y zonas de almacenaje. Presupuesto gratis.', 120, 14.00, 'Limpieza de garaje Madrid', 37, 15),
(82, b'1', 'Limpieza completa del hogar: cocina, baños y habitaciones. Materiales incluidos.', 120, 15.00, 'Limpieza del hogar Madrid', 38, 1),
(83, b'1', 'Limpieza profunda con desengrasante y desinfección. Ideal tras mudanza.', 180, 18.00, 'Limpieza profunda Madrid', 38, 2),
(84, b'1', 'Limpieza especializada post reforma. Eliminamos polvo, pintura y restos de obra.', 180, 17.00, 'Limpieza post obra Madrid', 38, 3),
(85, b'1', 'Pequeñas reparaciones y arreglos del hogar. Sin obra, sin licencia.', 60, 22.00, 'Servicio de manitas Madrid', 38, 5),
(86, b'1', 'Poda de plantas ornamentales y setos en terraza o jardín. Herramientas propias.', 60, 15.00, 'Poda de plantas Madrid', 38, 9),
(87, b'1', 'Mantenimiento semanal de piscinas privadas: limpieza y control químico.', 90, 30.00, 'Mantenimiento de piscina Madrid', 38, 12),
(88, b'1', 'Organización de armarios, cocina y almacenaje. Método KonMari adaptado.', 90, 22.00, 'Organización del hogar Madrid', 38, 21),
(89, b'1', 'Servicio de limpieza a domicilio en Barcelona. Puntual y minucioso.', 120, 14.00, 'Limpieza del hogar Barcelona', 39, 1),
(90, b'1', 'Limpieza en profundidad con productos ecológicos. Resultado garantizado.', 180, 16.00, 'Limpieza profunda Barcelona', 39, 2),
(91, b'1', 'Limpieza post reforma con maquinaria profesional. Presupuesto sin compromiso.', 180, 16.00, 'Limpieza post obra Barcelona', 39, 3),
(92, b'1', 'Arreglos varios en el hogar: cuelgas, montajes y pequeñas reparaciones.', 60, 20.00, 'Manitas Barcelona', 39, 5),
(93, b'1', 'Mantenimiento de piscina: limpieza de filtros, análisis y equilibrado del agua.', 90, 28.00, 'Piscina Barcelona', 39, 12),
(94, b'1', 'Limpieza y vaciado de garajes. Organización incluida si se solicita.', 120, 16.00, 'Limpieza de garaje Barcelona', 39, 15),
(95, b'1', 'Fumigación y control de cucarachas, hormigas y otros insectos domésticos.', 60, 26.00, 'Control de plagas Barcelona', 39, 24),
(96, b'1', 'Limpieza intensiva con desinfección y desengrasado. Ideal para pisos de alquiler.', 180, 15.00, 'Limpieza profunda Valencia', 40, 2),
(97, b'1', 'Limpieza post reforma en Valencia. Dejamos tu casa como nueva.', 180, 15.00, 'Limpieza post reforma Valencia', 40, 3),
(98, b'1', 'Poda y recorte de plantas en terrazas y jardines. Técnica y herramientas propias.', 60, 14.00, 'Poda de plantas Valencia', 40, 9),
(99, b'1', 'Revisión y limpieza de piscinas. Vacuolado, tratamiento y análisis de agua.', 90, 25.00, 'Mantenimiento de piscina Valencia', 40, 12),
(100, b'1', 'Limpieza de garajes y trasteros. Retirada de residuos incluida.', 120, 15.00, 'Limpieza de garaje Valencia', 40, 15),
(101, b'1', 'Organización del hogar: armarios, despensa y zonas de almacenaje.', 90, 20.00, 'Organización del hogar Valencia', 40, 21),
(102, b'1', 'Tratamiento antiplagas: cucarachas, ratones y mosquitos. Productos homologados.', 60, 24.00, 'Control de plagas Valencia', 40, 24),
(103, b'1', 'Limpieza a domicilio en Zaragoza. Responsable y eficaz. Precio cerrado.', 120, 13.00, 'Limpieza del hogar Zaragoza', 41, 1),
(104, b'1', 'Manitas en Zaragoza: cuelgas, montaje de muebles y pequeñas reparaciones.', 60, 18.00, 'Manitas Zaragoza', 41, 5),
(105, b'1', 'Mantenimiento de jardines privados. Riego, abonado y poda incluidos.', 120, 18.00, 'Mantenimiento jardín Zaragoza', 41, 8),
(106, b'1', 'Siega de césped y recorte de bordes. Precio fijo por metro cuadrado.', 60, 14.00, 'Corte de césped Zaragoza', 41, 10),
(107, b'1', 'Control de plagas en Zaragoza. Sin olor residual, mascotas y niños seguros.', 60, 22.00, 'Control de plagas Zaragoza', 41, 24),
(108, b'1', 'Home organizer en Zaragoza. Orden y optimización de cada espacio.', 90, 18.00, 'Organización del hogar Zaragoza', 41, 21),
(109, b'1', 'Limpieza de garajes y plazas de aparcamiento. Aspiración y fregado industrial.', 120, 14.00, 'Limpieza de garaje Zaragoza', 41, 15),
(110, b'1', 'Limpieza profunda de pisos y locales en Sevilla. Materiales de primera calidad.', 180, 13.00, 'Limpieza profunda Sevilla', 42, 2),
(111, b'1', 'Manitas en Sevilla: cuelgas, pequeñas reparaciones y montaje de muebles.', 60, 18.00, 'Manitas Sevilla', 42, 5),
(112, b'1', 'Mantenimiento de jardines en Sevilla. Poda, riego y fertilización.', 120, 16.00, 'Mantenimiento jardín Sevilla', 42, 8),
(113, b'1', 'Poda de árboles ornamentales y arbustos. Herramientas y técnica adecuada.', 60, 13.00, 'Poda de plantas Sevilla', 42, 9),
(114, b'1', 'Siega y mantenimiento de césped en Sevilla. Presupuesto sin compromiso.', 60, 13.00, 'Corte de césped Sevilla', 42, 10),
(115, b'1', 'Mantenimiento de piscinas en Sevilla. Análisis semanal y equilibrado.', 90, 22.00, 'Mantenimiento de piscina Sevilla', 42, 12),
(116, b'1', 'Desinsectación y desratización en Sevilla. Productos ecológicos disponibles.', 60, 20.00, 'Control de plagas Sevilla', 42, 24),
(117, b'1', 'Instalación y reparación eléctrica en Madrid. 12 años de experiencia. Garantía.', 60, 38.00, 'Reparación eléctrica Madrid', 43, 26),
(118, b'1', 'Cambio y reparación de enchufes e interruptores. Trabajo limpio y rápido.', 30, 28.00, 'Reparación de enchufes Madrid', 43, 27),
(119, b'1', 'Sustitución de bombillas fundidas. LED, halógena y bajo consumo.', 30, 14.00, 'Cambio de bombillas Madrid', 43, 6),
(120, b'1', 'Montaje e instalación de lámparas de techo, pared y apliques.', 60, 22.00, 'Instalación de lámparas Madrid', 43, 7),
(121, b'1', 'Revisión y actualización de cuadros eléctricos. Diferenciales y magnetotérmicos.', 60, 45.00, 'Cuadro eléctrico Madrid', 43, 29),
(122, b'1', 'Reparación de frigoríficos y congeladores a domicilio. Todas las marcas.', 60, 52.00, 'Reparación frigoríficos Madrid', 43, 40),
(123, b'1', 'Reparación de lavadoras en tu domicilio. Garantía de 3 meses incluida.', 60, 48.00, 'Reparación lavadoras Madrid', 43, 39),
(124, b'1', 'Electricista urgente 24h en Madrid. Cortocircuitos, cortes de luz y averías.', 60, 65.00, 'Electricista urgente Madrid', 43, 128),
(125, b'1', 'Reparaciones eléctricas en Barcelona. Certificado de instalaciones.', 60, 35.00, 'Reparación eléctrica Barcelona', 44, 26),
(126, b'1', 'Cambio de enchufes e interruptores en Barcelona. Sin perforar.', 30, 25.00, 'Enchufes Barcelona', 44, 27),
(127, b'1', 'Cambio de bombillas en Barcelona. Asesoramiento sobre iluminación LED.', 30, 12.00, 'Bombillas Barcelona', 44, 6),
(128, b'1', 'Instalación de lámparas en Barcelona. Todo tipo de modelos y fabricantes.', 60, 20.00, 'Lámparas Barcelona', 44, 7),
(129, b'1', 'Mantenimiento y reparación de aires acondicionados. Todas las marcas.', 60, 55.00, 'Aire acondicionado Barcelona', 44, 37),
(130, b'1', 'Reparación de frigoríficos a domicilio en Barcelona. Diagnóstico en visita.', 60, 50.00, 'Frigoríficos Barcelona', 44, 40),
(131, b'1', 'Técnico de hornos y vitrocerámicas en Barcelona. Reparación rápida.', 60, 45.00, 'Hornos Barcelona', 44, 41),
(132, b'1', 'Electricista urgente en Barcelona disponible 24h. Sin recargo nocturno.', 60, 62.00, 'Electricista urgente Barcelona', 44, 128),
(133, b'1', 'Electricista en Valencia. Instalaciones y reparaciones con presupuesto gratuito.', 60, 32.00, 'Reparación eléctrica Valencia', 45, 26),
(134, b'1', 'Reparación de enchufes e interruptores en Valencia. Trabajo sin perforaciones.', 30, 22.00, 'Enchufes Valencia', 45, 27),
(135, b'1', 'Cambio de bombillas y revisión de luminarias en Valencia.', 30, 11.00, 'Bombillas Valencia', 45, 6),
(136, b'1', 'Revisión y reparación de cuadro eléctrico en Valencia. Certificado incluido.', 60, 40.00, 'Cuadro eléctrico Valencia', 45, 29),
(137, b'1', 'Reparación de climatizadores y splits en Valencia. Todas las marcas.', 60, 50.00, 'Climatización Valencia', 45, 37),
(138, b'1', 'Reparación de lavavajillas a domicilio en Valencia. Garantía incluida.', 60, 44.00, 'Lavavajillas Valencia', 45, 42),
(139, b'1', 'Técnico de lavadoras en Valencia. Sin desplazamiento al taller.', 60, 45.00, 'Lavadoras Valencia', 45, 39),
(140, b'1', 'Electricista urgente Valencia 24h. Cortes de luz y averías resueltas al momento.', 60, 58.00, 'Electricista urgente Valencia', 45, 128),
(141, b'1', 'Electricista en Bilbao. Instalaciones industriales y domésticas.', 60, 40.00, 'Reparación eléctrica Bilbao', 46, 26),
(142, b'1', 'Cambio de enchufes en Bilbao. Rápido, eficaz y con garantía.', 30, 26.00, 'Enchufes Bilbao', 46, 27),
(143, b'1', 'Instalación de lámparas y apliques en Bilbao. Trabajo limpio y cuidado.', 60, 22.00, 'Lámparas Bilbao', 46, 7),
(144, b'1', 'Cuadro eléctrico Bilbao. Revisión normativa y actualización de diferenciales.', 60, 44.00, 'Cuadro eléctrico Bilbao', 46, 29),
(145, b'1', 'Reparación de frigoríficos en Bilbao. Revisión completa con diagnóstico.', 60, 50.00, 'Frigoríficos Bilbao', 46, 40),
(146, b'1', 'Reparación de hornos eléctricos y de gas en Bilbao. Todas las marcas.', 60, 46.00, 'Hornos Bilbao', 46, 41),
(147, b'1', 'Reparación de lavavajillas en Bilbao. Avería diagnosticada en primera visita.', 60, 44.00, 'Lavavajillas Bilbao', 46, 42),
(148, b'1', 'Electricista urgente 24h Bilbao. Festivos y fines de semana sin recargo.', 60, 60.00, 'Electricista urgente Bilbao', 46, 128),
(149, b'1', 'Electricista en Málaga. Instalaciones y reparaciones con precios ajustados.', 60, 32.00, 'Reparación eléctrica Málaga', 47, 26),
(150, b'1', 'Cambio de enchufes e interruptores en Málaga. Presupuesto gratuito.', 30, 22.00, 'Enchufes Málaga', 47, 27),
(151, b'1', 'Cambio de bombillas en Málaga. Consejos de ahorro energético incluidos.', 30, 10.00, 'Bombillas Málaga', 47, 6),
(152, b'1', 'Instalación de lámparas en Málaga. Modelos modernos y clásicos.', 60, 19.00, 'Lámparas Málaga', 47, 7),
(153, b'1', 'Reparación de aires acondicionados en Málaga. Recarga de gas y mantenimiento.', 60, 50.00, 'Climatización Málaga', 47, 37),
(154, b'1', 'Reparación de hornos y placas en Málaga. Sin necesidad de llevarlos a taller.', 60, 42.00, 'Hornos Málaga', 47, 41),
(155, b'1', 'Reparación de lavavajillas en Málaga. Revisión completa y garantía.', 60, 40.00, 'Lavavajillas Málaga', 47, 42),
(156, b'1', 'Reparación de lavadoras en Málaga. Técnico certificado. Garantía de 3 meses.', 60, 44.00, 'Lavadoras Málaga', 47, 39),
(157, b'1', 'Fontanería doméstica en Madrid. Averías, cambios y mejoras. Sin sorpresas.', 60, 36.00, 'Fontanería Madrid', 48, 30),
(158, b'1', 'Detección y reparación de fugas sin obra innecesaria. Técnica no invasiva.', 60, 42.00, 'Fugas de agua Madrid', 48, 31),
(159, b'1', 'Cambio y reparación de grifos y mezcladores. Todas las marcas.', 30, 24.00, 'Grifos Madrid', 48, 32),
(160, b'1', 'Desatascos de fregaderos, bañeras e inodoros. Máquina de presión profesional.', 60, 35.00, 'Desatascos Madrid', 48, 33),
(161, b'1', 'Fontanero urgente 24h Madrid. Fugas, roturas y atascos resueltos en menos de 1h.', 60, 58.00, 'Fontanero urgente Madrid', 48, 127),
(162, b'1', 'Desatascos urgentes en Madrid. Técnica hydrojet para atascos graves.', 60, 62.00, 'Desatascos urgentes Madrid', 48, 130),
(163, b'1', 'Fontanero en Barcelona. Rápido y transparente. Visita gratuita con diagnóstico.', 60, 33.00, 'Fontanería Barcelona', 49, 30),
(164, b'1', 'Localizo y reparo fugas de agua en Barcelona. Certificado de reparación.', 60, 40.00, 'Fugas de agua Barcelona', 49, 31),
(165, b'1', 'Reparación de grifos que gotean o no funcionan en Barcelona.', 30, 22.00, 'Grifos Barcelona', 49, 32),
(166, b'1', 'Desatascos de tuberías en Barcelona. Sin obra y con garantía de resultado.', 60, 32.00, 'Desatascos Barcelona', 49, 33),
(167, b'1', 'Fontanero urgente 24h en Barcelona. Festivos sin recargo adicional.', 60, 55.00, 'Fontanero urgente Barcelona', 49, 127),
(168, b'1', 'Desatascos urgentes Barcelona. Máquina de presión de alta potencia.', 60, 58.00, 'Desatascos urgentes Barcelona', 49, 130),
(169, b'1', 'Fontanería a domicilio en Valencia. Trabajos de calidad a precios ajustados.', 60, 30.00, 'Fontanería Valencia', 50, 30),
(170, b'1', 'Reparación urgente de fugas en Valencia. Mínima intervención garantizada.', 60, 36.00, 'Fugas de agua Valencia', 50, 31),
(171, b'1', 'Reparación de grifos y llaves de paso en Valencia. Todas las marcas.', 30, 20.00, 'Grifos Valencia', 50, 32),
(172, b'1', 'Desatasco de tuberías y sanitarios en Valencia. Presupuesto previo gratis.', 60, 30.00, 'Desatascos Valencia', 50, 33),
(173, b'1', 'Fontanero urgente en Valencia disponible 24h. Respuesta en menos de 90 minutos.', 60, 52.00, 'Fontanero urgente Valencia', 50, 127),
(174, b'1', 'Desatascos urgentes en Valencia. Técnica de alta presión. Sin obras.', 60, 55.00, 'Desatascos urgentes Valencia', 50, 130),
(175, b'1', 'Cuidado de personas mayores en domicilio. Higiene, medicación y compañía.', 240, 16.00, 'Cuidado de mayores Madrid', 51, 51),
(176, b'1', 'Asistencia a personas dependientes en Madrid. Titulación oficial.', 480, 15.00, 'Cuidado de dependientes Madrid', 51, 52),
(177, b'1', 'Acompañamiento en casa para mayores o personas con movilidad reducida.', 180, 13.00, 'Acompañamiento en casa Madrid', 51, 53),
(178, b'1', 'Cuidado de niños en domicilio. De 0 a 12 años. Actividades educativas.', 120, 14.00, 'Cuidado de niños Madrid', 51, 55),
(179, b'1', 'Niñera con experiencia en Madrid. Cuidado responsable por horas.', 120, 13.00, 'Niñera Madrid', 51, 56),
(180, b'1', 'Cuidado de mayores en Barcelona. Certificado en gerontología y primeros auxilios.', 240, 17.00, 'Cuidado de mayores Barcelona', 52, 51),
(181, b'1', 'Asistente a domicilio para personas con dependencia reconocida en Barcelona.', 480, 16.00, 'Dependientes Barcelona', 52, 52),
(182, b'1', 'Compañía y acompañamiento a domicilio en Barcelona. Paciencia y empatía.', 180, 14.00, 'Acompañamiento Barcelona', 52, 53),
(183, b'1', 'Cuidadora infantil titulada en Barcelona. Niños de 0 a 10 años.', 120, 15.00, 'Cuidado niños Barcelona', 52, 55),
(184, b'1', 'Niñera en Barcelona. Flexible de horario, con referencias comprobables.', 120, 14.00, 'Niñera Barcelona', 52, 56),
(185, b'1', 'Cuidadora de mayores en Sevilla. Trato humano y profesional garantizado.', 240, 14.00, 'Cuidado de mayores Sevilla', 53, 51),
(186, b'1', 'Asistencia a personas dependientes en Sevilla. Experiencia y dedicación.', 480, 14.00, 'Dependientes Sevilla', 53, 52),
(187, b'1', 'Servicio de compañía a domicilio en Sevilla. Conversación, paseos y apoyo.', 180, 12.00, 'Acompañamiento Sevilla', 53, 53),
(188, b'1', 'Cuidado de niños en Sevilla. Entretenimiento educativo garantizado.', 120, 13.00, 'Cuidado niños Sevilla', 53, 55),
(189, b'1', 'Niñera disponible en Sevilla. Cariño y responsabilidad ante todo.', 120, 12.00, 'Niñera Sevilla', 53, 56),
(190, b'1', 'Paseos de perros en Madrid. Rutas seguras, grupos de máximo 3.', 60, 14.00, 'Paseo de perros Madrid', 54, 76),
(191, b'1', 'Cuido a tu perro en su domicilio mientras trabajas. Fotos incluidas.', 480, 13.00, 'Cuidado de perros en casa Madrid', 54, 77),
(192, b'1', 'Adiestramiento básico en Madrid. Sit, stay, come y socialización canina.', 60, 30.00, 'Adiestramiento básico Madrid', 54, 83),
(193, b'1', 'Visita veterinaria a domicilio en Madrid. Consulta, vacunas y diagnóstico.', 60, 65.00, 'Veterinario a domicilio Madrid', 54, 89),
(194, b'1', 'Administración de medicación a mascotas en Madrid. Inyecciones y pastillas.', 30, 28.00, 'Medicación mascotas Madrid', 54, 90),
(195, b'1', 'Paseadora de perros en Barcelona. Grupos reducidos, rutas variadas.', 60, 13.00, 'Paseo de perros Barcelona', 55, 76),
(196, b'1', 'Pet sitting en Barcelona. Tu perro feliz en casa con toda la atención.', 480, 12.00, 'Cuidado de perros Barcelona', 55, 77),
(197, b'1', 'Educación canina básica en Barcelona. Método positivo, sin castigos.', 60, 28.00, 'Adiestramiento básico Barcelona', 55, 83),
(198, b'1', 'Veterinaria a domicilio en Barcelona. Sin el estrés de la clínica.', 60, 60.00, 'Veterinario a domicilio Barcelona', 55, 89),
(199, b'1', 'Administración de tratamientos a mascotas en Barcelona. Con pauta incluida.', 30, 26.00, 'Medicación mascotas Barcelona', 55, 90),
(200, b'1', 'Paseo de perros en Valencia. Seguro, responsable y puntual. Fotos diarias.', 60, 12.00, 'Paseo de perros Valencia', 56, 76),
(201, b'1', 'Cuido tu perro en casa en Valencia. Cariño y atención garantizados.', 480, 11.00, 'Cuidado de perros Valencia', 56, 77),
(202, b'1', 'Adiestramiento básico de perros en Valencia. Sesiones individuales.', 60, 26.00, 'Adiestramiento básico Valencia', 56, 83),
(203, b'1', 'Consulta veterinaria a domicilio en Valencia. Vacunas y revisiones.', 60, 57.00, 'Veterinario a domicilio Valencia', 56, 89),
(204, b'1', 'Pauta y administración de medicación a mascotas en Valencia.', 30, 25.00, 'Medicación mascotas Valencia', 56, 90),
(205, b'1', 'Matemáticas para primaria en Madrid. Refuerzo escolar con metodología visual.', 60, 20.00, 'Matemáticas primaria Madrid', 57, 102),
(206, b'1', 'Matemáticas de bachillerato en Madrid. Análisis, álgebra y estadística.', 60, 28.00, 'Matemáticas bachillerato Madrid', 57, 103),
(207, b'1', 'Inglés conversacional en Madrid. Profesor con acento neutro. Todos los niveles.', 60, 24.00, 'Inglés conversación Madrid', 57, 104),
(208, b'1', 'Gramática inglesa en Madrid. Tiempos verbales, estructura y vocabulario.', 60, 24.00, 'Inglés gramática Madrid', 57, 105),
(209, b'1', 'Desarrollo web en Madrid. HTML, CSS, JavaScript y React desde cero.', 60, 35.00, 'Desarrollo web Madrid', 57, 110),
(210, b'1', 'Baile urbano en Madrid. Hip-hop y street dance para todos los niveles.', 60, 22.00, 'Baile urbano Madrid', 57, 119),
(211, b'1', 'Alemán desde cero en Madrid. Vocabulario, pronunciación y gramática A1-A2.', 60, 24.00, 'Alemán Madrid', 57, 126),
(212, b'1', 'Clases de matemáticas de primaria en Barcelona. Paciencia y resultados.', 60, 18.00, 'Matemáticas primaria Barcelona', 58, 102),
(213, b'1', 'Matemáticas de bachillerato en Barcelona. Preparación selectividad.', 60, 25.00, 'Matemáticas bachillerato Barcelona', 58, 103),
(214, b'1', 'Gramática inglesa en Barcelona. Preparación Cambridge y IELTS.', 60, 22.00, 'Inglés gramática Barcelona', 58, 105),
(215, b'1', 'Programación Java en Barcelona. Desde POO básico a Spring Boot.', 60, 38.00, 'Java Barcelona', 58, 109),
(216, b'1', 'Programación web en Barcelona. Frontend moderno: HTML, CSS y JavaScript.', 60, 33.00, 'Web Barcelona', 58, 110),
(217, b'1', 'Guitarra acústica en Barcelona. Acordes, ritmos y tus canciones favoritas.', 60, 24.00, 'Guitarra acústica Barcelona', 58, 114),
(218, b'1', 'Salsa y bachata en Barcelona. Clases para principiantes y nivel medio.', 60, 22.00, 'Baile latino Barcelona', 58, 120),
(219, b'1', 'Alemán nivel A1-A2 en Barcelona. Enfoque comunicativo y conversacional.', 60, 22.00, 'Alemán Barcelona', 58, 126),
(220, b'1', 'Inglés conversacional en Valencia. Fluidez y pronunciación correcta.', 60, 22.00, 'Inglés conversación Valencia', 59, 104),
(221, b'1', 'Gramática inglesa en Valencia. Estructura y tiempos verbales desde cero.', 60, 22.00, 'Inglés gramática Valencia', 59, 105),
(222, b'1', 'Programación Java en Valencia. Backend, APIs REST y bases de datos.', 60, 35.00, 'Java Valencia', 59, 109),
(223, b'1', 'Guitarra acústica en Valencia. Aprende tus canciones favoritas desde cero.', 60, 22.00, 'Guitarra acústica Valencia', 59, 114),
(224, b'1', 'Baile urbano en Valencia. Hip-hop y freestyle para principiantes.', 60, 20.00, 'Baile urbano Valencia', 59, 119),
(225, b'1', 'Baile latino en Valencia. Salsa, bachata y cha-cha para todos los niveles.', 60, 20.00, 'Baile latino Valencia', 59, 120),
(226, b'1', 'Alemán básico en Valencia. Pronunciación, vocabulario y gramática A1.', 60, 20.00, 'Alemán Valencia', 59, 126),
(227, b'1', 'Matemáticas primaria en Bilbao. Refuerzo y apoyo escolar personalizado.', 60, 20.00, 'Matemáticas primaria Bilbao', 60, 102),
(228, b'1', 'Matemáticas bachillerato en Bilbao. Exámenes y selectividad.', 60, 26.00, 'Matemáticas bachillerato Bilbao', 60, 103),
(229, b'1', 'Inglés conversacional en Bilbao. Práctica oral para perder el miedo.', 60, 22.00, 'Inglés conversación Bilbao', 60, 104),
(230, b'1', 'Programación Java en Bilbao. Proyectos reales desde el primer día.', 60, 36.00, 'Java Bilbao', 60, 109),
(231, b'1', 'Desarrollo web en Bilbao. HTML, CSS, JavaScript y frameworks modernos.', 60, 32.00, 'Web Bilbao', 60, 110),
(232, b'1', 'Guitarra acústica en Bilbao. Metodología progresiva y divertida.', 60, 22.00, 'Guitarra acústica Bilbao', 60, 114),
(233, b'1', 'Baile urbano en Bilbao. Aprende hip-hop y street dance con estilo.', 60, 20.00, 'Baile urbano Bilbao', 60, 119),
(234, b'1', 'Baile latino en Bilbao. Salsa y bachata para principiantes y nivel medio.', 60, 20.00, 'Baile latino Bilbao', 60, 120),
(235, b'1', 'Peluquería a domicilio en Madrid. Cortes, tintes y peinados. Material profesional.', 60, 35.00, 'Peluquería a domicilio Madrid', 61, 59),
(236, b'1', 'Maquillaje profesional en Madrid. Bodas, eventos y fotografía.', 90, 42.00, 'Maquillaje Madrid', 61, 60),
(237, b'1', 'Masajes relajantes y descontracturantes a domicilio en Madrid. Camilla propia.', 60, 45.00, 'Masajes Madrid', 61, 65),
(238, b'1', 'Fisioterapia de recuperación en Madrid. Contracturas, lesiones y dolor crónico.', 60, 57.00, 'Fisioterapia Madrid', 61, 66),
(239, b'1', 'Entrenadora personal en Madrid. Plan adaptado a tus objetivos y nivel.', 60, 40.00, 'Entrenadora personal Madrid', 61, 68),
(240, b'1', 'Clases de yoga a domicilio en Madrid. Hatha y vinyasa para todos los niveles.', 60, 25.00, 'Yoga Madrid', 61, 69),
(241, b'1', 'Pilates mat a domicilio en Madrid. Material y programa personal incluidos.', 60, 25.00, 'Pilates Madrid', 61, 70),
(242, b'1', 'Peluquero a domicilio en Barcelona. Cortes modernos y coloración profesional.', 60, 32.00, 'Peluquería a domicilio Barcelona', 62, 59),
(243, b'1', 'Maquillaje profesional en Barcelona. Novias, eventos y maquillaje artístico.', 90, 40.00, 'Maquillaje Barcelona', 62, 60),
(244, b'1', 'Masajes terapéuticos y deportivos en Barcelona. Recuperación muscular en casa.', 60, 42.00, 'Masajes Barcelona', 62, 65),
(245, b'1', 'Fisioterapeuta colegiado en Barcelona. Atención domiciliaria sin desplazamientos.', 60, 55.00, 'Fisioterapia Barcelona', 62, 66),
(246, b'1', 'Personal trainer en Barcelona. Fuerza, cardio y nutrición. Resultados visibles.', 60, 38.00, 'Entrenador personal Barcelona', 62, 68),
(247, b'1', 'Instructor de yoga en Barcelona. Clases individuales o en pareja en casa.', 60, 23.00, 'Yoga Barcelona', 62, 69),
(248, b'1', 'Pilates a domicilio en Barcelona. Adaptado a tu condición física.', 60, 23.00, 'Pilates Barcelona', 62, 70),
(249, b'1', 'Peluquería a domicilio en Sevilla. Cortes, tintes y tratamientos capilares.', 60, 28.00, 'Peluquería a domicilio Sevilla', 63, 59),
(250, b'1', 'Maquilladora profesional en Sevilla. Maquillaje de día, noche y eventos.', 90, 36.00, 'Maquillaje Sevilla', 63, 60),
(251, b'1', 'Masajes a domicilio en Sevilla. Relajante, deportivo y piedras calientes.', 60, 38.00, 'Masajes Sevilla', 63, 65),
(252, b'1', 'Fisioterapia a domicilio en Sevilla. Lesiones, contracturas y rehabilitación.', 60, 50.00, 'Fisioterapia Sevilla', 63, 66),
(253, b'1', 'Entrenadora personal en Sevilla. Plan de entrenamiento y dieta personalizado.', 60, 35.00, 'Entrenadora personal Sevilla', 63, 68),
(254, b'1', 'Yoga a domicilio en Sevilla. Respiración, flexibilidad y bienestar mental.', 60, 20.00, 'Yoga Sevilla', 63, 69),
(255, b'1', 'Pilates individual a domicilio en Sevilla. Colchoneta y accesorios incluidos.', 60, 20.00, 'Pilates Sevilla', 63, 70),
(256, b'1', 'Cerrajero urgente 24h en Madrid. Aperturas sin daños en menos de 30 minutos.', 60, 58.00, 'Cerrajero urgente Madrid', 64, 129),
(257, b'1', 'Desatascos urgentes en Madrid. Hydrojet de alta presión. Sin obra.', 60, 62.00, 'Desatascos urgentes Madrid', 64, 130),
(258, b'1', 'Cambio de cerradura urgente en Madrid. Alta seguridad y multiestrella.', 60, 52.00, 'Cambio cerradura urgente Madrid', 64, 134),
(259, b'1', 'Técnico informático urgente en Madrid. Virus, pantallas azules y fallos del sistema.', 60, 48.00, 'Informático urgente Madrid', 64, 147),
(260, b'1', 'Recuperación de datos en Madrid. Disco duro, SSD, USB y tarjetas.', 60, 58.00, 'Recuperación de datos Madrid', 64, 148),
(261, b'1', 'Configuración WiFi en Madrid. Cobertura total en toda la vivienda.', 60, 38.00, 'Configuración WiFi Madrid', 64, 159),
(262, b'1', 'Optimización de red doméstica en Madrid. PLC, repetidores y router.', 60, 40.00, 'Red doméstica Madrid', 64, 160),
(263, b'1', 'Mindfulness y meditación a domicilio en Madrid. Gestión del estrés.', 60, 38.00, 'Mindfulness Madrid', 64, 174),
(264, b'1', 'Cerrajero urgente en Barcelona. Apertura de puertas en 20 minutos garantizados.', 60, 55.00, 'Cerrajero urgente Barcelona', 65, 129),
(265, b'1', 'Desatascos urgentes en Barcelona. Respuesta inmediata, sin recargo nocturno.', 60, 58.00, 'Desatascos urgentes Barcelona', 65, 130),
(266, b'1', 'Técnico informático urgente en Barcelona. PC que no arranca, virus y pérdida datos.', 60, 45.00, 'Informático urgente Barcelona', 65, 147),
(267, b'1', 'Recuperación urgente de datos en Barcelona. Formateos y fallos de disco.', 60, 55.00, 'Recuperación datos Barcelona', 65, 148),
(268, b'1', 'Técnico WiFi en Barcelona. Optimización de señal y configuración de router.', 60, 35.00, 'WiFi Barcelona', 65, 159),
(269, b'1', 'Mejora del rendimiento de red doméstica en Barcelona. Cableado y WiFi.', 60, 38.00, 'Red doméstica Barcelona', 65, 160),
(270, b'1', 'Coaching personal en Barcelona. Coach certificado ICF. Metas y objetivos.', 60, 72.00, 'Coaching Barcelona', 65, 170),
(271, b'1', 'Cerrajero urgente en Valencia. Aperturas sin daños, disponible todo el año.', 60, 52.00, 'Cerrajero urgente Valencia', 66, 129),
(272, b'1', 'Desatascos urgentes en Valencia. Maquinaria profesional, resultado inmediato.', 60, 55.00, 'Desatascos urgentes Valencia', 66, 130),
(273, b'1', 'Cambio de cerradura urgente en Valencia. Seguridad alta y asesoramiento.', 60, 48.00, 'Cambio cerradura urgente Valencia', 66, 134),
(274, b'1', 'Soporte técnico informático urgente en Valencia. Tablets, móviles y PC.', 60, 42.00, 'Informático urgente Valencia', 66, 147),
(275, b'1', 'Configuración y optimización de WiFi en Valencia. Cobertura total garantizada.', 60, 33.00, 'WiFi Valencia', 66, 159),
(276, b'1', 'Coach profesional en Valencia. Sesiones de coaching de vida y carrera.', 60, 68.00, 'Coaching Valencia', 66, 170),
(277, b'1', 'Mindfulness a domicilio en Valencia. Técnicas de relajación y meditación.', 60, 36.00, 'Mindfulness Valencia', 66, 174),
(278, b'1', 'Recuperación de datos en Bilbao. Discos duros, USB y memoria flash.', 60, 52.00, 'Recuperación datos Bilbao', 67, 148),
(279, b'1', 'Técnico WiFi en Bilbao. Instalación de repetidores y configuración óptima.', 60, 32.00, 'WiFi Bilbao', 67, 159),
(280, b'1', 'Optimización de red doméstica en Bilbao. Velocidad máxima garantizada.', 60, 34.00, 'Red doméstica Bilbao', 67, 160),
(281, b'1', 'Coaching personal en Bilbao. Coach certificado. Transforma tu vida.', 60, 68.00, 'Coaching Bilbao', 67, 170),
(282, b'1', 'Mindfulness y meditación en Bilbao. Reducción del estrés y bienestar.', 60, 35.00, 'Mindfulness Bilbao', 67, 174),
(283, b'1', 'Ofrezco cuidado de gatos con atención personalizada, cariño y experiencia. Me adapto a las necesidades de cada gato: alimentación, limpieza del arenero, juegos y compañía para que se sienta tranquilo y seguro mientras estás fuera. Ideal para vacaciones, viajes o días ocupados.', 60, 12.00, 'Cuidado de gatos', 17, 78),
(284, b'1', 'Me encargo de la organización integral de eventos sociales y corporativos, adaptados a las necesidades de cada cliente. Coordinación, planificación, decoración, gestión de proveedores y atención al detalle para que tu evento sea un éxito. Ideal para cumpleaños, bodas, reuniones de empresa, inauguraciones y celebraciones privadas.', 60, 25.00, 'Organización de eventos personalizados', 17, 167),
(285, b'1', 'Ofrezco servicio de cuidado de bebés con atención responsable, cariñosa y segura. Me adapto a las rutinas de cada familia (alimentación, siestas, juegos tranquilos y cambio de pañales). Tengo paciencia y experiencia cuidando niños pequeños, garantizando siempre su bienestar y seguridad. Disponible por horas, con flexibilidad horaria.', 60, 10.00, 'Cuidado de bebés responsable y con experiencia', 68, 57);

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
(1, 'García López', 'Córdoba', 'Calle Sevilla 12', 'maria.garcia.lopez@gmail.com', 'María', '$2a$10$fizdrns/l8d11ysGeW9gxuKhzaww40/jdNAQXk9bJXZZPhKzGM2UK', 'CLIENTE', '+34612345678', 'https://randomuser.me/api/portraits/women/23.jpg', NULL),
(2, 'Fernández Ruiz', 'Sevilla', 'Avenida Andalucía 45', 'juan.fernandez88@hotmail.com', 'Juan', '$2a$10$z1lXU5n1Ww7L/IQcEZVjGeBtIrUuHd0gTqC2tQRExsLLFbi6YjNc2', 'PROFESIONAL', '+34623456789', 'https://randomuser.me/api/portraits/men/29.jpg', NULL),
(3, 'Martínez Pérez', 'Madrid', 'Calle Alcalá 102', 'lucia.martinez.p@gmail.com', 'Lucía', '$2a$10$QcZbp5dSgLJqDZZvKSGHFuUrzqJxMItwbnaMu4syn0mneN0dfvebW', 'CLIENTE', '+34634567890', 'https://randomuser.me/api/portraits/women/24.jpg', NULL),
(4, 'Sánchez Gómez', 'Málaga', 'Calle Larios 8', 'david.sanchezg@gmail.com', 'David', '$2a$10$M1HGT3EKr4ayLmn9/0TS5ewSVgdHhXCSJH2lgsoEp.82UycB8FoEm', 'PROFESIONAL', '+34645678901', 'https://randomuser.me/api/portraits/men/30.jpg', NULL),
(5, 'Romero Torres', 'Córdoba', 'Calle Palma 3', 'carmen.romero.torres@gmail.com', 'Carmen', '$2a$10$0K3yEhZVhQZ3mJdVrzFZmuLPJ7y3I956h5RL2wNS0VCFRw8fvV4wa', 'CLIENTE', '+34656789012', 'https://randomuser.me/api/portraits/women/25.jpg', NULL),
(6, 'Navarro Jiménez', 'Granada', 'Calle Recogidas 21', 'antonio.navarro.j@gmail.com', 'Antonio', '$2a$10$NG.ghUcDcpA.5iEReA8zJ.Qc2KYu4/0i4DW1KtdJ6dSGnH/KdtNju', 'PROFESIONAL', '+34667890123', 'https://randomuser.me/api/portraits/men/33.jpg', NULL),
(7, 'Moreno Castillo', 'Jaén', 'Calle Úbeda 14', 'laura.moreno.c@gmail.com', 'Laura', '$2a$10$2egsOQWwX/QfK0g6iflNs.oSSCC/2EcipR96.Dl0mj1wmSj5rUBLi', 'CLIENTE', '+34678901234', 'https://randomuser.me/api/portraits/women/26.jpg', NULL),
(8, 'Delgado Herrera', 'Cádiz', 'Avenida del Mar 9', 'sergio.delgado.h@gmail.com', 'Sergio', '$2a$10$cl0csAEWoyKlqkTBym1fXuqYm5BNtQpj9.JqoMf33vAceBmscIxt2', 'PROFESIONAL', '+34689012345', 'https://randomuser.me/api/portraits/men/34.jpg', NULL),
(9, 'Ortega Medina', 'Valencia', 'Calle Colón 56', 'ana.ortega.medina@gmail.com', 'Ana', '$2a$10$Ee9QrtrzRA8p3gudYzUEDOtcMxrFA/qEol/fAdf5CIxR6H/Vx4tRi', 'CLIENTE', '+34690123456', 'https://randomuser.me/api/portraits/women/27.jpg', NULL),
(10, 'Castro Molina', 'Barcelona', 'Calle Aragón 210', 'javier.castro.m@gmail.com', 'Javier', '$2a$10$f8r4EOBoUyuhMSiPVo6LfeScpMSuFMyfHm/2gvTPVw37icP/ESApC', 'PROFESIONAL', '+34601234567', 'https://randomuser.me/api/portraits/men/35.jpg', NULL),
(11, 'Ramos Vidal', 'Sevilla', 'Calle Triana 33', 'paula.ramos.vidal@gmail.com', 'Paula', '$2a$10$gY21F1kTCIT7XmR7urAY2eekK4qtu/jpixL5YBTu9SfeXazrNiMJG', 'CLIENTE', '+34612987654', 'https://randomuser.me/api/portraits/women/28.jpg', NULL),
(12, 'Reyes Santos', 'Córdoba', 'Calle Cruz Conde 7', 'alberto.reyes.s@gmail.com', 'Alberto', '$2a$10$V1OI.zWh6xpJwsLpNGeS0OFWr59yN7xupmYmCw5h4slJZunLZf7h2', 'PROFESIONAL', '+34623876543', 'https://randomuser.me/api/portraits/men/36.jpg', NULL),
(13, 'Molina Vega', 'Málaga', 'Calle Carretería 19', 'elena.molina.v@gmail.com', 'Elena', '$2a$10$0kvX7CtuR0X9PmlpjM55xujBqSL.rm0trZU9SFPq.i.IuntpSzJba', 'CLIENTE', '+34634765432', 'https://randomuser.me/api/portraits/women/29.jpg', NULL),
(14, 'Ibáñez Navarro', 'Madrid', 'Calle Gran Vía 88', 'daniel.ibanez.n@gmail.com', 'Daniel', '$2a$10$AbkMfAdm2Dk/eNG/L3k/duWZOSKNyCkgn0ruecT5BbAbJ3DWwj1UC', 'PROFESIONAL', '+34645654321', 'https://randomuser.me/api/portraits/men/37.jpg', NULL),
(15, 'Campos Ríos', 'Granada', 'Calle Alhambra 4', 'silvia.campos.rios@gmail.com', 'Silvia', '$2a$10$wWpqdZndKD0mooD4qcZ1HuFjc17J.bVibzKeIbH5EP2RCHewQhFQi', 'CLIENTE', '+34656543210', 'https://randomuser.me/api/portraits/women/31.jpg', NULL),
(16, 'Serrano Fuentes', 'Sevilla', 'Calle Nervión 22', 'miguel.serrano.f@gmail.com', 'Miguel', '$2a$10$Y9d8LZziNA9utgtJvThnleSz0F818.5BTtJrqdlPwpWWtuYj.w6G.', 'PROFESIONAL', '+34667432109', 'https://randomuser.me/api/portraits/men/32.jpg', NULL),
(17, 'Vargas León', 'Córdoba', 'Calle Feria 11', 'rocio.vargas.leon@gmail.com', 'Rocío', '$2a$10$lDnt9dXlZbWngYuVCaJYqeY1b8iH32c3L2CS.M8qVObOTBz0NnF3a', 'CLIENTE', '+34678321098', 'https://randomuser.me/api/portraits/women/32.jpg', NULL),
(18, 'Peña Cortés', 'Cádiz', 'Calle San Juan 6', 'fernando.pena.c@gmail.com', 'Fernando', '$2a$10$sJwUp17xo/M21/llRkVR3udJeZtotTkkcQwGVraEVzh2cvgFM9fRK', 'PROFESIONAL', '+34689210987', 'https://randomuser.me/api/portraits/men/38.jpg', NULL),
(19, 'Herrera Márquez', 'Jaén', 'Calle Linares 15', 'marta.herrera.m@gmail.com', 'Marta', '$2a$10$IdC21Mo/.7zGVfyHxCnye.Eky17c1t3SBFkhWr8SNx5pKnB7ArwNa', 'CLIENTE', '+34690198765', 'https://randomuser.me/api/portraits/women/33.jpg', NULL),
(20, 'Admin Sistema', 'Madrid', 'Calle Central 1', 'admin@jobfree.com', 'Admin', '$2y$10$HDxxNVbkUVFZLmWCdFPI4.Zar/HOIFeJrYcq1pMPUhD8akcH/L2j6', 'ADMIN', '+34600000000', NULL, '2026-05-02 20:15:09'),
(21, 'Heredia López', 'Córdoba', 'Sin especificar', 'pacoro@gmail.com', 'Pablo', '$2a$10$reHmE0UbUWIyAPZ.h3uGTudpGWWX6S6owfoezHbLYsO2PzOrPsXUe', 'CLIENTE', '+34627719120', 'https://randomuser.me/api/portraits/men/39.jpg', NULL),
(22, 'Heredia Ruiz', 'Córdoba', 'Sin especificar', 'pablorh20042007redes@gmail.com', 'Pablo', '$2a$10$tyK8u3Gst9Lhm0nkpi7MY.GAVTZ9x/dFXBCaMBdLc1CXd/3mwSL7m', 'CLIENTE', '+34627719121', '/uploads/fotos/1fbe728e-e506-4cca-bca7-d6b4bae97f2a.jpg', '2026-05-13 11:19:48'),
(23, 'Heredia Sánchez', 'Córdoba', 'Sin especificar', 'alberto.heredia@gmail.com', 'Alberto', '$2a$10$xFiji5I6Q7uEym9vezHcBuItLoAgSVPUeqeMKgI7xiLr5xRb2/nMi', 'CLIENTE', '+34627719122', 'https://randomuser.me/api/portraits/men/40.jpg', NULL),
(24, 'Heredia Torres', 'Palma del Río', 'Calle Ancha 31', 'pacoroca@gmail.com', 'Pablo', '$2a$10$fhhqEr0/5WHMC0lImgHiKOxChskB3LclqDIbV3r8ZnucRqw3AW2am', 'CLIENTE', '+34626638923', 'https://randomuser.me/api/portraits/men/41.jpg', NULL),
(25, 'Martínez López', 'Palma del Río', 'Calle Ancha 31', 'luis.profesional@gmail.com', 'Luis', '$2a$10$kvQLVi4T3CJauQasU1Eqtu6gmYUpWuS.iIywMuf633xdCzkIMzGA.', 'PROFESIONAL', '+3467732836433', 'https://randomuser.me/api/portraits/men/42.jpg', NULL),
(26, 'León', 'Palma del Río', 'Calle Alberca', 'pacoleon123@gmail.com', 'Paco', '$2a$10$XMIWIgSN/iJ2lpksvF7IqeJ6Zm75Lr5y2CQRgPfPhi32ItbCJ5D.q', 'PROFESIONAL', '+44612236537', 'https://randomuser.me/api/portraits/men/43.jpg', NULL),
(27, 'García Gutiérrez', 'Huelva', 'Calle Ancha', 'pruebagarcia@gmail.com', 'Luis Antonio', '$2a$10$kh04524gSXwBUpE.Q5rVNOeJjuQbbqYbSkD7fPG.e.AcBTVEaIIqC', 'CLIENTE', '+351617723485', 'https://randomuser.me/api/portraits/men/44.jpg', NULL),
(28, 'Heredia Valenzuela', 'Peñaflor', 'Calle Pera', 'yolandita@gmail.com', 'Yolanda', '$2a$10$jcmmC6XInQX94fhtKg5AxeQiGOg5.ExAb9qWyME8oZjI45rWJ5WCi', 'CLIENTE', '+34664828077', 'https://randomuser.me/api/portraits/women/34.jpg', NULL),
(29, 'Román Martín', 'Cádiz capital', 'Calle Jaén', 'gustavorm@hotmail.com', 'Gustavo', '$2a$10$Z2Re.ucGj3QtPtyj.ePkrOgDwhsIvyclDkNF2IFkgAe3FI/Jd8S1e', 'PROFESIONAL', '+33456472843', 'https://randomuser.me/api/portraits/men/45.jpg', NULL),
(30, 'Heredia Gómez', 'Córdoba', 'Calle Ancha 31', 'pablorh20042007@gmail.com', 'Pablo', '$2a$10$vQ64xHBaIsPsVetRh/BffuZUMrrrr016U.VWxngtAjAtlFLcICf4u', 'CLIENTE', '+34612234576', 'https://randomuser.me/api/portraits/men/46.jpg', NULL),
(31, 'Baena', 'Murcia', 'Calle Ácaro', 'javierbaena@gmail.com', 'Javier', '$2a$10$MqicbHql5kmuC8tuW1HVKebJg09lZxNtYNCo79qD4ZwRW/Em2P59a', 'CLIENTE', '+34616634589', 'https://randomuser.me/api/portraits/men/47.jpg', NULL),
(35, 'Guti', 'Jaén', 'Calle Perla', 'beti@gmail.com', 'Betty', '$2a$10$q2hw2Zm0dmLjaFaPpKt7LOdu8aRsOv7QtTluuOMZyY0NQJ7fDZZQ2', 'CLIENTE', '+34617723458', 'https://randomuser.me/api/portraits/women/35.jpg', NULL),
(36, 'García Márquez', 'Palma del Río', 'Calle Ancha 31', 'joanmarquez@gmail.com', 'Joan', '$2a$10$GmtKiwtMLWFMgyWCndVB.OLICoMgwDkaCXW.HRMY7x0bsz8jU5wCu', 'PROFESIONAL', '+34617719273', 'https://randomuser.me/api/portraits/men/48.jpg', NULL),
(37, 'García Márquez', 'Aljaraque', 'Calle Villaverde', 'maria.garcia.lopez1@gmail.com', 'Maria', '$2a$10$wUdDBezu4wgcTkiKjjrxMeUPQxkYyo45jZfPN4pLr2w3evTYuwFZa', 'CLIENTE', '+34727734568', 'https://randomuser.me/api/portraits/women/36.jpg', NULL),
(38, 'Heredia Martín', 'Madrid', 'Calle Huelva', 'yolandeva2020@gmail.com', 'Yolanda', '$2a$10$l8JFNs6jWEQ6bK8rPKWp0erh7ReErPhHlyUCkBaHc6hVZ/Q1F7MSK', 'PROFESIONAL', '+34623345782', 'https://randomuser.me/api/portraits/women/37.jpg', NULL),
(39, 'Márquez', 'Palma', 'Calle Ancha 30', 'javiermarquez@gmail.com', 'Javier', '$2a$10$z3mhFwiv8TWwqkbxX1VMe.svYnKodZc6QKx5g064cNQJIwoJovBLy', 'PROFESIONAL', '+34662345566', '/uploads/fotos/bec074fc-2fbe-43af-b8bf-fbdecf23d506.png', NULL),
(40, 'Paredes', 'Hornachuelos', 'C. Murcia', 'juanvazquez1979@gmail.com', 'Marta', '$2a$10$mpeWWvjWrO7rJ.r89op9KeaXzDvUCD8ZofemssCql9qaDttG0npGa', 'PROFESIONAL', '+34623418234', '/uploads/fotos/5130c183-5ebe-42e2-bde8-67ea3ba003cf.png', NULL),
(41, 'Martínez Morales', 'Córdoba', 'Calle Gran Vía 123, 1ºB', 'juan.martinez93@gmail.com', 'Juan Carlos', '$2a$10$fnZZ7C3gxxNKPPxvcwZZf.Y4jaQxAkOh5GwIKfSbuwNBYiWKv7EUG', 'CLIENTE', '+34673221234', '/uploads/fotos/f69ca673-355b-4110-a119-6e435bc3ac3f.png', NULL),
(42, 'Martínez Ruiz', 'Córdoba', 'Avenida del Gran Capitán 12, 2ºA', 'javier.martinez.ruiz1989@gmail.com', 'Javier', '$2a$10$izXZD7V/gFGe8V8O06etHuQ0.RXdlG0GvazqOvdCUJQr19dSHxOPu', 'PROFESIONAL', '+34623546211', '/uploads/fotos/dd773540-85a7-46ff-a065-384b7edbd8fb.png', NULL),
(43, 'López', 'Córdoba', 'Calle Ronda de los Tejares 34, 1ºB', 'maria.lopez.garcia1992@gmail.com', 'María', '$2a$10$Jdf6XACRoTOdFbUToPeY6OowhIS6YqNtnLvDlDpEaQii3ejk2/lOW', 'CLIENTE', '+34622914500', '/uploads/fotos/1560441e-2ed3-4844-9ca5-a60b857904f4.jpg', NULL),
(44, 'Gómez Vargas', 'Valencia', 'Calle de Colón 45, 3ºB', 'luis.gomez.pro@gmail.com', 'Luis', '$2a$10$1Oi2dp3wfbGG6X6dTSxO3.j8ZTBcvP8VyL1BjMgqqcNlaSkEVbP/.', 'PROFESIONAL', '+34612335678', '/uploads/fotos/a54c3fa9-0dc7-4fe8-8641-210c714ee53d.png', NULL),
(45, 'Nevado', 'Exija', 'Mariana pineda 73', 'pruebaclase@gmail.com', 'Pablo', '$2a$10$y.BKiN1iadYixAUaAUU.p.FtEYzsFQTvDPT8BMZVF3qDDgeowisV.', 'PROFESIONAL', '+34644984355', '/uploads/fotos/7919515f-c954-49cb-9b01-b0e37e24e072.png', NULL),
(46, 'García Romero', 'Córdoba', 'Avenida de la Libertad 45, 3ºA', 'elsa.garciaromero122@gmail.com', 'Elsa', '$2a$10$8EpxPtEqWq3zj.NVaoudwudu7eFt/GYKboF94PswPb1MVdqWihKjm', 'PROFESIONAL', '+34623847519', 'https://randomuser.me/api/portraits/women/38.jpg', '2026-04-30 07:35:46'),
(47, 'Thompson', 'Málaga', 'Avenida de Andalucía 54, 4ºD', 'daniel.thompson.uk@gmail.com', 'Daniel', '$2a$10$qoK37zxX0T5/5Lq7vURCmOK7Q8B/oIMV0718DT6uKrgECEtu8N0ki', 'PROFESIONAL', '+34611274983', 'https://randomuser.me/api/portraits/men/49.jpg', '2026-05-02 20:01:24'),
(48, 'García Romero', 'El Palmar de Troya', 'Calle Virgen de Fátima 7', 'manugarcia88@gmail.com', 'Manuel', '$2a$10$gIYF5B3OAgFV.uNZfiqNBu.G7uMQfdK36l81qzEDG5KtrdQr7zZ5W', 'PROFESIONAL', '+34622518374', 'https://randomuser.me/api/portraits/men/31.jpg', '2026-05-04 09:38:03'),
(49, 'García Ruiz', 'Córdoba', 'Calle Sevilla 12', 'elenagarcia24@gmail.com', 'Elena', '$2a$10$Gq2Lw6SLINkur56b2LnTyud4AzKlf8LjjPiiTg/.QoApBpSNQkd2q', 'PROFESIONAL', '+39622514387', 'https://randomuser.me/api/portraits/women/30.jpg', '2026-05-13 11:19:46'),
(50, 'Torres Ruiz', 'Madrid', 'Calle Alcalá 45', 'miguel.electricista@example.com', 'Miguel', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000050', 'https://randomuser.me/api/portraits/men/1.jpg', NULL),
(51, 'Vidal Soler', 'Barcelona', 'Passeig de Gràcia 20', 'elena.fontanera@example.com', 'Elena', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000051', 'https://randomuser.me/api/portraits/women/1.jpg', NULL),
(52, 'Martín Gómez', 'Valencia', 'Av. del Puerto 12', 'rosa.limpieza@example.com', 'Rosa', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000052', 'https://randomuser.me/api/portraits/women/2.jpg', NULL),
(53, 'Ruiz Etxebarria', 'Bilbao', 'Gran Vía 8', 'javier.ingles@example.com', 'Javier', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000053', 'https://randomuser.me/api/portraits/men/2.jpg', NULL),
(54, 'López Domínguez', 'Zaragoza', 'Calle Alfonso I 30', 'carmen.cuidadora@example.com', 'Carmen', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000054', 'https://randomuser.me/api/portraits/women/3.jpg', NULL),
(55, 'García Esteve', 'Alicante', 'Rambla Méndez Núñez 5', 'raul.entrenador@example.com', 'Raúl', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000055', 'https://randomuser.me/api/portraits/men/3.jpg', NULL),
(56, 'Sanz Pedrón', 'Murcia', 'Gran Vía 15', 'isabel.mascotas@example.com', 'Isabel', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000056', 'https://randomuser.me/api/portraits/women/4.jpg', NULL),
(57, 'Moreno Bover', 'Palma', 'Passeig del Born 9', 'antonio.fontanero.urgente@example.com', 'Antonio', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000057', 'https://randomuser.me/api/portraits/men/4.jpg', NULL),
(58, 'Fernández Alonso', 'Valladolid', 'Calle Santiago 3', 'lucia.mates@example.com', 'Lucía', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000058', 'https://randomuser.me/api/portraits/women/5.jpg', NULL),
(59, 'Díaz Gutiérrez', 'Santander', 'Calle Burgos 10', 'patricia.masajista@example.com', 'Patricia', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000059', 'https://randomuser.me/api/portraits/women/6.jpg', NULL),
(60, 'Herrera Prado', 'Salamanca', 'Calle Zamora 6', 'francisco.jardinero@example.com', 'Francisco', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000060', 'https://randomuser.me/api/portraits/men/5.jpg', NULL),
(61, 'Castro Núñez', 'Toledo', 'Calle Comercio 22', 'andres.cerrajero@example.com', 'Andrés', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000061', 'https://randomuser.me/api/portraits/men/6.jpg', NULL),
(62, 'Molina Serrano', 'Madrid', 'Calle Fuencarral 80', 'cristina.peluquera@example.com', 'Cristina', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000062', 'https://randomuser.me/api/portraits/women/7.jpg', NULL),
(63, 'Jiménez Palau', 'Barcelona', 'Av. del Paral·lel 55', 'roberto.fontanero.eco@example.com', 'Roberto', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000063', 'https://randomuser.me/api/portraits/men/7.jpg', NULL),
(64, 'Blanco Cordero', 'Valencia', 'Calle Colón 3', 'maria.veterinaria@example.com', 'María', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000064', 'https://randomuser.me/api/portraits/women/8.jpg', NULL),
(65, 'Romero Cabello', 'Sevilla', 'Calle Sierpes 40', 'sergio.electricista.eco@example.com', 'Sergio', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000065', 'https://randomuser.me/api/portraits/men/8.jpg', NULL),
(66, 'Ortiz Medina', 'Madrid', 'Calle Velázquez 12', 'natalia.coach@example.com', 'Natalia', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000066', 'https://randomuser.me/api/portraits/women/9.jpg', NULL),
(67, 'Navarro Ibáñez', 'Bilbao', 'Alameda Urquijo 3', 'marta.ninera@example.com', 'Marta', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000067', 'https://randomuser.me/api/portraits/women/10.jpg', NULL),
(68, 'Gil Castellano', 'Barcelona', 'Carrer Marina 200', 'david.programacion@example.com', 'David', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000068', 'https://randomuser.me/api/portraits/men/9.jpg', NULL),
(69, 'Flores Contreras', 'Madrid', 'Calle Hortaleza 60', 'emilio.limpieza.obra@example.com', 'Emilio', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000069', 'https://randomuser.me/api/portraits/men/10.jpg', NULL),
(70, 'Vega Torres', 'Madrid', 'Calle Atocha 22', 'carolina.vega@example.com', 'Carolina', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000070', 'https://randomuser.me/api/portraits/women/11.jpg', NULL),
(71, 'Ibáñez Soler', 'Barcelona', 'Calle Provença 45', 'pedro.ibanez.limp@example.com', 'Pedro', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000071', 'https://randomuser.me/api/portraits/men/11.jpg', NULL),
(72, 'Castillo Martín', 'Valencia', 'Av. Blasco Ibáñez 10', 'nuria.castillo@example.com', 'Nuria', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000072', 'https://randomuser.me/api/portraits/women/12.jpg', NULL),
(73, 'Mendoza Ruiz', 'Zaragoza', 'Calle Cinco de Marzo 8', 'alberto.mendoza.jard@example.com', 'Alberto', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000073', 'https://randomuser.me/api/portraits/men/12.jpg', NULL),
(74, 'Delgado Herrera', 'Sevilla', 'Calle Betis 15', 'sofia.delgado.limp@example.com', 'Sofía', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000074', 'https://randomuser.me/api/portraits/women/13.jpg', NULL),
(75, 'Aguilar Pérez', 'Madrid', 'Calle Serrano 40', 'marcos.aguilar.elec@example.com', 'Marcos', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000075', 'https://randomuser.me/api/portraits/men/13.jpg', NULL),
(76, 'Ferrer Molina', 'Barcelona', 'Av. Diagonal 300', 'tomas.ferrer.elec@example.com', 'Tomás', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000076', 'https://randomuser.me/api/portraits/men/14.jpg', NULL),
(77, 'Benítez Castro', 'Valencia', 'Calle Russafa 5', 'ignacio.benitez.elec@example.com', 'Ignacio', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000077', 'https://randomuser.me/api/portraits/men/15.jpg', NULL),
(78, 'Lozano Fuentes', 'Bilbao', 'Calle Autonomía 18', 'hector.lozano.elec@example.com', 'Héctor', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000078', 'https://randomuser.me/api/portraits/men/16.jpg', NULL),
(79, 'Prieto Blanco', 'Málaga', 'Calle Larios 12', 'victor.prieto.elec@example.com', 'Víctor', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000079', 'https://randomuser.me/api/portraits/men/17.jpg', NULL),
(80, 'Pascual Vera', 'Madrid', 'Calle Preciados 30', 'ramon.pascual.font@example.com', 'Ramón', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000080', 'https://randomuser.me/api/portraits/men/18.jpg', NULL),
(81, 'Aranda Vega', 'Barcelona', 'Calle Pelai 20', 'gonzalo.aranda.font@example.com', 'Gonzalo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000081', 'https://randomuser.me/api/portraits/men/19.jpg', NULL),
(82, 'Cano Romero', 'Valencia', 'Calle San Vicente 8', 'felipe.cano.font@example.com', 'Felipe', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000082', 'https://randomuser.me/api/portraits/men/20.jpg', NULL),
(83, 'Fuentes Medina', 'Madrid', 'Calle Mayor 5', 'gloria.fuentes.cuid@example.com', 'Gloria', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000083', 'https://randomuser.me/api/portraits/women/14.jpg', NULL),
(84, 'Rubio Parra', 'Barcelona', 'Rambla de Catalunya 50', 'beatriz.rubio.cuid@example.com', 'Beatriz', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000084', 'https://randomuser.me/api/portraits/women/15.jpg', NULL),
(85, 'Ramos Reyes', 'Sevilla', 'Calle Tetuán 3', 'manuela.ramos.cuid@example.com', 'Manuela', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000085', 'https://randomuser.me/api/portraits/women/16.jpg', NULL),
(86, 'Santamaría Flores', 'Madrid', 'Calle Sagasta 14', 'diego.santamaria.masc@example.com', 'Diego', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000086', 'https://randomuser.me/api/portraits/men/21.jpg', NULL),
(87, 'Expósito Cruz', 'Barcelona', 'Calle Aragó 28', 'paula.exposito.masc@example.com', 'Paula', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000087', 'https://randomuser.me/api/portraits/women/17.jpg', NULL),
(88, 'Muñoz León', 'Valencia', 'Calle Marvà 7', 'irene.munoz.masc@example.com', 'Irene', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000088', 'https://randomuser.me/api/portraits/women/18.jpg', NULL),
(89, 'Guerrero Vidal', 'Madrid', 'Calle Goya 35', 'oscar.guerrero.edu@example.com', 'Óscar', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000089', 'https://randomuser.me/api/portraits/men/22.jpg', NULL),
(90, 'Hidalgo Sanz', 'Barcelona', 'Av. Gaudí 12', 'amparo.hidalgo.edu@example.com', 'Amparo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000090', 'https://randomuser.me/api/portraits/women/19.jpg', NULL),
(91, 'Parra Jiménez', 'Valencia', 'Calle Bailén 4', 'victor.parra.edu@example.com', 'Víctor', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000091', 'https://randomuser.me/api/portraits/men/23.jpg', NULL),
(92, 'Montoya Gil', 'Bilbao', 'Calle Henao 9', 'susana.montoya.edu@example.com', 'Susana', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000092', 'https://randomuser.me/api/portraits/women/20.jpg', NULL),
(93, 'Carrillo Ortiz', 'Madrid', 'Calle Hortaleza 28', 'vanesa.carrillo.sal@example.com', 'Vanesa', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000093', 'https://randomuser.me/api/portraits/women/21.jpg', NULL),
(94, 'Reina Navarro', 'Barcelona', 'Calle Balmes 60', 'alvaro.reina.sal@example.com', 'Álvaro', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000094', 'https://randomuser.me/api/portraits/men/24.jpg', NULL),
(95, 'Mora Díaz', 'Sevilla', 'Calle Amor de Dios 2', 'leticia.mora.sal@example.com', 'Leticia', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000095', 'https://randomuser.me/api/portraits/women/22.jpg', NULL),
(96, 'Valdés Serrano', 'Madrid', 'Calle Alberto Aguilera 20', 'bruno.valdes.urg@example.com', 'Bruno', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000096', 'https://randomuser.me/api/portraits/men/25.jpg', NULL),
(97, 'Cabrera Morales', 'Barcelona', 'Calle Enric Granados 15', 'enrique.cabrera.urg@example.com', 'Enrique', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000097', 'https://randomuser.me/api/portraits/men/26.jpg', NULL),
(98, 'Medina Campos', 'Valencia', 'Calle Játiva 3', 'rodrigo.medina.urg@example.com', 'Rodrigo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000098', 'https://randomuser.me/api/portraits/men/27.jpg', NULL),
(99, 'Bravo Esteve', 'Bilbao', 'Calle Ledesma 6', 'nicolas.bravo.urg@example.com', 'Nicolás', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy', 'PROFESIONAL', '+34622000099', 'https://randomuser.me/api/portraits/men/28.jpg', NULL),
(102, 'Morales Vega', 'Málaga', 'Avenida de Andalucía 115, 2A, 29007 Málaga, España', 'jmorales.work88@outlook.com', 'Javier', '$2a$10$xONNGXHVlD7nlFG3XNfZD.TptPFKJMrL2Mp2zFw7/zXhcjjgGwD.y', 'PROFESIONAL', '+34687214509', NULL, '2026-05-13 11:45:52'),
(103, 'Fernández López', 'Córdoba', 'Avenida de Barcelona 112, 2ºA', 'maria.fernandez.lopez97@gmail.com', 'María', '$2a$10$qIIZDfKWLkO604mHb4M8a.J4sC06ZUIbfS32tvcAWKLImDzCHKQ.G', 'CLIENTE', '+34673482915', NULL, '2026-05-13 11:52:28');

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
(9, '', 4, '2026-05-04 09:26:08.000000', 22, 16, 25),
(10, 'Genial, totalmente recomendado', 5, '2026-05-07 11:50:20.000000', 22, 13, 22);

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
-- Indices de la tabla `mensaje_reaccion`
--
ALTER TABLE `mensaje_reaccion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_msg_user_emoji` (`mensaje_id`,`usuario_id`,`emoji`),
  ADD KEY `fk_reaccion_usuario` (`usuario_id`);

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
-- Indices de la tabla `profesional_ciudad_servicio`
--
ALTER TABLE `profesional_ciudad_servicio`
  ADD KEY `fk_pcs_profesional` (`profesional_id`);

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `categoria_servicio`
--
ALTER TABLE `categoria_servicio`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `conversacion`
--
ALTER TABLE `conversacion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `favorito_servicio`
--
ALTER TABLE `favorito_servicio`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=164;

--
-- AUTO_INCREMENT de la tabla `mensaje_reaccion`
--
ALTER TABLE `mensaje_reaccion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `password_reset_token`
--
ALTER TABLE `password_reset_token`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `profesional_info`
--
ALTER TABLE `profesional_info`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT de la tabla `resena_profesional`
--
ALTER TABLE `resena_profesional`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `servicio_ofrecido`
--
ALTER TABLE `servicio_ofrecido`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=286;

--
-- AUTO_INCREMENT de la tabla `subcategoria_servicio`
--
ALTER TABLE `subcategoria_servicio`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
-- Filtros para la tabla `mensaje_reaccion`
--
ALTER TABLE `mensaje_reaccion`
  ADD CONSTRAINT `fk_reaccion_mensaje` FOREIGN KEY (`mensaje_id`) REFERENCES `mensaje` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reaccion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

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
-- Filtros para la tabla `profesional_ciudad_servicio`
--
ALTER TABLE `profesional_ciudad_servicio`
  ADD CONSTRAINT `fk_pcs_profesional` FOREIGN KEY (`profesional_id`) REFERENCES `profesional_info` (`id`) ON DELETE CASCADE;

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

SET FOREIGN_KEY_CHECKS=1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
