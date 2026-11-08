# Admin Sistema

**Archivo fuente:** `proyecto-jump-frontend/JUMP (2)/JUMP/Project/frontend/js/admin.sistema.js`

## Propósito

Módulo del frontend que prepara datos, eventos de interfaz o llamadas a la API.

## Métodos o funciones detectadas

- `descargarBackup`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `enlazar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `init`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `recargarAuditoria`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `renderAuditoria`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Rutas HTTP declaradas

| Método lógico | Ruta |
|---|---|
| Según `router` o `app` | `/admin/auditoria?limite=100` |

## Mensajes relevantes

- `/api/admin/backup`
- `>Sin registros de auditoría.</td></tr>`
- `Error al descargar backup: `
- `Error cargando auditoría:`
- `uciplays-backup-`

## Comunicación

Se comunica con otros módulos mediante objetos `window.*` y, cuando corresponde, con `window.apiClient`.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
