-- Migración 009: eliminar tabla resultados (huérfana, 0 filas, reemplazada por evento_participantes)
DROP TABLE IF EXISTS resultados;
