# Rankingrepository

**Archivo fuente:** `uciplays-backend/src/repositories/rankingRepository.js`

## Propósito

Repositorio de persistencia que encapsula consultas a SQLite.

## Métodos o funciones detectadas

- `obtenerRanking`: función del módulo; revisar su flujo en el controlador, cliente o utilidad correspondiente.

## Comunicación

Es la frontera con SQLite: recibe datos preparados por el controlador y devuelve filas o resultados de escritura.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
