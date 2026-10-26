# Changelog

## Unreleased

### Fase 0: inicialización del repositorio
- Creación del repositorio base `uciplays-project`.
- Agregado `.gitignore`, `.editorconfig`, `README.md`, `CHANGELOG.md`.
- Estructura inicial: backend, frontend viejo (React), frontend nuevo estático.
- `.gitignore` ignora `node_modules`, builds, `.env`, bases de datos SQLite, logs y archivos del sistema.
- Los logos del frontend nuevo (`Project/assets/**/*.png`) se versionan; las capturas sueltas en `JUMP (2)/JUMP/*.png` no.
- chore: eliminada BD duplicada obsoleta uciplays.db (subconjunto estricto de database.sqlite, sin tablas exclusivas ni datos únicos; nunca estuvo versionada por *.db en .gitignore).