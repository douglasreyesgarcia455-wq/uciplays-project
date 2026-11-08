# Eventosrepository

**Archivo fuente:** `uciplays-backend/src/repositories/eventosRepository.js`

## Propósito

Repositorio de persistencia que encapsula consultas a SQLite.

## Métodos o funciones detectadas

- `actualizar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `borrar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `crear`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `iniciar`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `obtenerParticipantes`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `obtenerPorId`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `obtenerTodos`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `puntosPorPosicion`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.
- `registrarResultado`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Comunicación

Es la frontera con SQLite: recibe datos preparados por el controlador y devuelve filas o resultados de escritura.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
