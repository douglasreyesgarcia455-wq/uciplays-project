# Auditoriahelper

**Archivo fuente:** `uciplays-backend/src/middleware/auditoriaHelper.js`

## Propósito

Registra acciones relevantes del usuario autenticado en la tabla de auditoría.

## Métodos o funciones detectadas

- `registrarAuditoria`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Mensajes relevantes

- `Error registrando auditoría:`
- `INSERT INTO auditoria (usuario_id, username, accion, entidad, entidad_id, detalles, ip) VALUES (?, ?, ?, ?, ?, ?, ?)`

## Comunicación

Su relación concreta se encuentra en la guía de arquitectura y en el índice de archivos.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
