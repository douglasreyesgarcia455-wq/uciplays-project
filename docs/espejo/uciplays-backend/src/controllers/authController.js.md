# Authcontroller

**Archivo fuente:** `uciplays-backend/src/controllers/authController.js`

## Propósito

Coordina inicio de sesión, cierre de sesión y consulta del usuario autenticado.

## Métodos o funciones detectadas

- `login`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `loginAdmin`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `loginPublic`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `logout`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `me`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Mensajes relevantes

- `../middleware/auditoriaHelper`
- `Credenciales incorrectas`
- `Error POST /auth/login:`
- `Error POST /auth/logout:`
- `Error al hacer logout`
- `Usuario y contraseña requeridos`

## Comunicación

Lee parámetros del request, llama al repositorio o servicio correspondiente y responde JSON o una descarga HTTP.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
