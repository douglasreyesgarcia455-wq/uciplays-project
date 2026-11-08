# Documentación de UCI Plays

Esta carpeta explica el sistema sin exigir leer primero el código fuente.

## Para empezar

1. Leer [la arquitectura](./arquitectura.md).
2. Leer [los flujos principales](./flujos-principales.md).
3. Consultar [la API](./api.md) para conocer las rutas.
4. Abrir la documentación del archivo concreto desde [el índice de archivos](./indice-archivos.md).

## Entorno actual

- Backend activo: Django + PostgreSQL en `http://127.0.0.1:8000`.
- Frontend activo: `proyecto-jump-frontend/JUMP (2)/JUMP/Project/`.
- Backend Node/SQLite: respaldo externo en `/home/lawija/Documentos/uciplays-backend`.

## Qué significa “espejo”

La carpeta `docs/espejo/` conserva la misma organización relativa de los módulos importantes del backend y del frontend. En lugar de copiar el código, cada archivo `.md` explica:

- Para qué existe el archivo.
- Qué métodos o funciones ofrece.
- Qué datos recibe y devuelve.
- Qué mensajes de éxito o error pueden aparecer.
- Qué permisos necesita.
- Con qué otros módulos se comunica.

No se documentan como archivos individuales las bases de datos, imágenes, ZIP, cachés ni copias `.bak`. Estos recursos se describen en la documentación del módulo que los utiliza.

## Regla para mantener esta documentación

Cada cambio de comportamiento debe actualizar la página Markdown del módulo afectado y, si cambia una ruta o permiso, también [api.md](./api.md).
