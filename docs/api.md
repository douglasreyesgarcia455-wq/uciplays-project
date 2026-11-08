# API de UCI Plays

Backend activo: `http://127.0.0.1:8000`.

Todas las rutas aceptan la variante con o sin `/` final. Las operaciones
administrativas requieren `Authorization: Bearer <JWT>` y rol `admin`.

## Rutas públicas

| Método | Ruta | Uso |
|---|---|---|
| `POST` | `/api/public/auth/login` | Iniciar sesión |
| `POST` | `/api/public/auth/logout` | Cerrar sesión |
| `GET` | `/api/public/auth/me` | Consultar usuario |
| `GET` | `/api/public/ranking` | Consultar ranking |
| `GET` | `/api/public/facultades` | Listar facultades |
| `GET` | `/api/public/facultades/:id` | Consultar una facultad |
| `GET` | `/api/public/eventos` | Listar eventos |
| `GET` | `/api/public/eventos/:id` | Consultar un evento |
| `GET` | `/api/public/sanciones` | Listar sanciones |
| `GET` | `/api/public/integrantes` | Listar integrantes |
| `GET` | `/api/public/integrantes/:equipo_id` | Integrantes de un equipo |
| `GET` | `/api/public/deportes` | Listar deportes |
| `GET` | `/api/public/equipos` | Listar equipos |

## Rutas administrativas

| Recurso | Lectura | Escritura |
|---|---|---|
| `eventos` | `GET /api/admin/eventos` | `POST`, `PUT`, `DELETE`, iniciar y resultado |
| `facultades` | `GET /api/admin/facultades` | `POST`, `PUT`, `DELETE` |
| `deportes` | `GET /api/admin/deportes` | `POST`, `PUT`, `DELETE` |
| `equipos` | `GET /api/admin/equipos` | `POST`, `PUT`, `DELETE` |
| `integrantes` | `GET /api/admin/integrantes` | `POST`, `PUT`, `DELETE` |
| `sanciones` | `GET /api/admin/sanciones` | `POST`, `DELETE` |
| `autenticación` | `GET /api/admin/auth/me` | `POST login/logout` |
| `sistema` | `GET /api/admin/auditoria` | Consulta |

## Errores

- `400`: datos incompletos o inválidos.
- `401`: falta el token o es inválido.
- `403`: el usuario no tiene permisos.
- `404`: recurso inexistente.
- `409`: conflicto con una regla de negocio.
- `500`: error inesperado.

## Frontend

El frontend activo está en `proyecto-jump-frontend/JUMP (2)/JUMP/Project/`.
Usa las rutas públicas para lecturas y las administrativas para crear, editar
y eliminar facultades, deportes, equipos, integrantes, eventos y sanciones.
