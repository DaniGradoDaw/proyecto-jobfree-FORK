-- ============================================================
--  JobFree — Profesionales y servicios extra para filtros
-- ============================================================
--  Importar:
--    PowerShell:
--      Get-Content database\extra-filtros.sql | & "C:\xampp\mysql\bin\mysql.exe" -u root jobfree
--
--  Añade 30 profesionales (IDs 70-99) con 201 servicios (IDs 82-282)
--  distribuidos para que cada subcategoría activa tenga 4-7 profesionales.
--  Contraseña de todos: Test1234!
-- ============================================================

USE jobfree;

-- ============================================================
--  USUARIOS  (IDs 70-99)
-- ============================================================
INSERT INTO `usuario` (`id`,`apellidos`,`ciudad`,`direccion`,`email`,`nombre`,`password`,`rol`,`telefono`,`foto_url`) VALUES
-- LIMPIEZA Y HOGAR
(70,'Vega Torres',       'Madrid',    'Calle Atocha 22',           'carolina.vega@example.com',             'Carolina', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000070','https://randomuser.me/api/portraits/women/11.jpg'),
(71,'Ibáñez Soler',      'Barcelona', 'Calle Provença 45',         'pedro.ibanez.limp@example.com',         'Pedro',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000071','https://randomuser.me/api/portraits/men/11.jpg'),
(72,'Castillo Martín',  'Valencia',  'Av. Blasco Ibáñez 10',     'nuria.castillo@example.com',            'Nuria',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000072','https://randomuser.me/api/portraits/women/12.jpg'),
(73,'Mendoza Ruiz',      'Zaragoza',  'Calle Cinco de Marzo 8',    'alberto.mendoza.jard@example.com',      'Alberto',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000073','https://randomuser.me/api/portraits/men/12.jpg'),
(74,'Delgado Herrera',   'Sevilla',   'Calle Betis 15',            'sofia.delgado.limp@example.com',        'Sofía',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000074','https://randomuser.me/api/portraits/women/13.jpg'),
-- ELECTRICISTAS
(75,'Aguilar Pérez',     'Madrid',    'Calle Serrano 40',          'marcos.aguilar.elec@example.com',       'Marcos',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000075','https://randomuser.me/api/portraits/men/13.jpg'),
(76,'Ferrer Molina',     'Barcelona', 'Av. Diagonal 300',          'tomas.ferrer.elec@example.com',         'Tomás',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000076','https://randomuser.me/api/portraits/men/14.jpg'),
(77,'Benítez Castro',    'Valencia',  'Calle Russafa 5',           'ignacio.benitez.elec@example.com',      'Ignacio',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000077','https://randomuser.me/api/portraits/men/15.jpg'),
(78,'Lozano Fuentes',    'Bilbao',    'Calle Autonomía 18',        'hector.lozano.elec@example.com',        'Héctor',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000078','https://randomuser.me/api/portraits/men/16.jpg'),
(79,'Prieto Blanco',     'Málaga',    'Calle Larios 12',           'victor.prieto.elec@example.com',        'Víctor',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000079','https://randomuser.me/api/portraits/men/17.jpg'),
-- FONTANEROS
(80,'Pascual Vera',      'Madrid',    'Calle Preciados 30',        'ramon.pascual.font@example.com',        'Ramón',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000080','https://randomuser.me/api/portraits/men/18.jpg'),
(81,'Aranda Vega',       'Barcelona', 'Calle Pelai 20',            'gonzalo.aranda.font@example.com',       'Gonzalo',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000081','https://randomuser.me/api/portraits/men/19.jpg'),
(82,'Cano Romero',       'Valencia',  'Calle San Vicente 8',       'felipe.cano.font@example.com',          'Felipe',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000082','https://randomuser.me/api/portraits/men/20.jpg'),
-- CUIDADOS PERSONAS
(83,'Fuentes Medina',    'Madrid',    'Calle Mayor 5',             'gloria.fuentes.cuid@example.com',       'Gloria',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000083','https://randomuser.me/api/portraits/women/14.jpg'),
(84,'Rubio Parra',       'Barcelona', 'Rambla de Catalunya 50',    'beatriz.rubio.cuid@example.com',        'Beatriz',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000084','https://randomuser.me/api/portraits/women/15.jpg'),
(85,'Ramos Reyes',       'Sevilla',   'Calle Tetuán 3',            'manuela.ramos.cuid@example.com',        'Manuela',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000085','https://randomuser.me/api/portraits/women/16.jpg'),
-- MASCOTAS
(86,'Santamaría Flores', 'Madrid',    'Calle Sagasta 14',          'diego.santamaria.masc@example.com',     'Diego',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000086','https://randomuser.me/api/portraits/men/21.jpg'),
(87,'Expósito Cruz',     'Barcelona', 'Calle Aragó 28',            'paula.exposito.masc@example.com',       'Paula',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000087','https://randomuser.me/api/portraits/women/17.jpg'),
(88,'Muñoz León',        'Valencia',  'Calle Marvà 7',             'irene.munoz.masc@example.com',          'Irene',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000088','https://randomuser.me/api/portraits/women/18.jpg'),
-- EDUCACIÓN
(89,'Guerrero Vidal',    'Madrid',    'Calle Goya 35',             'oscar.guerrero.edu@example.com',        'Óscar',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000089','https://randomuser.me/api/portraits/men/22.jpg'),
(90,'Hidalgo Sanz',      'Barcelona', 'Av. Gaudí 12',              'amparo.hidalgo.edu@example.com',        'Amparo',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000090','https://randomuser.me/api/portraits/women/19.jpg'),
(91,'Parra Jiménez',     'Valencia',  'Calle Bailén 4',            'victor.parra.edu@example.com',          'Víctor',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000091','https://randomuser.me/api/portraits/men/23.jpg'),
(92,'Montoya Gil',       'Bilbao',    'Calle Henao 9',             'susana.montoya.edu@example.com',        'Susana',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000092','https://randomuser.me/api/portraits/women/20.jpg'),
-- BELLEZA / SALUD
(93,'Carrillo Ortiz',    'Madrid',    'Calle Hortaleza 28',        'vanesa.carrillo.sal@example.com',       'Vanesa',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000093','https://randomuser.me/api/portraits/women/21.jpg'),
(94,'Reina Navarro',     'Barcelona', 'Calle Balmes 60',           'alvaro.reina.sal@example.com',          'Álvaro',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000094','https://randomuser.me/api/portraits/men/24.jpg'),
(95,'Mora Díaz',         'Sevilla',   'Calle Amor de Dios 2',      'leticia.mora.sal@example.com',          'Leticia',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000095','https://randomuser.me/api/portraits/women/22.jpg'),
-- URGENCIAS / TECH
(96,'Valdés Serrano',    'Madrid',    'Calle Alberto Aguilera 20', 'bruno.valdes.urg@example.com',          'Bruno',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000096','https://randomuser.me/api/portraits/men/25.jpg'),
(97,'Cabrera Morales',   'Barcelona', 'Calle Enric Granados 15',   'enrique.cabrera.urg@example.com',       'Enrique',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000097','https://randomuser.me/api/portraits/men/26.jpg'),
(98,'Medina Campos',     'Valencia',  'Calle Játiva 3',            'rodrigo.medina.urg@example.com',        'Rodrigo',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000098','https://randomuser.me/api/portraits/men/27.jpg'),
(99,'Bravo Esteve',      'Bilbao',    'Calle Ledesma 6',           'nicolas.bravo.urg@example.com',         'Nicolás',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LgoMwnt1jxy','PROFESIONAL','+34622000099','https://randomuser.me/api/portraits/men/28.jpg');

-- ============================================================
--  PROFESIONAL_INFO  (IDs 38-67)
-- ============================================================
INSERT INTO `profesional_info` (`id`,`cif`,`descripcion`,`experiencia`,`nombre_empresa`,`numero_valoraciones`,`plan`,`valoracion_media`,`usuario_id`,`codigo_postal`,`latitud`,`longitud`,`ubicacion_manual`) VALUES
-- LIMPIEZA
(38, NULL,       'Profesional de la limpieza en Madrid con 6 años. Hogares, oficinas y locales.',                               6,  NULL,                         8,'PREMIUM',4.5, 70,'28012', 40.4138,-3.7025,b'1'),
(39, NULL,       'Limpieza y mantenimiento del hogar en Barcelona. Puntual y concienzudo.',                                     4,  NULL,                         6,'BASICO', 4.1, 71,'08007', 41.3925, 2.1602,b'1'),
(40, NULL,       'Servicio integral de limpieza en Valencia. Materiales incluidos.',                                            3,  NULL,                         5,'BASICO', 3.8, 72,'46010', 39.4753,-0.3584,b'1'),
(41, NULL,       'Manitas y jardinería en Zaragoza. Amplia experiencia en servicios del hogar.',                                5,  NULL,                         7,'PREMIUM',4.2, 73,'50001', 41.6502,-0.8825,b'1'),
(42, NULL,       'Limpieza económica y eficiente en Sevilla. Horarios flexibles, trato cercano.',                               2,  NULL,                         4,'BASICO', 3.6, 74,'41002', 37.3951,-5.9932,b'1'),
-- ELECTRICISTAS
(43,'B11100001', 'Electricista industrial y doméstico en Madrid. 12 años de experiencia. Certificado.',                        12, 'ElectraMadrid',             18,'PRO',   4.7, 75,'28010', 40.4304,-3.6833,b'1'),
(44,'B11100002', 'Electricista certificado en Barcelona. Instalaciones y reparaciones con garantía.',                           8,  'Ferrer Electricidad',       14,'PREMIUM',4.5, 76,'08036', 41.3802, 2.1546,b'1'),
(45, NULL,       'Electricista autónomo en Valencia. Precios ajustados y trabajo garantizado.',                                 5,  NULL,                         9,'BASICO', 4.0, 77,'46005', 39.4630,-0.3972,b'1'),
(46,'B11100003', 'Electricista en Bilbao. Urgencias 24h y revisiones de cuadros eléctricos.',                                  10, 'Lozano Elec',               16,'PRO',   4.6, 78,'48010', 43.2680,-2.9420,b'1'),
(47, NULL,       'Técnico electricidad en Málaga. Servicio rápido y económico.',                                                3,  NULL,                         5,'BASICO', 3.9, 79,'29015', 36.7200,-4.4196,b'1'),
-- FONTANEROS
(48,'B11100004', 'Fontanero con 14 años en Madrid. Urgencias, fugas y averías de todo tipo. Garantía.',                       14, 'PascualFontanería',         22,'PRO',   4.8, 80,'28004', 40.4226,-3.7022,b'1'),
(49, NULL,       'Fontanero en Barcelona. Rápido, serio y con precios transparentes.',                                          7,  NULL,                        11,'PREMIUM',4.4, 81,'08003', 41.3831, 2.1825,b'1'),
(50, NULL,       'Fontanería a domicilio en Valencia. Urgencias y reparaciones programadas.',                                   4,  NULL,                         6,'BASICO', 4.0, 82,'46007', 39.4612,-0.3902,b'1'),
-- CUIDADOS PERSONAS
(51, NULL,       'Auxiliar titulada en ayuda a domicilio. Cuidado de mayores y dependientes en Madrid.',                       9,  NULL,                        15,'PREMIUM',4.6, 83,'28006', 40.4304,-3.6852,b'1'),
(52,'B11100005', 'Cuidadora profesional en Barcelona con certificado en gerontología y primeros auxilios.',                     6,  'CuidaBeat',                 10,'PREMIUM',4.4, 84,'08022', 41.4010, 2.1490,b'1'),
(53, NULL,       'Cuidadora y niñera en Sevilla. Cariñosa, responsable, con referencias.',                                     4,  NULL,                         7,'BASICO', 4.2, 85,'41004', 37.3762,-5.9920,b'1'),
-- MASCOTAS
(54, NULL,       'Amante de los animales. Paseos, cuidados y adiestramiento en Madrid.',                                       5,  NULL,                         9,'PREMIUM',4.5, 86,'28015', 40.4276,-3.7182,b'1'),
(55, NULL,       'Cuidadora de mascotas en Barcelona. Tu perro siempre en buenas manos.',                                      3,  NULL,                         6,'BASICO', 4.3, 87,'08026', 41.4122, 2.1890,b'1'),
(56, NULL,       'Veterinaria y cuidadora de animales en Valencia. Amor y profesionalidad.',                                    4,  NULL,                         7,'PREMIUM',4.6, 88,'46019', 39.4811,-0.3620,b'1'),
-- EDUCACIÓN
(57, NULL,       'Profesor particular con 10 años. Matemáticas, inglés, programación y baile.',                               10,  NULL,                        20,'PRO',   4.8, 89,'28009', 40.4190,-3.6720,b'1'),
(58,'B11100006', 'Profesora y formadora en Barcelona. Idiomas, informática y música.',                                          8,  'HidalgoAcademia',           13,'PREMIUM',4.5, 90,'08028', 41.3742, 2.1264,b'1'),
(59, NULL,       'Clases particulares de inglés, programación y baile en Valencia.',                                            5,  NULL,                         8,'BASICO', 4.1, 91,'46010', 39.4860,-0.3541,b'1'),
(60, NULL,       'Profesora de matemáticas, inglés, programación y baile en Bilbao.',                                          6,  NULL,                        10,'PREMIUM',4.4, 92,'48001', 43.2562,-2.9221,b'1'),
-- BELLEZA / SALUD
(61, NULL,       'Peluquera, maquilladora, masajista y entrenadora personal en Madrid.',                                        8,  NULL,                        14,'PREMIUM',4.6, 93,'28004', 40.4259,-3.7001,b'1'),
(62, NULL,       'Estilista, fisioterapeuta e instructor de yoga y pilates en Barcelona.',                                       6,  NULL,                        10,'PREMIUM',4.4, 94,'08008', 41.3945, 2.1622,b'1'),
(63, NULL,       'Peluquería, masajes, yoga y entrenamiento a domicilio en Sevilla.',                                           3,  NULL,                         5,'BASICO', 4.0, 95,'41003', 37.3818,-5.9714,b'1'),
-- URGENCIAS / TECH
(64,'B11100007', 'Técnico informático y cerrajero urgente en Madrid. Respuesta inmediata, 24h.',                              10,  'SolucionesUrgente',         19,'PRO',   4.7, 96,'28013', 40.4180,-3.7010,b'1'),
(65, NULL,       'Informático urgente y cerrajero en Barcelona. Disponible 24h todos los días.',                                6,  NULL,                        11,'PREMIUM',4.3, 97,'08001', 41.3808, 2.1751,b'1'),
(66, NULL,       'Técnico en redes WiFi, cerrajería urgente y coaching en Valencia.',                                           4,  NULL,                         7,'BASICO', 4.1, 98,'46002', 39.4704,-0.3760,b'1'),
(67, NULL,       'Informático, coach y técnico de redes en Bilbao. Multidisciplinar.',                                         5,  NULL,                         8,'PREMIUM',4.4, 99,'48003', 43.2660,-2.9271,b'1');

-- ============================================================
--  SERVICIOS OFRECIDOS  (IDs 82-282)
--  profesional_id = profesional_info.id (38-67)
-- ============================================================
INSERT INTO `servicio_ofrecido` (`id`,`activa`,`descripcion`,`duracion_min`,`precio_hora`,`titulo`,`profesional_id`,`subcategoria_id`) VALUES

-- ── L1 Carolina · Madrid (info 38) ── subcats 1,2,3,5,9,12,21
(82, b'1','Limpieza completa del hogar: cocina, baños y habitaciones. Materiales incluidos.',             120,15.00,'Limpieza del hogar Madrid',             38,  1),
(83, b'1','Limpieza profunda con desengrasante y desinfección. Ideal tras mudanza.',                      180,18.00,'Limpieza profunda Madrid',              38,  2),
(84, b'1','Limpieza especializada post reforma. Eliminamos polvo, pintura y restos de obra.',             180,17.00,'Limpieza post obra Madrid',             38,  3),
(85, b'1','Pequeñas reparaciones y arreglos del hogar. Sin obra, sin licencia.',                          60, 22.00,'Servicio de manitas Madrid',            38,  5),
(86, b'1','Poda de plantas ornamentales y setos en terraza o jardín. Herramientas propias.',              60, 15.00,'Poda de plantas Madrid',                38,  9),
(87, b'1','Mantenimiento semanal de piscinas privadas: limpieza y control químico.',                      90, 30.00,'Mantenimiento de piscina Madrid',        38, 12),
(88, b'1','Organización de armarios, cocina y almacenaje. Método KonMari adaptado.',                      90, 22.00,'Organización del hogar Madrid',          38, 21),

-- ── L2 Pedro · Barcelona (info 39) ── subcats 1,2,3,5,12,15,24
(89, b'1','Servicio de limpieza a domicilio en Barcelona. Puntual y minucioso.',                          120,14.00,'Limpieza del hogar Barcelona',          39,  1),
(90, b'1','Limpieza en profundidad con productos ecológicos. Resultado garantizado.',                     180,16.00,'Limpieza profunda Barcelona',           39,  2),
(91, b'1','Limpieza post reforma con maquinaria profesional. Presupuesto sin compromiso.',                180,16.00,'Limpieza post obra Barcelona',          39,  3),
(92, b'1','Arreglos varios en el hogar: cuelgas, montajes y pequeñas reparaciones.',                      60, 20.00,'Manitas Barcelona',                     39,  5),
(93, b'1','Mantenimiento de piscina: limpieza de filtros, análisis y equilibrado del agua.',              90, 28.00,'Piscina Barcelona',                     39, 12),
(94, b'1','Limpieza y vaciado de garajes. Organización incluida si se solicita.',                         120,16.00,'Limpieza de garaje Barcelona',          39, 15),
(95, b'1','Fumigación y control de cucarachas, hormigas y otros insectos domésticos.',                    60, 26.00,'Control de plagas Barcelona',           39, 24),

-- ── L3 Nuria · Valencia (info 40) ── subcats 2,3,9,12,15,21,24
(96, b'1','Limpieza intensiva con desinfección y desengrasado. Ideal para pisos de alquiler.',            180,15.00,'Limpieza profunda Valencia',            40,  2),
(97, b'1','Limpieza post reforma en Valencia. Dejamos tu casa como nueva.',                               180,15.00,'Limpieza post reforma Valencia',        40,  3),
(98, b'1','Poda y recorte de plantas en terrazas y jardines. Técnica y herramientas propias.',            60, 14.00,'Poda de plantas Valencia',              40,  9),
(99, b'1','Revisión y limpieza de piscinas. Vacuolado, tratamiento y análisis de agua.',                  90, 25.00,'Mantenimiento de piscina Valencia',      40, 12),
(100,b'1','Limpieza de garajes y trasteros. Retirada de residuos incluida.',                              120,15.00,'Limpieza de garaje Valencia',           40, 15),
(101,b'1','Organización del hogar: armarios, despensa y zonas de almacenaje.',                            90, 20.00,'Organización del hogar Valencia',        40, 21),
(102,b'1','Tratamiento antiplagas: cucarachas, ratones y mosquitos. Productos homologados.',              60, 24.00,'Control de plagas Valencia',            40, 24),

-- ── L4 Alberto · Zaragoza (info 41) ── subcats 1,5,8,10,21,24,15
(103,b'1','Limpieza a domicilio en Zaragoza. Responsable y eficaz. Precio cerrado.',                      120,13.00,'Limpieza del hogar Zaragoza',           41,  1),
(104,b'1','Manitas en Zaragoza: cuelgas, montaje de muebles y pequeñas reparaciones.',                    60, 18.00,'Manitas Zaragoza',                      41,  5),
(105,b'1','Mantenimiento de jardines privados. Riego, abonado y poda incluidos.',                          120,18.00,'Mantenimiento jardín Zaragoza',         41,  8),
(106,b'1','Siega de césped y recorte de bordes. Precio fijo por metro cuadrado.',                          60, 14.00,'Corte de césped Zaragoza',              41, 10),
(107,b'1','Control de plagas en Zaragoza. Sin olor residual, mascotas y niños seguros.',                   60, 22.00,'Control de plagas Zaragoza',            41, 24),
(108,b'1','Home organizer en Zaragoza. Orden y optimización de cada espacio.',                             90, 18.00,'Organización del hogar Zaragoza',        41, 21),
(109,b'1','Limpieza de garajes y plazas de aparcamiento. Aspiración y fregado industrial.',               120,14.00,'Limpieza de garaje Zaragoza',           41, 15),

-- ── L5 Sofía · Sevilla (info 42) ── subcats 2,5,8,9,10,12,24
(110,b'1','Limpieza profunda de pisos y locales en Sevilla. Materiales de primera calidad.',              180,13.00,'Limpieza profunda Sevilla',             42,  2),
(111,b'1','Manitas en Sevilla: cuelgas, pequeñas reparaciones y montaje de muebles.',                     60, 18.00,'Manitas Sevilla',                       42,  5),
(112,b'1','Mantenimiento de jardines en Sevilla. Poda, riego y fertilización.',                            120,16.00,'Mantenimiento jardín Sevilla',          42,  8),
(113,b'1','Poda de árboles ornamentales y arbustos. Herramientas y técnica adecuada.',                    60, 13.00,'Poda de plantas Sevilla',               42,  9),
(114,b'1','Siega y mantenimiento de césped en Sevilla. Presupuesto sin compromiso.',                       60, 13.00,'Corte de césped Sevilla',               42, 10),
(115,b'1','Mantenimiento de piscinas en Sevilla. Análisis semanal y equilibrado.',                         90, 22.00,'Mantenimiento de piscina Sevilla',       42, 12),
(116,b'1','Desinsectación y desratización en Sevilla. Productos ecológicos disponibles.',                  60, 20.00,'Control de plagas Sevilla',             42, 24),

-- ── E1 Marcos · Madrid (info 43) ── subcats 6,7,26,27,29,39,40,128
(117,b'1','Instalación y reparación eléctrica en Madrid. 12 años de experiencia. Garantía.',              60, 38.00,'Reparación eléctrica Madrid',           43, 26),
(118,b'1','Cambio y reparación de enchufes e interruptores. Trabajo limpio y rápido.',                    30, 28.00,'Reparación de enchufes Madrid',         43, 27),
(119,b'1','Sustitución de bombillas fundidas. LED, halógena y bajo consumo.',                              30, 14.00,'Cambio de bombillas Madrid',            43,  6),
(120,b'1','Montaje e instalación de lámparas de techo, pared y apliques.',                                 60, 22.00,'Instalación de lámparas Madrid',        43,  7),
(121,b'1','Revisión y actualización de cuadros eléctricos. Diferenciales y magnetotérmicos.',              60, 45.00,'Cuadro eléctrico Madrid',               43, 29),
(122,b'1','Reparación de frigoríficos y congeladores a domicilio. Todas las marcas.',                      60, 52.00,'Reparación frigoríficos Madrid',         43, 40),
(123,b'1','Reparación de lavadoras en tu domicilio. Garantía de 3 meses incluida.',                        60, 48.00,'Reparación lavadoras Madrid',           43, 39),
(124,b'1','Electricista urgente 24h en Madrid. Cortocircuitos, cortes de luz y averías.',                  60, 65.00,'Electricista urgente Madrid',           43,128),

-- ── E2 Tomás · Barcelona (info 44) ── subcats 6,7,26,27,37,40,41,128
(125,b'1','Reparaciones eléctricas en Barcelona. Certificado de instalaciones.',                           60, 35.00,'Reparación eléctrica Barcelona',        44, 26),
(126,b'1','Cambio de enchufes e interruptores en Barcelona. Sin perforar.',                                30, 25.00,'Enchufes Barcelona',                    44, 27),
(127,b'1','Cambio de bombillas en Barcelona. Asesoramiento sobre iluminación LED.',                        30, 12.00,'Bombillas Barcelona',                   44,  6),
(128,b'1','Instalación de lámparas en Barcelona. Todo tipo de modelos y fabricantes.',                     60, 20.00,'Lámparas Barcelona',                    44,  7),
(129,b'1','Mantenimiento y reparación de aires acondicionados. Todas las marcas.',                         60, 55.00,'Aire acondicionado Barcelona',          44, 37),
(130,b'1','Reparación de frigoríficos a domicilio en Barcelona. Diagnóstico en visita.',                   60, 50.00,'Frigoríficos Barcelona',                44, 40),
(131,b'1','Técnico de hornos y vitrocerámicas en Barcelona. Reparación rápida.',                           60, 45.00,'Hornos Barcelona',                      44, 41),
(132,b'1','Electricista urgente en Barcelona disponible 24h. Sin recargo nocturno.',                        60, 62.00,'Electricista urgente Barcelona',        44,128),

-- ── E3 Ignacio · Valencia (info 45) ── subcats 6,26,27,29,37,39,42,128
(133,b'1','Electricista en Valencia. Instalaciones y reparaciones con presupuesto gratuito.',              60, 32.00,'Reparación eléctrica Valencia',         45, 26),
(134,b'1','Reparación de enchufes e interruptores en Valencia. Trabajo sin perforaciones.',                30, 22.00,'Enchufes Valencia',                    45, 27),
(135,b'1','Cambio de bombillas y revisión de luminarias en Valencia.',                                     30, 11.00,'Bombillas Valencia',                    45,  6),
(136,b'1','Revisión y reparación de cuadro eléctrico en Valencia. Certificado incluido.',                  60, 40.00,'Cuadro eléctrico Valencia',             45, 29),
(137,b'1','Reparación de climatizadores y splits en Valencia. Todas las marcas.',                          60, 50.00,'Climatización Valencia',                45, 37),
(138,b'1','Reparación de lavavajillas a domicilio en Valencia. Garantía incluida.',                        60, 44.00,'Lavavajillas Valencia',                 45, 42),
(139,b'1','Técnico de lavadoras en Valencia. Sin desplazamiento al taller.',                               60, 45.00,'Lavadoras Valencia',                    45, 39),
(140,b'1','Electricista urgente Valencia 24h. Cortes de luz y averías resueltas al momento.',              60, 58.00,'Electricista urgente Valencia',         45,128),

-- ── E4 Héctor · Bilbao (info 46) ── subcats 7,26,27,29,40,41,42,128
(141,b'1','Electricista en Bilbao. Instalaciones industriales y domésticas.',                              60, 40.00,'Reparación eléctrica Bilbao',           46, 26),
(142,b'1','Cambio de enchufes en Bilbao. Rápido, eficaz y con garantía.',                                 30, 26.00,'Enchufes Bilbao',                       46, 27),
(143,b'1','Instalación de lámparas y apliques en Bilbao. Trabajo limpio y cuidado.',                       60, 22.00,'Lámparas Bilbao',                       46,  7),
(144,b'1','Cuadro eléctrico Bilbao. Revisión normativa y actualización de diferenciales.',                 60, 44.00,'Cuadro eléctrico Bilbao',               46, 29),
(145,b'1','Reparación de frigoríficos en Bilbao. Revisión completa con diagnóstico.',                      60, 50.00,'Frigoríficos Bilbao',                   46, 40),
(146,b'1','Reparación de hornos eléctricos y de gas en Bilbao. Todas las marcas.',                         60, 46.00,'Hornos Bilbao',                         46, 41),
(147,b'1','Reparación de lavavajillas en Bilbao. Avería diagnosticada en primera visita.',                  60, 44.00,'Lavavajillas Bilbao',                   46, 42),
(148,b'1','Electricista urgente 24h Bilbao. Festivos y fines de semana sin recargo.',                       60, 60.00,'Electricista urgente Bilbao',           46,128),

-- ── E5 Víctor · Málaga (info 47) ── subcats 6,7,26,27,37,39,41,42
(149,b'1','Electricista en Málaga. Instalaciones y reparaciones con precios ajustados.',                   60, 32.00,'Reparación eléctrica Málaga',           47, 26),
(150,b'1','Cambio de enchufes e interruptores en Málaga. Presupuesto gratuito.',                           30, 22.00,'Enchufes Málaga',                       47, 27),
(151,b'1','Cambio de bombillas en Málaga. Consejos de ahorro energético incluidos.',                        30, 10.00,'Bombillas Málaga',                      47,  6),
(152,b'1','Instalación de lámparas en Málaga. Modelos modernos y clásicos.',                               60, 19.00,'Lámparas Málaga',                       47,  7),
(153,b'1','Reparación de aires acondicionados en Málaga. Recarga de gas y mantenimiento.',                 60, 50.00,'Climatización Málaga',                  47, 37),
(154,b'1','Reparación de hornos y placas en Málaga. Sin necesidad de llevarlos a taller.',                 60, 42.00,'Hornos Málaga',                         47, 41),
(155,b'1','Reparación de lavavajillas en Málaga. Revisión completa y garantía.',                           60, 40.00,'Lavavajillas Málaga',                   47, 42),
(156,b'1','Reparación de lavadoras en Málaga. Técnico certificado. Garantía de 3 meses.',                  60, 44.00,'Lavadoras Málaga',                      47, 39),

-- ── F1 Ramón · Madrid (info 48) ── subcats 30,31,32,33,127,130
(157,b'1','Fontanería doméstica en Madrid. Averías, cambios y mejoras. Sin sorpresas.',                    60, 36.00,'Fontanería Madrid',                     48, 30),
(158,b'1','Detección y reparación de fugas sin obra innecesaria. Técnica no invasiva.',                    60, 42.00,'Fugas de agua Madrid',                  48, 31),
(159,b'1','Cambio y reparación de grifos y mezcladores. Todas las marcas.',                                30, 24.00,'Grifos Madrid',                         48, 32),
(160,b'1','Desatascos de fregaderos, bañeras e inodoros. Máquina de presión profesional.',                 60, 35.00,'Desatascos Madrid',                     48, 33),
(161,b'1','Fontanero urgente 24h Madrid. Fugas, roturas y atascos resueltos en menos de 1h.',              60, 58.00,'Fontanero urgente Madrid',              48,127),
(162,b'1','Desatascos urgentes en Madrid. Técnica hydrojet para atascos graves.',                          60, 62.00,'Desatascos urgentes Madrid',            48,130),

-- ── F2 Gonzalo · Barcelona (info 49) ── subcats 30,31,32,33,127,130
(163,b'1','Fontanero en Barcelona. Rápido y transparente. Visita gratuita con diagnóstico.',               60, 33.00,'Fontanería Barcelona',                  49, 30),
(164,b'1','Localizo y reparo fugas de agua en Barcelona. Certificado de reparación.',                      60, 40.00,'Fugas de agua Barcelona',               49, 31),
(165,b'1','Reparación de grifos que gotean o no funcionan en Barcelona.',                                  30, 22.00,'Grifos Barcelona',                      49, 32),
(166,b'1','Desatascos de tuberías en Barcelona. Sin obra y con garantía de resultado.',                    60, 32.00,'Desatascos Barcelona',                  49, 33),
(167,b'1','Fontanero urgente 24h en Barcelona. Festivos sin recargo adicional.',                           60, 55.00,'Fontanero urgente Barcelona',           49,127),
(168,b'1','Desatascos urgentes Barcelona. Máquina de presión de alta potencia.',                           60, 58.00,'Desatascos urgentes Barcelona',         49,130),

-- ── F3 Felipe · Valencia (info 50) ── subcats 30,31,32,33,127,130
(169,b'1','Fontanería a domicilio en Valencia. Trabajos de calidad a precios ajustados.',                  60, 30.00,'Fontanería Valencia',                   50, 30),
(170,b'1','Reparación urgente de fugas en Valencia. Mínima intervención garantizada.',                     60, 36.00,'Fugas de agua Valencia',                50, 31),
(171,b'1','Reparación de grifos y llaves de paso en Valencia. Todas las marcas.',                          30, 20.00,'Grifos Valencia',                       50, 32),
(172,b'1','Desatasco de tuberías y sanitarios en Valencia. Presupuesto previo gratis.',                    60, 30.00,'Desatascos Valencia',                   50, 33),
(173,b'1','Fontanero urgente en Valencia disponible 24h. Respuesta en menos de 90 minutos.',               60, 52.00,'Fontanero urgente Valencia',            50,127),
(174,b'1','Desatascos urgentes en Valencia. Técnica de alta presión. Sin obras.',                          60, 55.00,'Desatascos urgentes Valencia',          50,130),

-- ── C1 Gloria · Madrid (info 51) ── subcats 51,52,53,55,56
(175,b'1','Cuidado de personas mayores en domicilio. Higiene, medicación y compañía.',                    240, 16.00,'Cuidado de mayores Madrid',             51, 51),
(176,b'1','Asistencia a personas dependientes en Madrid. Titulación oficial.',                             480, 15.00,'Cuidado de dependientes Madrid',        51, 52),
(177,b'1','Acompañamiento en casa para mayores o personas con movilidad reducida.',                        180, 13.00,'Acompañamiento en casa Madrid',         51, 53),
(178,b'1','Cuidado de niños en domicilio. De 0 a 12 años. Actividades educativas.',                       120, 14.00,'Cuidado de niños Madrid',               51, 55),
(179,b'1','Niñera con experiencia en Madrid. Cuidado responsable por horas.',                              120, 13.00,'Niñera Madrid',                         51, 56),

-- ── C2 Beatriz · Barcelona (info 52) ── subcats 51,52,53,55,56
(180,b'1','Cuidado de mayores en Barcelona. Certificado en gerontología y primeros auxilios.',             240, 17.00,'Cuidado de mayores Barcelona',          52, 51),
(181,b'1','Asistente a domicilio para personas con dependencia reconocida en Barcelona.',                  480, 16.00,'Dependientes Barcelona',                52, 52),
(182,b'1','Compañía y acompañamiento a domicilio en Barcelona. Paciencia y empatía.',                     180, 14.00,'Acompañamiento Barcelona',              52, 53),
(183,b'1','Cuidadora infantil titulada en Barcelona. Niños de 0 a 10 años.',                              120, 15.00,'Cuidado niños Barcelona',               52, 55),
(184,b'1','Niñera en Barcelona. Flexible de horario, con referencias comprobables.',                       120, 14.00,'Niñera Barcelona',                      52, 56),

-- ── C3 Manuela · Sevilla (info 53) ── subcats 51,52,53,55,56
(185,b'1','Cuidadora de mayores en Sevilla. Trato humano y profesional garantizado.',                     240, 14.00,'Cuidado de mayores Sevilla',            53, 51),
(186,b'1','Asistencia a personas dependientes en Sevilla. Experiencia y dedicación.',                     480, 14.00,'Dependientes Sevilla',                  53, 52),
(187,b'1','Servicio de compañía a domicilio en Sevilla. Conversación, paseos y apoyo.',                   180, 12.00,'Acompañamiento Sevilla',                53, 53),
(188,b'1','Cuidado de niños en Sevilla. Entretenimiento educativo garantizado.',                           120, 13.00,'Cuidado niños Sevilla',                 53, 55),
(189,b'1','Niñera disponible en Sevilla. Cariño y responsabilidad ante todo.',                             120, 12.00,'Niñera Sevilla',                        53, 56),

-- ── M1 Diego · Madrid (info 54) ── subcats 76,77,83,89,90
(190,b'1','Paseos de perros en Madrid. Rutas seguras, grupos de máximo 3.',                                60, 14.00,'Paseo de perros Madrid',                54, 76),
(191,b'1','Cuido a tu perro en su domicilio mientras trabajas. Fotos incluidas.',                         480, 13.00,'Cuidado de perros en casa Madrid',       54, 77),
(192,b'1','Adiestramiento básico en Madrid. Sit, stay, come y socialización canina.',                      60, 30.00,'Adiestramiento básico Madrid',          54, 83),
(193,b'1','Visita veterinaria a domicilio en Madrid. Consulta, vacunas y diagnóstico.',                    60, 65.00,'Veterinario a domicilio Madrid',         54, 89),
(194,b'1','Administración de medicación a mascotas en Madrid. Inyecciones y pastillas.',                   30, 28.00,'Medicación mascotas Madrid',            54, 90),

-- ── M2 Paula · Barcelona (info 55) ── subcats 76,77,83,89,90
(195,b'1','Paseadora de perros en Barcelona. Grupos reducidos, rutas variadas.',                           60, 13.00,'Paseo de perros Barcelona',             55, 76),
(196,b'1','Pet sitting en Barcelona. Tu perro feliz en casa con toda la atención.',                       480, 12.00,'Cuidado de perros Barcelona',           55, 77),
(197,b'1','Educación canina básica en Barcelona. Método positivo, sin castigos.',                          60, 28.00,'Adiestramiento básico Barcelona',       55, 83),
(198,b'1','Veterinaria a domicilio en Barcelona. Sin el estrés de la clínica.',                            60, 60.00,'Veterinario a domicilio Barcelona',     55, 89),
(199,b'1','Administración de tratamientos a mascotas en Barcelona. Con pauta incluida.',                   30, 26.00,'Medicación mascotas Barcelona',         55, 90),

-- ── M3 Irene · Valencia (info 56) ── subcats 76,77,83,89,90
(200,b'1','Paseo de perros en Valencia. Seguro, responsable y puntual. Fotos diarias.',                   60, 12.00,'Paseo de perros Valencia',              56, 76),
(201,b'1','Cuido tu perro en casa en Valencia. Cariño y atención garantizados.',                          480, 11.00,'Cuidado de perros Valencia',            56, 77),
(202,b'1','Adiestramiento básico de perros en Valencia. Sesiones individuales.',                           60, 26.00,'Adiestramiento básico Valencia',        56, 83),
(203,b'1','Consulta veterinaria a domicilio en Valencia. Vacunas y revisiones.',                           60, 57.00,'Veterinario a domicilio Valencia',      56, 89),
(204,b'1','Pauta y administración de medicación a mascotas en Valencia.',                                  30, 25.00,'Medicación mascotas Valencia',          56, 90),

-- ── ED1 Óscar · Madrid (info 57) ── subcats 102,103,104,105,110,119,126
(205,b'1','Matemáticas para primaria en Madrid. Refuerzo escolar con metodología visual.',                 60, 20.00,'Matemáticas primaria Madrid',           57,102),
(206,b'1','Matemáticas de bachillerato en Madrid. Análisis, álgebra y estadística.',                       60, 28.00,'Matemáticas bachillerato Madrid',       57,103),
(207,b'1','Inglés conversacional en Madrid. Profesor con acento neutro. Todos los niveles.',               60, 24.00,'Inglés conversación Madrid',            57,104),
(208,b'1','Gramática inglesa en Madrid. Tiempos verbales, estructura y vocabulario.',                       60, 24.00,'Inglés gramática Madrid',               57,105),
(209,b'1','Desarrollo web en Madrid. HTML, CSS, JavaScript y React desde cero.',                           60, 35.00,'Desarrollo web Madrid',                 57,110),
(210,b'1','Baile urbano en Madrid. Hip-hop y street dance para todos los niveles.',                        60, 22.00,'Baile urbano Madrid',                   57,119),
(211,b'1','Alemán desde cero en Madrid. Vocabulario, pronunciación y gramática A1-A2.',                   60, 24.00,'Alemán Madrid',                         57,126),

-- ── ED2 Amparo · Barcelona (info 58) ── subcats 102,103,105,109,110,114,120,126
(212,b'1','Clases de matemáticas de primaria en Barcelona. Paciencia y resultados.',                       60, 18.00,'Matemáticas primaria Barcelona',        58,102),
(213,b'1','Matemáticas de bachillerato en Barcelona. Preparación selectividad.',                           60, 25.00,'Matemáticas bachillerato Barcelona',    58,103),
(214,b'1','Gramática inglesa en Barcelona. Preparación Cambridge y IELTS.',                                60, 22.00,'Inglés gramática Barcelona',            58,105),
(215,b'1','Programación Java en Barcelona. Desde POO básico a Spring Boot.',                               60, 38.00,'Java Barcelona',                        58,109),
(216,b'1','Programación web en Barcelona. Frontend moderno: HTML, CSS y JavaScript.',                      60, 33.00,'Web Barcelona',                         58,110),
(217,b'1','Guitarra acústica en Barcelona. Acordes, ritmos y tus canciones favoritas.',                    60, 24.00,'Guitarra acústica Barcelona',           58,114),
(218,b'1','Salsa y bachata en Barcelona. Clases para principiantes y nivel medio.',                        60, 22.00,'Baile latino Barcelona',                58,120),
(219,b'1','Alemán nivel A1-A2 en Barcelona. Enfoque comunicativo y conversacional.',                       60, 22.00,'Alemán Barcelona',                      58,126),

-- ── ED3 Víctor P. · Valencia (info 59) ── subcats 104,105,109,114,119,120,126
(220,b'1','Inglés conversacional en Valencia. Fluidez y pronunciación correcta.',                          60, 22.00,'Inglés conversación Valencia',          59,104),
(221,b'1','Gramática inglesa en Valencia. Estructura y tiempos verbales desde cero.',                      60, 22.00,'Inglés gramática Valencia',             59,105),
(222,b'1','Programación Java en Valencia. Backend, APIs REST y bases de datos.',                           60, 35.00,'Java Valencia',                         59,109),
(223,b'1','Guitarra acústica en Valencia. Aprende tus canciones favoritas desde cero.',                    60, 22.00,'Guitarra acústica Valencia',            59,114),
(224,b'1','Baile urbano en Valencia. Hip-hop y freestyle para principiantes.',                              60, 20.00,'Baile urbano Valencia',                 59,119),
(225,b'1','Baile latino en Valencia. Salsa, bachata y cha-cha para todos los niveles.',                    60, 20.00,'Baile latino Valencia',                 59,120),
(226,b'1','Alemán básico en Valencia. Pronunciación, vocabulario y gramática A1.',                         60, 20.00,'Alemán Valencia',                       59,126),

-- ── ED4 Susana · Bilbao (info 60) ── subcats 102,103,104,109,110,114,119,120
(227,b'1','Matemáticas primaria en Bilbao. Refuerzo y apoyo escolar personalizado.',                       60, 20.00,'Matemáticas primaria Bilbao',           60,102),
(228,b'1','Matemáticas bachillerato en Bilbao. Exámenes y selectividad.',                                  60, 26.00,'Matemáticas bachillerato Bilbao',       60,103),
(229,b'1','Inglés conversacional en Bilbao. Práctica oral para perder el miedo.',                          60, 22.00,'Inglés conversación Bilbao',            60,104),
(230,b'1','Programación Java en Bilbao. Proyectos reales desde el primer día.',                            60, 36.00,'Java Bilbao',                           60,109),
(231,b'1','Desarrollo web en Bilbao. HTML, CSS, JavaScript y frameworks modernos.',                        60, 32.00,'Web Bilbao',                             60,110),
(232,b'1','Guitarra acústica en Bilbao. Metodología progresiva y divertida.',                              60, 22.00,'Guitarra acústica Bilbao',              60,114),
(233,b'1','Baile urbano en Bilbao. Aprende hip-hop y street dance con estilo.',                            60, 20.00,'Baile urbano Bilbao',                   60,119),
(234,b'1','Baile latino en Bilbao. Salsa y bachata para principiantes y nivel medio.',                     60, 20.00,'Baile latino Bilbao',                   60,120),

-- ── BS1 Vanesa · Madrid (info 61) ── subcats 59,60,65,66,68,69,70
(235,b'1','Peluquería a domicilio en Madrid. Cortes, tintes y peinados. Material profesional.',            60, 35.00,'Peluquería a domicilio Madrid',         61, 59),
(236,b'1','Maquillaje profesional en Madrid. Bodas, eventos y fotografía.',                                90, 42.00,'Maquillaje Madrid',                     61, 60),
(237,b'1','Masajes relajantes y descontracturantes a domicilio en Madrid. Camilla propia.',                60, 45.00,'Masajes Madrid',                        61, 65),
(238,b'1','Fisioterapia de recuperación en Madrid. Contracturas, lesiones y dolor crónico.',               60, 57.00,'Fisioterapia Madrid',                   61, 66),
(239,b'1','Entrenadora personal en Madrid. Plan adaptado a tus objetivos y nivel.',                        60, 40.00,'Entrenadora personal Madrid',           61, 68),
(240,b'1','Clases de yoga a domicilio en Madrid. Hatha y vinyasa para todos los niveles.',                 60, 25.00,'Yoga Madrid',                           61, 69),
(241,b'1','Pilates mat a domicilio en Madrid. Material y programa personal incluidos.',                    60, 25.00,'Pilates Madrid',                        61, 70),

-- ── BS2 Álvaro · Barcelona (info 62) ── subcats 59,60,65,66,68,69,70
(242,b'1','Peluquero a domicilio en Barcelona. Cortes modernos y coloración profesional.',                 60, 32.00,'Peluquería a domicilio Barcelona',      62, 59),
(243,b'1','Maquillaje profesional en Barcelona. Novias, eventos y maquillaje artístico.',                  90, 40.00,'Maquillaje Barcelona',                  62, 60),
(244,b'1','Masajes terapéuticos y deportivos en Barcelona. Recuperación muscular en casa.',                60, 42.00,'Masajes Barcelona',                     62, 65),
(245,b'1','Fisioterapeuta colegiado en Barcelona. Atención domiciliaria sin desplazamientos.',             60, 55.00,'Fisioterapia Barcelona',                62, 66),
(246,b'1','Personal trainer en Barcelona. Fuerza, cardio y nutrición. Resultados visibles.',              60, 38.00,'Entrenador personal Barcelona',         62, 68),
(247,b'1','Instructor de yoga en Barcelona. Clases individuales o en pareja en casa.',                    60, 23.00,'Yoga Barcelona',                        62, 69),
(248,b'1','Pilates a domicilio en Barcelona. Adaptado a tu condición física.',                             60, 23.00,'Pilates Barcelona',                     62, 70),

-- ── BS3 Leticia · Sevilla (info 63) ── subcats 59,60,65,66,68,69,70
(249,b'1','Peluquería a domicilio en Sevilla. Cortes, tintes y tratamientos capilares.',                   60, 28.00,'Peluquería a domicilio Sevilla',        63, 59),
(250,b'1','Maquilladora profesional en Sevilla. Maquillaje de día, noche y eventos.',                      90, 36.00,'Maquillaje Sevilla',                    63, 60),
(251,b'1','Masajes a domicilio en Sevilla. Relajante, deportivo y piedras calientes.',                     60, 38.00,'Masajes Sevilla',                       63, 65),
(252,b'1','Fisioterapia a domicilio en Sevilla. Lesiones, contracturas y rehabilitación.',                  60, 50.00,'Fisioterapia Sevilla',                  63, 66),
(253,b'1','Entrenadora personal en Sevilla. Plan de entrenamiento y dieta personalizado.',                 60, 35.00,'Entrenadora personal Sevilla',          63, 68),
(254,b'1','Yoga a domicilio en Sevilla. Respiración, flexibilidad y bienestar mental.',                    60, 20.00,'Yoga Sevilla',                          63, 69),
(255,b'1','Pilates individual a domicilio en Sevilla. Colchoneta y accesorios incluidos.',                 60, 20.00,'Pilates Sevilla',                       63, 70),

-- ── UT1 Bruno · Madrid (info 64) ── subcats 129,130,134,147,148,159,160,174
(256,b'1','Cerrajero urgente 24h en Madrid. Aperturas sin daños en menos de 30 minutos.',                  60, 58.00,'Cerrajero urgente Madrid',              64,129),
(257,b'1','Desatascos urgentes en Madrid. Hydrojet de alta presión. Sin obra.',                            60, 62.00,'Desatascos urgentes Madrid',            64,130),
(258,b'1','Cambio de cerradura urgente en Madrid. Alta seguridad y multiestrella.',                        60, 52.00,'Cambio cerradura urgente Madrid',       64,134),
(259,b'1','Técnico informático urgente en Madrid. Virus, pantallas azules y fallos del sistema.',          60, 48.00,'Informático urgente Madrid',            64,147),
(260,b'1','Recuperación de datos en Madrid. Disco duro, SSD, USB y tarjetas.',                             60, 58.00,'Recuperación de datos Madrid',          64,148),
(261,b'1','Configuración WiFi en Madrid. Cobertura total en toda la vivienda.',                            60, 38.00,'Configuración WiFi Madrid',             64,159),
(262,b'1','Optimización de red doméstica en Madrid. PLC, repetidores y router.',                           60, 40.00,'Red doméstica Madrid',                  64,160),
(263,b'1','Mindfulness y meditación a domicilio en Madrid. Gestión del estrés.',                           60, 38.00,'Mindfulness Madrid',                    64,174),

-- ── UT2 Enrique · Barcelona (info 65) ── subcats 129,130,147,148,159,160,170
(264,b'1','Cerrajero urgente en Barcelona. Apertura de puertas en 20 minutos garantizados.',               60, 55.00,'Cerrajero urgente Barcelona',           65,129),
(265,b'1','Desatascos urgentes en Barcelona. Respuesta inmediata, sin recargo nocturno.',                  60, 58.00,'Desatascos urgentes Barcelona',         65,130),
(266,b'1','Técnico informático urgente en Barcelona. PC que no arranca, virus y pérdida datos.',           60, 45.00,'Informático urgente Barcelona',         65,147),
(267,b'1','Recuperación urgente de datos en Barcelona. Formateos y fallos de disco.',                      60, 55.00,'Recuperación datos Barcelona',          65,148),
(268,b'1','Técnico WiFi en Barcelona. Optimización de señal y configuración de router.',                   60, 35.00,'WiFi Barcelona',                        65,159),
(269,b'1','Mejora del rendimiento de red doméstica en Barcelona. Cableado y WiFi.',                        60, 38.00,'Red doméstica Barcelona',               65,160),
(270,b'1','Coaching personal en Barcelona. Coach certificado ICF. Metas y objetivos.',                     60, 72.00,'Coaching Barcelona',                    65,170),

-- ── UT3 Rodrigo · Valencia (info 66) ── subcats 129,130,134,147,159,170,174
(271,b'1','Cerrajero urgente en Valencia. Aperturas sin daños, disponible todo el año.',                   60, 52.00,'Cerrajero urgente Valencia',            66,129),
(272,b'1','Desatascos urgentes en Valencia. Maquinaria profesional, resultado inmediato.',                 60, 55.00,'Desatascos urgentes Valencia',          66,130),
(273,b'1','Cambio de cerradura urgente en Valencia. Seguridad alta y asesoramiento.',                      60, 48.00,'Cambio cerradura urgente Valencia',     66,134),
(274,b'1','Soporte técnico informático urgente en Valencia. Tablets, móviles y PC.',                       60, 42.00,'Informático urgente Valencia',          66,147),
(275,b'1','Configuración y optimización de WiFi en Valencia. Cobertura total garantizada.',                60, 33.00,'WiFi Valencia',                         66,159),
(276,b'1','Coach profesional en Valencia. Sesiones de coaching de vida y carrera.',                        60, 68.00,'Coaching Valencia',                     66,170),
(277,b'1','Mindfulness a domicilio en Valencia. Técnicas de relajación y meditación.',                     60, 36.00,'Mindfulness Valencia',                  66,174),

-- ── UT4 Nicolás · Bilbao (info 67) ── subcats 148,159,160,170,174
(278,b'1','Recuperación de datos en Bilbao. Discos duros, USB y memoria flash.',                           60, 52.00,'Recuperación datos Bilbao',             67,148),
(279,b'1','Técnico WiFi en Bilbao. Instalación de repetidores y configuración óptima.',                    60, 32.00,'WiFi Bilbao',                           67,159),
(280,b'1','Optimización de red doméstica en Bilbao. Velocidad máxima garantizada.',                        60, 34.00,'Red doméstica Bilbao',                  67,160),
(281,b'1','Coaching personal en Bilbao. Coach certificado. Transforma tu vida.',                           60, 68.00,'Coaching Bilbao',                       67,170),
(282,b'1','Mindfulness y meditación en Bilbao. Reducción del estrés y bienestar.',                        60, 35.00,'Mindfulness Bilbao',                    67,174);

-- ============================================================
--  AUTO_INCREMENT
-- ============================================================
ALTER TABLE `usuario`            AUTO_INCREMENT = 100;
ALTER TABLE `profesional_info`   AUTO_INCREMENT = 68;
ALTER TABLE `servicio_ofrecido`  AUTO_INCREMENT = 283;
