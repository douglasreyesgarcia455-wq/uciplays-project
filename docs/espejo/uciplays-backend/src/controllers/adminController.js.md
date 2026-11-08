# Admincontroller

**Archivo fuente:** `uciplays-backend/src/controllers/adminController.js`

## Propósito

Expone operaciones administrativas del sistema: auditoría y descarga de respaldo de la base de datos.

## Métodos o funciones detectadas

- `auditoria`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `backup`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Mensajes relevantes

- `Error GET /admin/auditoria:`
- `Error GET /admin/backup:`
- `Error al generar backup`
- `Error al obtener auditoría`
- `SELECT * FROM auditoria ORDER BY fecha DESC LIMIT ?`

## Comunicación

Lee parámetros del request, llama al repositorio o servicio correspondiente y responde JSON o una descarga HTTP.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
