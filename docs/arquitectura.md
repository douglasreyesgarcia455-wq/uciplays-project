# Arquitectura explicada

UCI Plays utiliza un estilo cliente-servidor y una arquitectura por capas.

## Vista general

```text
Usuario o administrador
        |
        v
Frontend HTML/CSS/JavaScript
        |
        | HTTP + JSON
        v
Backend Django
        |
        +--> URLs y vistas: seleccionan el endpoint
        +--> Autenticación: valida JWT y rol administrativo
        +--> Servicios: aplican reglas de negocio
        +--> Repositorios: encapsulan el acceso a datos
        +--> Serializadores: normalizan las respuestas
        v
Base de datos PostgreSQL
```

## Paquetes públicos y administrativos

- `/api/public`: consultas públicas y autenticación de sesión.
- `/api/admin`: operaciones del panel; requieren token y rol `admin`, salvo el login.

## Capas del backend

| Capa | Responsabilidad |
|---|---|
| `core/urls.py` | Declarar URLs y vistas |
| `core/vista/views_*.py` | Coordinar peticiones y respuestas HTTP |
| `core/services_*.py` | Aplicar validaciones y reglas del negocio |
| `core/repositories*.py` | Encapsular consultas y persistencia |
| `core/serializers*.py` | Convertir modelos a JSON estable |
| `core/authentication.py` | Verificar JWT y rol `admin` |
| `core/migrations/` | Crear o modificar tablas PostgreSQL |

## Paquetes explícitos MVT

- `core/modelo/models.py`: modelos del dominio.
- `core/vista/views_*.py`: clases controladoras organizadas por recurso.
- `core/vista/sp_vistas.py`: punto de entrada explícito de las clases controladoras.
- `core/plantilla/forms*.py`: formularios organizados por recurso.
- `core/plantilla/fr_plantilla.py`: punto de entrada explícito de los formularios.
- `templates/core/`: archivos HTML de plantilla.

Los módulos `sp_` y `fr_` funcionan como puntos de entrada del paquete; las
implementaciones reales permanecen dentro de `vista/` y `plantilla/`.

## Flujo de una consulta pública

1. El frontend solicita `/api/public/eventos`.
2. Django encuentra la URL pública.
3. La vista pide los datos al servicio.
4. El servicio usa el repositorio y los modelos Django.
5. El serializador forma la respuesta JSON.
6. La vista responde al frontend.

## Flujo de una operación administrativa

1. El administrador inicia sesión en `/api/admin/auth/login`.
2. Django devuelve un JWT.
3. El frontend lo envía como `Authorization: Bearer <JWT>`.
4. La autenticación valida token y rol.
5. La vista delega en el servicio.
6. El servicio valida y persiste el cambio en PostgreSQL.
7. El frontend muestra el resultado y recarga los datos.
