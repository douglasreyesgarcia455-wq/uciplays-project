-- Migración 005: normalizar a 3FN (deportes, equipos, integrantes, sanciones, eventos, resultados)
-- Idempotente: DROP + CREATE + seed. Se puede correr 2 veces sin romper.
-- Facultades se conserva (datos reales). Todo lo demás es ficticio y se recrea.

-- ============================================================
-- 1. DROP de tablas viejas (orden: hijos antes que padres)
-- ============================================================
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS resultados;
DROP TABLE IF EXISTS sanciones;
DROP TABLE IF EXISTS integrantes;
DROP TABLE IF EXISTS equipos;
DROP TABLE IF EXISTS deportes;

-- ============================================================
-- 2. CREATE de tablas nuevas (3FN)
-- ============================================================
CREATE TABLE deportes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE equipos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    facultad_id INTEGER NOT NULL,
    deporte_id INTEGER NOT NULL,
    FOREIGN KEY (facultad_id) REFERENCES facultades(id),
    FOREIGN KEY (deporte_id) REFERENCES deportes(id),
    UNIQUE (facultad_id, deporte_id)
);

CREATE TABLE integrantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    ci TEXT NOT NULL UNIQUE,
    matricula TEXT NOT NULL UNIQUE,
    equipo_id INTEGER NOT NULL,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id)
);

CREATE TABLE sanciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipo_id INTEGER NOT NULL,
    puntos_descontados INTEGER NOT NULL,
    motivo TEXT,
    observaciones TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id)
);

CREATE TABLE eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deporte_id INTEGER NOT NULL,
    equipo_local_id INTEGER NOT NULL,
    equipo_visitante_id INTEGER NOT NULL,
    fecha TEXT,
    hora TEXT,
    lugar TEXT,
    estado TEXT DEFAULT 'proximo',
    detalles TEXT DEFAULT '',
    probabilidad INTEGER DEFAULT 50,
    FOREIGN KEY (deporte_id) REFERENCES deportes(id),
    FOREIGN KEY (equipo_local_id) REFERENCES equipos(id),
    FOREIGN KEY (equipo_visitante_id) REFERENCES equipos(id)
);

CREATE TABLE resultados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipo_id INTEGER NOT NULL,
    posicion_lograda INTEGER,
    puntuacion_final INTEGER,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id)
);

-- ============================================================
-- 3. SEED: deportes
-- ============================================================
INSERT INTO deportes (nombre) VALUES
    ('Volleyball'), ('Fútbol'), ('Béisbol'), ('Ajedrez');

-- ============================================================
-- 4. SEED: equipos (24 = 6 facultades × 4 deportes)
-- facultad_id: 1=FTL, 2=FTI, 3=FC, 4=FTE, 5=FIO, 6=CITEC
-- deporte_id: 1=Volleyball, 2=Fútbol, 3=Béisbol, 4=Ajedrez
-- ============================================================
INSERT INTO equipos (nombre, facultad_id, deporte_id) VALUES
    ('FTL Volleyball', 1, 1), ('FTL Fútbol', 1, 2), ('FTL Béisbol', 1, 3), ('FTL Ajedrez', 1, 4),
    ('FTI Volleyball', 2, 1), ('FTI Fútbol', 2, 2), ('FTI Béisbol', 2, 3), ('FTI Ajedrez', 2, 4),
    ('FC Volleyball', 3, 1), ('FC Fútbol', 3, 2), ('FC Béisbol', 3, 3), ('FC Ajedrez', 3, 4),
    ('FTE Volleyball', 4, 1), ('FTE Fútbol', 4, 2), ('FTE Béisbol', 4, 3), ('FTE Ajedrez', 4, 4),
    ('FIO Volleyball', 5, 1), ('FIO Fútbol', 5, 2), ('FIO Béisbol', 5, 3), ('FIO Ajedrez', 5, 4),
    ('CITEC Volleyball', 6, 1), ('CITEC Fútbol', 6, 2), ('CITEC Béisbol', 6, 3), ('CITEC Ajedrez', 6, 4);

-- ============================================================
-- 5. SEED: integrantes (72 = 24 equipos × 3)
-- ============================================================
INSERT INTO integrantes (nombre, ci, matricula, equipo_id) VALUES
    ('Integrante 1 FTL V',  'CI0001', 'MAT0001', 1),
    ('Integrante 2 FTL V',  'CI0002', 'MAT0002', 1),
    ('Integrante 3 FTL V',  'CI0003', 'MAT0003', 1),
    ('Integrante 1 FTL F',  'CI0004', 'MAT0004', 2),
    ('Integrante 2 FTL F',  'CI0005', 'MAT0005', 2),
    ('Integrante 3 FTL F',  'CI0006', 'MAT0006', 2),
    ('Integrante 1 FTL B',  'CI0007', 'MAT0007', 3),
    ('Integrante 2 FTL B',  'CI0008', 'MAT0008', 3),
    ('Integrante 3 FTL B',  'CI0009', 'MAT0009', 3),
    ('Integrante 1 FTL A',  'CI0010', 'MAT0010', 4),
    ('Integrante 2 FTL A',  'CI0011', 'MAT0011', 4),
    ('Integrante 3 FTL A',  'CI0012', 'MAT0012', 4),
    ('Integrante 1 FTI V',  'CI0013', 'MAT0013', 5),
    ('Integrante 2 FTI V',  'CI0014', 'MAT0014', 5),
    ('Integrante 3 FTI V',  'CI0015', 'MAT0015', 5),
    ('Integrante 1 FTI F',  'CI0016', 'MAT0016', 6),
    ('Integrante 2 FTI F',  'CI0017', 'MAT0017', 6),
    ('Integrante 3 FTI F',  'CI0018', 'MAT0018', 6),
    ('Integrante 1 FTI B',  'CI0019', 'MAT0019', 7),
    ('Integrante 2 FTI B',  'CI0020', 'MAT0020', 7),
    ('Integrante 3 FTI B',  'CI0021', 'MAT0021', 7),
    ('Integrante 1 FTI A',  'CI0022', 'MAT0022', 8),
    ('Integrante 2 FTI A',  'CI0023', 'MAT0023', 8),
    ('Integrante 3 FTI A',  'CI0024', 'MAT0024', 8),
    ('Integrante 1 FC V',   'CI0025', 'MAT0025', 9),
    ('Integrante 2 FC V',   'CI0026', 'MAT0026', 9),
    ('Integrante 3 FC V',   'CI0027', 'MAT0027', 9),
    ('Integrante 1 FC F',   'CI0028', 'MAT0028', 10),
    ('Integrante 2 FC F',   'CI0029', 'MAT0029', 10),
    ('Integrante 3 FC F',   'CI0030', 'MAT0030', 10),
    ('Integrante 1 FC B',   'CI0031', 'MAT0031', 11),
    ('Integrante 2 FC B',   'CI0032', 'MAT0032', 11),
    ('Integrante 3 FC B',   'CI0033', 'MAT0033', 11),
    ('Integrante 1 FC A',   'CI0034', 'MAT0034', 12),
    ('Integrante 2 FC A',   'CI0035', 'MAT0035', 12),
    ('Integrante 3 FC A',   'CI0036', 'MAT0036', 12),
    ('Integrante 1 FTE V',  'CI0037', 'MAT0037', 13),
    ('Integrante 2 FTE V',  'CI0038', 'MAT0038', 13),
    ('Integrante 3 FTE V',  'CI0039', 'MAT0039', 13),
    ('Integrante 1 FTE F',  'CI0040', 'MAT0040', 14),
    ('Integrante 2 FTE F',  'CI0041', 'MAT0041', 14),
    ('Integrante 3 FTE F',  'CI0042', 'MAT0042', 14),
    ('Integrante 1 FTE B',  'CI0043', 'MAT0043', 15),
    ('Integrante 2 FTE B',  'CI0044', 'MAT0044', 15),
    ('Integrante 3 FTE B',  'CI0045', 'MAT0045', 15),
    ('Integrante 1 FTE A',  'CI0046', 'MAT0046', 16),
    ('Integrante 2 FTE A',  'CI0047', 'MAT0047', 16),
    ('Integrante 3 FTE A',  'CI0048', 'MAT0048', 16),
    ('Integrante 1 FIO V',  'CI0049', 'MAT0049', 17),
    ('Integrante 2 FIO V',  'CI0050', 'MAT0050', 17),
    ('Integrante 3 FIO V',  'CI0051', 'MAT0051', 17),
    ('Integrante 1 FIO F',  'CI0052', 'MAT0052', 18),
    ('Integrante 2 FIO F',  'CI0053', 'MAT0053', 18),
    ('Integrante 3 FIO F',  'CI0054', 'MAT0054', 18),
    ('Integrante 1 FIO B',  'CI0055', 'MAT0055', 19),
    ('Integrante 2 FIO B',  'CI0056', 'MAT0056', 19),
    ('Integrante 3 FIO B',  'CI0057', 'MAT0057', 19),
    ('Integrante 1 FIO A',  'CI0058', 'MAT0058', 20),
    ('Integrante 2 FIO A',  'CI0059', 'MAT0059', 20),
    ('Integrante 3 FIO A',  'CI0060', 'MAT0060', 20),
    ('Integrante 1 CITEC V','CI0061', 'MAT0061', 21),
    ('Integrante 2 CITEC V','CI0062', 'MAT0062', 21),
    ('Integrante 3 CITEC V','CI0063', 'MAT0063', 21),
    ('Integrante 1 CITEC F','CI0064', 'MAT0064', 22),
    ('Integrante 2 CITEC F','CI0065', 'MAT0065', 22),
    ('Integrante 3 CITEC F','CI0066', 'MAT0066', 22),
    ('Integrante 1 CITEC B','CI0067', 'MAT0067', 23),
    ('Integrante 2 CITEC B','CI0068', 'MAT0068', 23),
    ('Integrante 3 CITEC B','CI0069', 'MAT0069', 23),
    ('Integrante 1 CITEC A','CI0070', 'MAT0070', 24),
    ('Integrante 2 CITEC A','CI0071', 'MAT0071', 24),
    ('Integrante 3 CITEC A','CI0072', 'MAT0072', 24);

-- ============================================================
-- 6. SEED: eventos (4 eventos, 2026)
-- ============================================================
INSERT INTO eventos (deporte_id, equipo_local_id, equipo_visitante_id, fecha, hora, lugar, estado, probabilidad) VALUES
    (1, 1, 5,   '2026-02-05', '10:00', 'Cancha 1',  'proximo',    60),
    (2, 10, 14, '2026-03-12', '15:30', 'Cancha 2',  'proximo',    55),
    (3, 19, 23, '2026-04-20', '09:00', 'Campo 3',   'proximo',    50),
    (4, 4, 24,  '2026-05-08', '14:00', 'Sala',      'programado', 45);

-- ============================================================
-- 7. SEED: resultados (15 filas, posiciones 1-5, puntuaciones 1-10)
-- ============================================================
INSERT INTO resultados (equipo_id, posicion_lograda, puntuacion_final) VALUES
    (1, 1, 10),
    (1, 1, 10),
    (2, 3, 5),
    (5, 2, 7),
    (6, 1, 10),
    (6, 2, 7),
    (10, 1, 10),
    (11, 3, 5),
    (14, 2, 7),
    (16, 3, 5),
    (19, 2, 7),
    (20, 4, 3),
    (23, 4, 3),
    (24, 5, 1),
    (21, 3, 5);

-- ============================================================
-- 8. SEED: sanciones (7 sanciones, con observaciones)
-- ============================================================
INSERT INTO sanciones (equipo_id, puntos_descontados, motivo, observaciones) VALUES
    (1,  -2, 'Retraso en la cancha',   'Afectó al integrante 1 FTL V'),
    (6,  -5, 'Conducta antideportiva', 'Integrante 2 FTI F'),
    (10, -8, 'Amonestación múltiple',  'Integrantes 1 y 3 FC F'),
    (13, -5, 'Uniforme incorrecto',    'Integrante 1 FTE V'),
    (19, -3, 'Retraso',                'Integrante 2 FIO B'),
    (22, -12, 'Agresión',              'Integrante 1 CITEC F'),
    (24, -4, 'Uso de dispositivo no permitido', 'Integrante 3 CITEC A');
