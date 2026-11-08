# Sancionescontroller

**Archivo fuente:** `uciplays-backend/src/controllers/sancionesController.js`

## Propósito

Controlador HTTP que recibe peticiones, coordina la lógica y devuelve respuestas.

## Métodos o funciones detectadas

- `borrar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `crear`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `listar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Mensajes relevantes

- `../middleware/auditoriaHelper`
- `equipo_id requerido`

## Comunicación

Lee parámetros del request, llama al repositorio o servicio correspondiente y responde JSON o una descarga HTTP.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
