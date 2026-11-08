# Eventos Api

**Archivo fuente:** `proyecto-jump-frontend/JUMP (2)/JUMP/Project/frontend/js/eventos.api.js`

## Propósito

Construye filtros y consulta los eventos públicos.

## Métodos o funciones detectadas

- `getEventos`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Rutas HTTP declaradas

| Método lógico | Ruta |
|---|---|
| Según `router` o `app` | `/public/eventos` |

## Comunicación

Se comunica con otros módulos mediante objetos `window.*` y, cuando corresponde, con `window.apiClient`.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
