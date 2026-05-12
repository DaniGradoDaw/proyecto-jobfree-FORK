-- ============================================================
--  JobFree — Datos extra para testing de filtros
-- ============================================================
--  Ejecutar contra la BD jobfree YA EXISTENTE (no borra nada)
--    PowerShell:
--      Get-Content extra-profesionales.sql | & "C:\xampp\mysql\bin\mysql.exe" -u root jobfree
--
--  Añade 20 profesionales con:
--    · Ciudades: Madrid, Barcelona, Valencia, Bilbao,
--      Zaragoza, Alicante, Murcia, Palma, Valladolid,
--      Santander, Salamanca, Toledo, Sevilla
--    · Precios: 10 €/h → 80 €/h
--    · Valoraciones: 2.8 → 4.9
--    · Planes: BASICO / PREMIUM / PRO
--    · Categorías: todas las del catálogo
--  Contraseña de todos: Test1234!
-- ============================================================

USE jobfree;

-- ────────────────────────────────────────────────────────────
--  USUARIOS  (IDs 50-69)
-- ────────────────────────────────────────────────────────────
INSERT INTO `usuario` (`id`,`apellidos`,`ciudad`,`direccion`,`email`,`nombre`,`password`,`rol`,`telefono`,`foto_url`) VALUES
(50,'Torres Ruiz',      'Madrid',     'Calle Alcalá 45',           'miguel.electricista@example.com',      'Miguel',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000050','https://randomuser.me/api/portraits/men/1.jpg'),
(51,'Vidal Soler',      'Barcelona',  'Passeig de Gràcia 20',      'elena.fontanera@example.com',          'Elena',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000051','https://randomuser.me/api/portraits/women/1.jpg'),
(52,'Martín Gómez',    'Valencia',   'Av. del Puerto 12',         'rosa.limpieza@example.com',            'Rosa',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000052','https://randomuser.me/api/portraits/women/2.jpg'),
(53,'Ruiz Etxebarria', 'Bilbao',     'Gran Vía 8',                'javier.ingles@example.com',            'Javier',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000053','https://randomuser.me/api/portraits/men/2.jpg'),
(54,'López Domínguez', 'Zaragoza',   'Calle Alfonso I 30',        'carmen.cuidadora@example.com',         'Carmen',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000054','https://randomuser.me/api/portraits/women/3.jpg'),
(55,'García Esteve',   'Alicante',   'Rambla Méndez Núñez 5',    'raul.entrenador@example.com',          'Raúl',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000055','https://randomuser.me/api/portraits/men/3.jpg'),
(56,'Sanz Pedrón',     'Murcia',     'Gran Vía 15',               'isabel.mascotas@example.com',          'Isabel',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000056','https://randomuser.me/api/portraits/women/4.jpg'),
(57,'Moreno Bover',    'Palma',      'Passeig del Born 9',        'antonio.fontanero.urgente@example.com','Antonio',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000057','https://randomuser.me/api/portraits/men/4.jpg'),
(58,'Fernández Alonso','Valladolid', 'Calle Santiago 3',          'lucia.mates@example.com',              'Lucía',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000058','https://randomuser.me/api/portraits/women/5.jpg'),
(59,'Díaz Gutiérrez',  'Santander',  'Calle Burgos 10',           'patricia.masajista@example.com',       'Patricia',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000059','https://randomuser.me/api/portraits/women/6.jpg'),
(60,'Herrera Prado',   'Salamanca',  'Calle Zamora 6',            'francisco.jardinero@example.com',      'Francisco', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000060','https://randomuser.me/api/portraits/men/5.jpg'),
(61,'Castro Núñez',    'Toledo',     'Calle Comercio 22',         'andres.cerrajero@example.com',         'Andrés',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000061','https://randomuser.me/api/portraits/men/6.jpg'),
(62,'Molina Serrano',  'Madrid',     'Calle Fuencarral 80',       'cristina.peluquera@example.com',       'Cristina',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000062','https://randomuser.me/api/portraits/women/7.jpg'),
(63,'Jiménez Palau',   'Barcelona',  'Av. del Paral·lel 55',      'roberto.fontanero.eco@example.com',    'Roberto',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000063','https://randomuser.me/api/portraits/men/7.jpg'),
(64,'Blanco Cordero',  'Valencia',   'Calle Colón 3',             'maria.veterinaria@example.com',        'María',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000064','https://randomuser.me/api/portraits/women/8.jpg'),
(65,'Romero Cabello',  'Sevilla',    'Calle Sierpes 40',          'sergio.electricista.eco@example.com',  'Sergio',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000065','https://randomuser.me/api/portraits/men/8.jpg'),
(66,'Ortiz Medina',    'Madrid',     'Calle Velázquez 12',        'natalia.coach@example.com',            'Natalia',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000066','https://randomuser.me/api/portraits/women/9.jpg'),
(67,'Navarro Ibáñez',  'Bilbao',     'Alameda Urquijo 3',         'marta.ninera@example.com',             'Marta',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000067','https://randomuser.me/api/portraits/women/10.jpg'),
(68,'Gil Castellano',  'Barcelona',  'Carrer Marina 200',         'david.programacion@example.com',       'David',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000068','https://randomuser.me/api/portraits/men/9.jpg'),
(69,'Flores Contreras','Madrid',     'Calle Hortaleza 60',        'emilio.limpieza.obra@example.com',     'Emilio',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000069','https://randomuser.me/api/portraits/men/10.jpg');

-- ────────────────────────────────────────────────────────────
--  PERFILES PROFESIONALES  (IDs 18-37)
--  valoracion_media cubre: 2.8 / 3.5 / 3.7 / 3.9 / 4.1-4.9
-- ────────────────────────────────────────────────────────────
INSERT INTO `profesional_info` (`id`,`cif`,`descripcion`,`experiencia`,`nombre_empresa`,`numero_valoraciones`,`plan`,`valoracion_media`,`usuario_id`,`codigo_postal`,`latitud`,`longitud`,`ubicacion_manual`) VALUES
(18,'B33333333','Electricista certificado con 10 años en Madrid. Instalaciones y reparaciones garantizadas.',                   10,'ElectraMiguel',              12,'PRO',     4.8, 50,'28010', 40.4237, -3.6916, b'1'),
(19,'B44444444','Fontanera profesional en Barcelona. Urgencias 24h, presupuesto siempre gratis.',                              7,  NULL,                          8,'PREMIUM', 4.6, 51,'08008', 41.3951,  2.1599, b'1'),
(20, NULL,      'Servicio de limpieza económico y de calidad en Valencia. Materiales propios incluidos.',                       2,  NULL,                          4,'BASICO',  3.9, 52,'46001', 39.4728, -0.3696, b'1'),
(21, NULL,      'Profesor nativo de inglés. Preparación Cambridge, IELTS y conversación fluida.',                              5,  NULL,                          6,'BASICO',  4.2, 53,'48001', 43.2632, -2.9254, b'1'),
(22,'B55555555','Cuidadora de mayores con titulación oficial. 12 años de experiencia y referencias.',                          12,'CuidadosCármen',              20,'PREMIUM', 4.9, 54,'50001', 41.6565, -0.8773, b'1'),
(23,'B66666666','Entrenador personal certificado. Planes de ejercicio y nutrición totalmente personalizados.',                  8, 'FitRaúl',                     15,'PRO',     4.7, 55,'03001', 38.3460, -0.4907, b'1'),
(24, NULL,      'Apasionada de los animales. Paseos, cuidados y hospedaje de mascotas en Murcia.',                             3,  NULL,                          7,'BASICO',  4.4, 56,'30001', 37.9866, -1.1285, b'1'),
(25,'B77777777','Fontanero urgente con 15 años en Baleares. Disponible 24h todos los días del año.',                          15,'Fontanería Urgente Baleares', 25,'PRO',     4.3, 57,'07001', 39.5697,  2.6501, b'1'),
(26, NULL,      'Profesora de matemáticas para ESO y bachillerato. Clases individuales con resultados.',                       6,  NULL,                          9,'BASICO',  4.1, 58,'47001', 41.6523, -4.7213, b'1'),
(27, NULL,      'Masajista y fisioterapeuta titulada. Relajante, deportivo y terapéutico en Santander.',                       9, 'PatriciaRelax',                18,'PREMIUM', 4.8, 59,'39001', 43.4627, -3.8045, b'1'),
(28, NULL,      'Jardinero con pasión por los jardines. Diseño, mantenimiento y poda en Salamanca.',                           4,  NULL,                          5,'BASICO',  3.7, 60,'37001', 40.9668, -5.6638, b'1'),
(29,'B88888888','Cerrajero urgente en Toledo. Aperturas sin daños, cambios de cerradura y copias de llave.',                  11,'CerrajeríaAndrés',            16,'PRO',     4.5, 61,'45001', 39.8600, -4.0245, b'1'),
(30, NULL,      'Peluquera y estilista a domicilio en Madrid. Cortes, tintes, peinados y maquillaje.',                         7,  NULL,                         11,'PREMIUM', 4.6, 62,'28004', 40.4239, -3.7009, b'1'),
(31, NULL,      'Fontanero económico en Barcelona. Precios ajustados y trabajos garantizados.',                                2,  NULL,                          3,'BASICO',  3.5, 63,'08003', 41.3846,  2.1786, b'1'),
(32,'B99999999','Veterinaria a domicilio en Valencia. Consultas, vacunas y urgencias sin salir de casa.',                      8, 'VetCasa Valencia',            14,'PRO',     4.9, 64,'46003', 39.4759, -0.3554, b'1'),
(33, NULL,      'Electricista en Sevilla. Servicio económico para instalaciones básicas y reparaciones menores.',              1,  NULL,                          2,'BASICO',  2.8, 65,'41001', 37.3892, -5.9845, b'1'),
(34,'C11111111','Coach certificada ICF. Sesiones individuales de coaching, mindfulness y gestión del estrés.',                10,'CoachingNatalia',              22,'PRO',     4.7, 66,'28006', 40.4350, -3.6943, b'1'),
(35, NULL,      'Cuidadora de niños con experiencia y paciencia. Referencias disponibles a petición.',                         5,  NULL,                          8,'PREMIUM', 4.3, 67,'48011', 43.2712, -2.9419, b'1'),
(36,'C22222222','Desarrollador y formador. Clases de Java, Python, web y bases de datos desde cero.',                          7, 'CodeDavid',                   17,'PREMIUM', 4.8, 68,'08026', 41.4110,  2.1900, b'1'),
(37, NULL,      'Especialista en limpieza post obra y garajes en Madrid. Equipos profesionales.',                              6,  NULL,                          9,'PRO',     4.1, 69,'28020', 40.4540, -3.6941, b'1');

-- ────────────────────────────────────────────────────────────
--  SERVICIOS OFRECIDOS  (IDs 42-81)
--  precio_hora cubre: 10 / 12 / 14 / 15 / 16 / 18 / 20 / 22
--                     25 / 30 / 35 / 40 / 45 / 50 / 55 / 60
--                     70 / 80 €/h
-- ────────────────────────────────────────────────────────────
INSERT INTO `servicio_ofrecido` (`id`,`activa`,`descripcion`,`duracion_min`,`precio_hora`,`titulo`,`profesional_id`,`subcategoria_id`) VALUES
-- Miguel · Electricista Madrid (prof 18)
(42, b'1','Reparación de instalaciones eléctricas residenciales. Diagnóstico y presupuesto gratuito.',                    60, 35.00,'Reparación eléctrica Madrid',          18, 26),
(43, b'1','Intervención en menos de 2h. Disponible 24h incluidos festivos y fines de semana.',                            60, 50.00,'Electricista urgente 24h Madrid',       18,128),
-- Elena · Fontanera Barcelona (prof 19)
(44, b'1','Detección y reparación de fugas, averías y tuberías. Servicio garantizado.',                                   60, 30.00,'Reparación fontanería Barcelona',       19, 30),
(45, b'1','Urgencias de fontanería en Barcelona. Respuesta en menos de 60 minutos.',                                      60, 45.00,'Fontanero urgente Barcelona',           19,127),
-- Rosa · Limpieza Valencia (prof 20)
(46, b'1','Limpieza completa del hogar. Cocina, baños y habitaciones. Materiales incluidos.',                            120, 12.00,'Limpieza del hogar Valencia',           20,  1),
(47, b'1','Limpieza en profundidad con desinfección y desengrasado. Ideal tras mudanza.',                                180, 14.00,'Limpieza profunda Valencia',            20,  2),
-- Javier · Inglés Bilbao (prof 21)
(48, b'1','Clases individuales de inglés conversacional. Nivel A1 a C2. Flexible de horario.',                            60, 20.00,'Inglés conversación Bilbao',            21,104),
(49, b'1','Preparación para exámenes Cambridge, IELTS y TOEFL con metodología probada.',                                  60, 22.00,'Inglés exámenes Bilbao',               21,105),
-- Carmen · Cuidadora mayores Zaragoza (prof 22)
(50, b'1','Cuidado profesional de personas mayores en su domicilio. Higiene, medicación y compañía.',                    240, 15.00,'Cuidado de mayores Zaragoza',           22, 51),
(51, b'1','Atención integral a personas con dependencia reconocida. Titulación oficial.',                                 480, 14.00,'Cuidado de dependientes Zaragoza',      22, 52),
-- Raúl · Entrenador Alicante (prof 23)
(52, b'1','Entrenamiento personal adaptado a tus objetivos, condición física y disponibilidad.',                           60, 40.00,'Entrenador personal Alicante',          23, 68),
(53, b'1','Sesiones de yoga para todos los niveles. Respiración, relajación y flexibilidad.',                              60, 25.00,'Yoga a domicilio Alicante',             23, 69),
-- Isabel · Mascotas Murcia (prof 24)
(54, b'1','Paseos de 30 y 60 minutos. Grupos reducidos. Rutas variadas por la ciudad.',                                   60, 12.00,'Paseo de perros Murcia',               24, 76),
(55, b'1','Cuidado de perros en tu domicilio mientras estás fuera o trabajas.',                                           480, 10.00,'Cuidado de perros en casa Murcia',      24, 77),
-- Antonio · Fontanero urgente Palma (prof 25)
(56, b'1','Fontanería urgente en Mallorca. Garantía de satisfacción. Sin desplazamiento.',                                 60, 60.00,'Fontanero urgente Palma 24h',           25,127),
(57, b'1','Resolución urgente de atascos en tuberías domésticas sin obra.',                                                90, 45.00,'Desatascos urgentes Palma',             25,130),
-- Lucía · Matemáticas Valladolid (prof 26)
(58, b'1','Clases de matemáticas para la ESO. Refuerzo y preparación de exámenes.',                                       60, 25.00,'Matemáticas ESO Valladolid',            26,102),
(59, b'1','Preparación para selectividad y bachillerato. Resultados garantizados.',                                        60, 30.00,'Matemáticas bachillerato Valladolid',   26,103),
-- Patricia · Masajista Santander (prof 27)
(60, b'1','Masaje relajante sueco y de tejido profundo en tu domicilio. Camilla propia.',                                  60, 45.00,'Masajes a domicilio Santander',         27, 65),
(61, b'1','Fisioterapia de rehabilitación y tratamiento de lesiones deportivas.',                                          60, 55.00,'Fisioterapia a domicilio Santander',    27, 66),
-- Francisco · Jardinero Salamanca (prof 28)
(62, b'1','Diseño y mantenimiento de jardines privados en Salamanca y alrededores.',                                      120, 20.00,'Mantenimiento de jardín Salamanca',     28,  8),
(63, b'1','Corte de césped y recorte de bordes. Precio cerrado por sesión.',                                               60, 15.00,'Corte de césped Salamanca',             28, 10),
-- Andrés · Cerrajero urgente Toledo (prof 29)
(64, b'1','Apertura de puertas sin daños en 30 minutos. Servicio en toda la provincia.',                                   60, 55.00,'Cerrajero urgente Toledo',              29,129),
(65, b'1','Instalación de cerraduras de alta seguridad. Asesoramiento incluido.',                                          60, 50.00,'Cambio de cerradura Toledo',            29,134),
-- Cristina · Peluquería Madrid (prof 30)
(66, b'1','Cortes, tintes y peinados en tu domicilio. Productos profesionales de primera calidad.',                       60, 35.00,'Peluquería a domicilio Madrid',         30, 59),
(67, b'1','Maquillaje profesional para bodas, eventos y fotografía.',                                                      90, 40.00,'Maquillaje profesional Madrid',         30, 60),
-- Roberto · Fontanero económico Barcelona (prof 31)
(68, b'1','Reparación de grifos, cisternas y sanitarios. Presupuesto previo sin coste.',                                   60, 18.00,'Reparación de grifos Barcelona',        31, 32),
(69, b'1','Desatascos sin obra con máquina de presión de alta potencia.',                                                  60, 22.00,'Desatascos Barcelona',                  31, 33),
-- María · Veterinaria Valencia (prof 32)
(70, b'1','Consultas veterinarias, vacunas y diagnóstico en casa. Sin estrés para tu mascota.',                            60, 70.00,'Veterinario a domicilio Valencia',      32, 89),
(71, b'1','Administración de tratamientos y medicación para mascotas. Pauta incluida.',                                    30, 35.00,'Administración medicación mascotas',    32, 90),
-- Sergio · Electricista económico Sevilla (prof 33)
(72, b'1','Instalación y reparación de enchufes e interruptores. Precio cerrado.',                                         60, 15.00,'Reparación de enchufes Sevilla',        33, 27),
(73, b'1','Cambio de bombillas normales, LED y de bajo consumo.',                                                          30, 10.00,'Cambio de bombillas Sevilla',           33,  6),
-- Natalia · Coach Madrid (prof 34)
(74, b'1','Sesiones de coaching individual para alcanzar tus metas personales y profesionales.',                           60, 80.00,'Coaching personal Madrid',              34,170),
(75, b'1','Introducción al mindfulness. Técnicas de reducción del estrés y meditación.',                                   60, 60.00,'Mindfulness en casa Madrid',            34,174),
-- Marta · Niñera Bilbao (prof 35)
(76, b'1','Cuidado de niños de 0 a 12 años en su domicilio. Actividades educativas y juego.',                            480, 14.00,'Cuidado de niños Bilbao',               35, 55),
(77, b'1','Servicio de niñera flexible por horas. Sin mínimo de horas.',                                                  120, 12.00,'Niñera a domicilio Bilbao',             35, 56),
-- David · Programación Barcelona (prof 36)
(78, b'1','Clases de Java, Spring Boot y patrones de diseño. Nivel básico a avanzado.',                                    60, 45.00,'Programación Java Barcelona',           36,109),
(79, b'1','Aprende HTML, CSS, JavaScript y React desde cero hasta nivel profesional.',                                     60, 40.00,'Desarrollo web Barcelona',              36,110),
-- Emilio · Limpieza obra Madrid (prof 37)
(80, b'1','Limpieza especializada tras obras de construcción o reforma. Equipo propio.',                                   180, 16.00,'Limpieza post obra Madrid',             37,  3),
(81, b'1','Limpieza de garajes, trasteros y zonas de almacenaje. Presupuesto gratis.',                                    120, 14.00,'Limpieza de garaje Madrid',             37, 15);

-- ────────────────────────────────────────────────────────────
--  AUTO_INCREMENT — actualizar al nuevo máximo
-- ────────────────────────────────────────────────────────────
ALTER TABLE `usuario`            AUTO_INCREMENT = 70;
ALTER TABLE `profesional_info`   AUTO_INCREMENT = 38;
ALTER TABLE `servicio_ofrecido`  AUTO_INCREMENT = 82;
