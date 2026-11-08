# Db

**Archivo fuente:** `uciplays-backend/src/config/db.js`

## Propósito

Módulo del sistema documentado según su función dentro de la arquitectura.

## Métodos o funciones detectadas

Este archivo principalmente declara rutas, objetos de configuración o inicialización; no define funciones con nombre propio.

## Comunicación

Su relación concreta se encuentra en la guía de arquitectura y en el índice de archivos.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
