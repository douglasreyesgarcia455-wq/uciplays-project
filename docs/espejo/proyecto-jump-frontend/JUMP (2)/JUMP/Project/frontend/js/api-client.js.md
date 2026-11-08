# Api Client

**Archivo fuente:** `proyecto-jump-frontend/JUMP (2)/JUMP/Project/frontend/js/api-client.js`

## Propósito

Fachada HTTP única del frontend. Añade el token, ejecuta solicitudes y transforma respuestas HTTP fallidas en errores.

## Métodos o funciones detectadas

- `_tokenProvider`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `del`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `get`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `getHeaders`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `manejar401`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `post`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `put`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `setTokenProvider`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Comunicación

Se comunica con otros módulos mediante objetos `window.*` y, cuando corresponde, con `window.apiClient`.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
