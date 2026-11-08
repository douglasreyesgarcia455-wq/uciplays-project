# Deportes Routes

**Archivo fuente:** `uciplays-backend/src/routes/deportes.routes.js`

## Propósito

Router Express que conecta URLs HTTP con controladores y middleware.

## Métodos o funciones detectadas

Este archivo principalmente declara rutas, objetos de configuración o inicialización; no define funciones con nombre propio.

## Rutas HTTP declaradas

| Método lógico | Ruta |
|---|---|
| Según `router` o `app` | `/` |
| Según `router` o `app` | `/:id` |

## Comunicación

Recibe la petición, ejecuta el middleware indicado y delega el trabajo al controlador. No debería contener consultas SQL.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
