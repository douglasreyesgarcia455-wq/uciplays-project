# Auth Api

**Archivo fuente:** `proyecto-jump-frontend/JUMP (2)/JUMP/Project/frontend/js/auth.api.js`

## Propósito

Gestiona la sesión del administrador en localStorage y conecta el token con el cliente HTTP.

## Métodos o funciones detectadas

- `getToken`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `getUser`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `isLoggedIn`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `login`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `logout`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `setSession`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Rutas HTTP declaradas

| Método lógico | Ruta |
|---|---|
| Según `router` o `app` | `/admin/auth/login` |
| Según `router` o `app` | `/admin/auth/logout` |

## Mensajes relevantes

- `/admin/auth/login`
- `/admin/auth/logout`

## Comunicación

Se comunica con otros módulos mediante objetos `window.*` y, cuando corresponde, con `window.apiClient`.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
