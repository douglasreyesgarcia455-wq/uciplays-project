# Flujos principales

## Inicio de sesión administrativo

La pantalla de login envía usuario y contraseña a
`/api/admin/auth/login`. Django comprueba la cuenta y devuelve un JWT.
El frontend conserva el token y lo envía como `Authorization: Bearer <JWT>`.

## Carga de la cartelera pública

La cartelera consulta `/api/public/eventos` y puede filtrar por `estado`.
Django devuelve los eventos y sus participantes; el frontend los transforma
en tarjetas visibles.

## Crear un evento

1. El administrador llena deporte, fecha, hora, lugar y participantes.
2. El frontend valida los campos obligatorios.
3. Envía un `POST` a `/api/admin/eventos`.
4. `EventoApiView` verifica el token y delega en `EventoService`.
5. El servicio valida las reglas y persiste en PostgreSQL.
6. El frontend recarga la información.

## Registrar un resultado

El panel envía los resultados a
`/api/admin/eventos/:id/resultado`. Django actualiza el evento y sus puntos;
después el frontend recarga el ranking.

## Auditoría y respaldo

- Auditoría: `/api/admin/auditoria?limite=100`.
- PostgreSQL es la base activa de Django.
- El backend Node/SQLite antiguo se conserva en
  `/home/lawija/Documentos/uciplays-backend` como respaldo.
