# 006 Usuarios

**Archivo fuente:** `uciplays-backend/src/migrations/006_usuarios.sql`

## Propósito

Migración de base de datos. Se ejecuta una sola vez mediante el gestor de migraciones.

## Cambios realizados

- Crea o modifica la tabla `usuarios`.

## Ejecución

El archivo es leído por `src/migrations/runMigrations.js`, que registra la versión aplicada para evitar ejecutarlo dos veces.
