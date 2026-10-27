-- Migración 003: seed de datos reales
-- Idempotente: DELETE + INSERT. Se puede correr 2 veces sin romper.

-- Limpiar datos de prueba
DELETE FROM resultados;
DELETE FROM eventos;
DELETE FROM facultades;
DELETE FROM sqlite_sequence WHERE name IN ('resultados', 'eventos', 'facultades');

-- 6 facultades reales con logo_url
INSERT INTO facultades (nombre, logo_url) VALUES
  ('FTL',   '/img/FTL.jpeg'),
  ('FTI',   '/img/FTI.jpeg'),
  ('FC',    '/img/FC.jpeg'),
  ('FTE',   '/img/FTE.jpeg'),
  ('FIO',   '/img/FIO.jpeg'),
  ('CITEC', '/img/CITEC.jpeg');

-- 4 eventos 2026 válidos
INSERT INTO eventos (deporte, enfrentamiento, fecha, hora, lugar, estado, detalles, probabilidad) VALUES
  ('Volleyball', 'FTL vs FTI',   '2026-02-05', '10:00', 'Cancha 1',  'proximo',    '', 60),
  ('Fútbol',     'FC vs FTE',    '2026-03-12', '15:30', 'Cancha 2',  'proximo',    '', 55),
  ('Béisbol',    'FIO vs CITEC', '2026-04-20', '09:00', 'Campo 3',   'proximo',    '', 50),
  ('Ajedrez',    'FTL vs CITEC', '2026-05-08', '14:00', 'Sala',      'programado', '', 45);

-- Resultados (facultad_id: 1=FTL, 2=FTI, 3=FC, 4=FTE, 5=FIO, 6=CITEC)
-- Posiciones: 1=oro, 2=plata, 3=bronce, 4=cuarto, 5=quinto
INSERT INTO resultados (facultad_id, deporte, posicion_lograda, puntuacion_final) VALUES
  (1, 'Volleyball', 1, 10),
  (1, 'Ajedrez',    1, 10),
  (1, 'Fútbol',     3, 5),
  (2, 'Volleyball', 2, 7),
  (2, 'Béisbol',    1, 10),
  (2, 'Ajedrez',    2, 7),
  (3, 'Fútbol',     1, 10),
  (3, 'Béisbol',    3, 5),
  (4, 'Fútbol',     2, 7),
  (4, 'Ajedrez',    3, 5),
  (5, 'Béisbol',    2, 7),
  (5, 'Ajedrez',    4, 3),
  (6, 'Béisbol',    4, 3),
  (6, 'Ajedrez',    5, 1),
  (6, 'Volleyball', 3, 5);
