# Admin Controller

**Archivo fuente:** `proyecto-jump-frontend/JUMP (2)/JUMP/Project/frontend/js/admin.controller.js`

## Propósito

Coordina la carga inicial del panel administrativo y comunica los módulos de gestión.

## Métodos o funciones detectadas

- `cargarTodo`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `mostrarLogin`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `ocultarLogin`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Mensajes relevantes

- `; $loginError.textContent = `
- `Credenciales incorrectas`
- `Respuesta inválida`

## Comunicación

Se comunica con otros módulos mediante objetos `window.*` y, cuando corresponde, con `window.apiClient`.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
