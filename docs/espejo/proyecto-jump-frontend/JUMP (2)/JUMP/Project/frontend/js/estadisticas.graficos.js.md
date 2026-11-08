# Estadisticas Graficos

**Archivo fuente:** `proyecto-jump-frontend/JUMP (2)/JUMP/Project/frontend/js/estadisticas.graficos.js`

## Propósito

Módulo del frontend que prepara datos, eventos de interfaz o llamadas a la API.

## Métodos o funciones detectadas

- `colorPara`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `destruir`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `renderDesglose`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `renderDisciplina`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `renderEficiencia`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `renderH2H`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `renderLogistica`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `renderTodos`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Comunicación

Se comunica con otros módulos mediante objetos `window.*` y, cuando corresponde, con `window.apiClient`.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
