USE jobfree;

-- Usuarios sin foto_url (asignadas por ID y género)
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/23.jpg' WHERE id = 1;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/29.jpg'   WHERE id = 2;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/24.jpg' WHERE id = 3;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/25.jpg' WHERE id = 5;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/33.jpg'   WHERE id = 6;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/26.jpg' WHERE id = 7;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/34.jpg'   WHERE id = 8;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/27.jpg' WHERE id = 9;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/35.jpg'   WHERE id = 10;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/28.jpg' WHERE id = 11;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/36.jpg'   WHERE id = 12;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/29.jpg' WHERE id = 13;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/37.jpg'   WHERE id = 14;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/31.jpg' WHERE id = 15;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/32.jpg' WHERE id = 17;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/38.jpg'   WHERE id = 18;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/33.jpg' WHERE id = 19;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/39.jpg'   WHERE id = 21;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/40.jpg'   WHERE id = 23;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/41.jpg'   WHERE id = 24;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/42.jpg'   WHERE id = 25;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/43.jpg'   WHERE id = 26;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/44.jpg'   WHERE id = 27;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/34.jpg' WHERE id = 28;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/45.jpg'   WHERE id = 29;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/46.jpg'   WHERE id = 30;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/47.jpg'   WHERE id = 31;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/35.jpg' WHERE id = 35;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/48.jpg'   WHERE id = 36;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/36.jpg' WHERE id = 37;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/37.jpg' WHERE id = 38;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/women/38.jpg' WHERE id = 46;
UPDATE usuario SET foto_url = 'https://randomuser.me/api/portraits/men/49.jpg'   WHERE id = 47;

-- Verificar: usuarios que aún quedan sin foto (solo debe quedar el admin)
SELECT id, nombre, apellidos, rol, foto_url
FROM usuario
WHERE foto_url IS NULL
ORDER BY id;
