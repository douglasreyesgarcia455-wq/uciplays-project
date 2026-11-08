# Cartelera Controller

**Archivo fuente:** `proyecto-jump-frontend/JUMP (2)/JUMP/Project/frontend/js/cartelera.controller.js`

## Propósito

Módulo del frontend que prepara datos, eventos de interfaz o llamadas a la API.

## Métodos o funciones detectadas

Este archivo principalmente declara rutas, objetos de configuración o inicialización; no define funciones con nombre propio.

## Mensajes relevantes

- `[cartelera.controller] Error:`
- `calendario__error`

## Comunicación

Se comunica con otros módulos mediante objetos `window.*` y, cuando corresponde, con `window.apiClient`.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
