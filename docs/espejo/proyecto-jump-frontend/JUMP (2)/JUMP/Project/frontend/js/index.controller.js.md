# Index Controller

**Archivo fuente:** `proyecto-jump-frontend/JUMP (2)/JUMP/Project/frontend/js/index.controller.js`

## Propósito

Módulo del frontend que prepara datos, eventos de interfaz o llamadas a la API.

## Métodos o funciones detectadas

- `fmtCorta`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `fmtLarga`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `logoDe`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `mainEvento`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `parseFecha`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Mensajes relevantes

- `[index.controller] Error inesperado:`

## Comunicación

Se comunica con otros módulos mediante objetos `window.*` y, cuando corresponde, con `window.apiClient`.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
