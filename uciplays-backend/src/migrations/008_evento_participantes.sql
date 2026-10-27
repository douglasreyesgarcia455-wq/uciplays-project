-- Migración 008: refactor a evento_participantes (N:M eventos-equipos)
-- Facultades se conserva. Eventos, resultados y sanciones se recrean.

DROP TABLE IF EXISTS resultados;
DROP TABLE IF EXISTS sanciones;
DROP TABLE IF EXISTS evento_participantes;
DROP TABLE IF EXISTS eventos;

CREATE TABLE eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deporte_id INTEGER NOT NULL,
    fecha TEXT,
    hora TEXT,
    lugar TEXT,
    estado TEXT DEFAULT 'pendiente',
    detalles TEXT DEFAULT '',
    FOREIGN KEY (deporte_id) REFERENCES deportes(id)
);

CREATE TABLE evento_participantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evento_id INTEGER NOT NULL,
    equipo_id INTEGER NOT NULL,
    posicion INTEGER,
    puntos INTEGER DEFAULT 0,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id),
    UNIQUE (evento_id, equipo_id)
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

-- Seed: 4 eventos EN CURSO (1v1 y triangular)
INSERT INTO eventos (deporte_id, fecha, hora, lugar, estado) VALUES
    (1, '2026-02-05', '10:00', 'Cancha 1', 'en curso'),
    (2, '2026-03-12', '15:30', 'Cancha 2', 'en curso'),
    (3, '2026-04-20', '09:00', 'Campo 3',  'en curso'),
    (4, '2026-05-08', '14:00', 'Sala',     'en curso');

-- Participantes sin posiciones (aún no hay resultado)
INSERT INTO evento_participantes (evento_id, equipo_id, posicion, puntos) VALUES
    (1, 1, NULL, 0), (1, 5, NULL, 0),
    (2, 10, NULL, 0), (2, 14, NULL, 0),
    (3, 19, NULL, 0), (3, 23, NULL, 0),
    (4, 4, NULL, 0), (4, 8, NULL, 0), (4, 12, NULL, 0);

-- Sanciones de prueba
INSERT INTO sanciones (equipo_id, puntos_descontados, motivo, observaciones) VALUES
    (1, -2, 'Retraso', 'Integrante 1 FTL V'),
    (6, -5, 'Conducta antideportiva', 'Integrante 2 FTI F'),
    (10, -8, 'Amonestación múltiple', 'Integrantes 1 y 3 FC F'),
    (13, -5, 'Uniforme incorrecto', 'Integrante 1 FTE V'),
    (19, -3, 'Retraso', 'Integrante 2 FIO B'),
    (22, -12, 'Agresión', 'Integrante 1 CITEC F'),
    (24, -4, 'Dispositivo no permitido', 'Integrante 3 CITEC A');
