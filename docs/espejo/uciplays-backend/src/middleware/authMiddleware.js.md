# Authmiddleware

**Archivo fuente:** `uciplays-backend/src/middleware/authMiddleware.js`

## Propósito

Valida JWT y comprueba que el rol del usuario esté permitido antes de continuar.

## Métodos o funciones detectadas

- `verificarRol`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `verificarToken`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Comunicación

Su relación concreta se encuentra en la guía de arquitectura y en el índice de archivos.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
