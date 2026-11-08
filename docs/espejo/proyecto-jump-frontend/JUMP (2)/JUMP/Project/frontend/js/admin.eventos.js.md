# Admin Eventos

**Archivo fuente:** `proyecto-jump-frontend/JUMP (2)/JUMP/Project/frontend/js/admin.eventos.js`

## Propósito

Módulo del frontend que prepara datos, eventos de interfaz o llamadas a la API.

## Métodos o funciones detectadas

- `actualizar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `borrar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `crear`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `editar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `enlazarBotones`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `iniciar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `init`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `initPaginado`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `obtenerEventos`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `onRender`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `pintarItems`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `renderLista`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `validar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Rutas HTTP declaradas

| Método lógico | Ruta |
|---|---|
| Según `router` o `app` | `/admin/deportes` |
| Según `router` o `app` | `/admin/eventos` |
| Según `router` o `app` | `/admin/eventos/` |

## Mensajes relevantes

- ` + (e.data?.error || e.message), `
- `Evento actualizado correctamente`
- `Evento creado correctamente`
- `Evento eliminado correctamente`

## Comunicación

Se comunica con otros módulos mediante objetos `window.*` y, cuando corresponde, con `window.apiClient`.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
