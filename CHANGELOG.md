# Changelog

## Unreleased

### Fase 0: inicialización del repositorio
- Creación del repositorio base `uciplays-project`.
- Agregado `.gitignore`, `.editorconfig`, `README.md`, `CHANGELOG.md`.
- Estructura inicial: backend, frontend viejo (React), frontend nuevo estático.
- `.gitignore` ignora `node_modules`, builds, `.env`, bases de datos SQLite, logs y archivos del sistema.
- Los logos del frontend nuevo (`Project/assets/**/*.png`) se versionan; las capturas sueltas en `JUMP (2)/JUMP/*.png` no.
- chore: eliminada BD duplicada obsoleta uciplays.db (subconjunto estricto de database.sqlite, sin tablas exclusivas ni datos únicos; nunca estuvo versionada por *.db en .gitignore).
- feat(backend): migración idempotente 001 logo_url en facultades + tabla schema_migrations (commit 0dc1be3).
- feat(backend): estructura Repository + DTO + Controller delgado + Router para facultades; endpoints GET /api/facultades y GET /api/facultades/:id (commits 373ee8a, b7bb7fc, a34a499).
- docs: /api/auth/login es endpoint huérfano preexistente (auth.routes.js define POST /login con body {username, password}, pero nunca estuvo montado en index.js ni en main). No afecta funcionalidad; el frontend viejo valida credenciales en cliente vía localStorage. Se evaluará montarlo cuando el frontend nuevo requiera auth real.