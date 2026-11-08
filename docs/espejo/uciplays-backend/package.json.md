# Configuración del backend

**Archivo fuente:** `uciplays-backend/package.json`

## Propósito

Describe el paquete Node.js del servidor.

## Dependencias principales

- `express`: servidor HTTP y sistema de rutas.
- `sqlite3`: conexión con la base de datos.
- `jsonwebtoken`: creación y validación de tokens.
- `bcryptjs`: comparación de contraseñas cifradas.
- `cors`: permite solicitudes desde el frontend.
- `dotenv`: carga variables como `JWT_SECRET`.
- `morgan`: soporte para registro de solicitudes cuando se usa.

## Comandos

- `npm run migrate`: ejecuta las migraciones SQL pendientes.
- `npm test`: actualmente es un placeholder y no ejecuta pruebas reales.
- `node index.js`: inicia el servidor en el puerto 4000.
