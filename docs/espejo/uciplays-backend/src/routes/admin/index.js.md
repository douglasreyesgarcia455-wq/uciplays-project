# Rutas administrativas

**Archivo fuente:** `uciplays-backend/src/routes/admin/index.js`

## Propósito

Define el paquete que se monta bajo `/api/admin`. Su función es conectar cada URL administrativa con su controlador y aplicar seguridad antes de que la operación llegue a la lógica de negocio.

## Métodos o funciones detectadas

No contiene SQL ni reglas de negocio. Declara el middleware común `verificarToken` + `verificarRol(['admin'])` y después registra las rutas de autenticación, recursos y sistema.

## Seguridad

- `POST /auth/login` es la única ruta administrativa sin token previo; el controlador solo acepta cuentas con rol `admin`.
- `POST /auth/logout` y `GET /auth/me` requieren sesión administrativa.
- Cada router de recurso aplica `verificarToken` y `verificarRol(['admin'])` antes de sus métodos `GET`, `POST`, `PUT` o `DELETE`.

## Rutas HTTP declaradas

| Método lógico | Ruta |
|---|---|
| `GET` | `/auditoria` |
| `POST` | `/auth/login` |
| `POST` | `/auth/logout` |
| `GET` | `/auth/me` |
| `GET` | `/backup` |

## Comunicación

Recibe la petición, ejecuta el middleware indicado y delega el trabajo a `authController`, `adminController` o a los controladores de cada recurso. El prefijo `/api/admin` lo añade `index.js` del backend.

## Permisos y errores

Las rutas bajo `/api/admin` requieren JWT válido y rol `admin`. Las rutas públicas de lectura no requieren autenticación. Los errores HTTP esperados son 400 para datos inválidos, 401 para sesión inválida, 403 para permisos insuficientes, 404 para recursos inexistentes y 500 para fallos inesperados.
