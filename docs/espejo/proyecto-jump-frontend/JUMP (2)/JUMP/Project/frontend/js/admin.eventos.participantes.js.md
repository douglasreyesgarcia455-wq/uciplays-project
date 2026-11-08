# Admin Eventos Participantes

**Archivo fuente:** `proyecto-jump-frontend/JUMP (2)/JUMP/Project/frontend/js/admin.eventos.participantes.js`

## Propósito

Módulo del frontend que prepara datos, eventos de interfaz o llamadas a la API.

## Métodos o funciones detectadas

- `actualizar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `actualizarOpciones`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `agregarFila`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `enlazar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `equiposDelDeporte`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `init`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `leerIds`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `limpiar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `poblarDeporte`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Comunicación

Se comunica con otros módulos mediante objetos `window.*` y, cuando corresponde, con `window.apiClient`.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
