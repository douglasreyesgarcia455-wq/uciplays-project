# Rutas públicas

**Archivo fuente:** `uciplays-backend/src/routes/public/index.js`

## Propósito

Define el paquete que se monta bajo `/api/public`. Ofrece autenticación y operaciones de lectura para visitantes. No declara operaciones de escritura sobre eventos, facultades, equipos, integrantes, deportes ni sanciones.

## Métodos o funciones detectadas

No contiene SQL ni reglas de negocio. Cada ruta delega al controlador del recurso correspondiente.

## Rutas de autenticación

- `POST /auth/login`: busca una cuenta, comprueba contraseña y devuelve JWT.
- `POST /auth/logout`: requiere JWT y registra el cierre de sesión.
- `GET /auth/me`: requiere JWT y devuelve la identidad contenida en el token.

## Recursos de lectura

Expone `GET` para ranking, facultades, eventos, sanciones, integrantes, deportes y equipos. Las rutas con `:id` o `:equipo_id` sirven para consultar un recurso concreto o los integrantes de un equipo.

## Rutas HTTP declaradas

| Método | Ruta |
|---|---|
| `POST` | `/auth/login` |
| `POST` | `/auth/logout` |
| `GET` | `/auth/me` |

## Comunicación

La ruta recibe la petición y delega directamente al controlador correspondiente. El prefijo `/api/public` lo añade `index.js` del backend.

## Permisos

Las consultas públicas no requieren token. Logout y `/auth/me` sí requieren un JWT válido. La modificación de datos se encuentra exclusivamente en el paquete administrativo.
