-- Migración 001: agregar columna logo_url a la tabla facultades
-- Solo DDL, sin INSERT/UPDATE/DELETE de datos
ALTER TABLE facultades ADD COLUMN logo_url TEXT;