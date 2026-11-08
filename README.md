# UCI Plays

Sistema de gestión deportiva con backend Django, PostgreSQL y frontend HTML/CSS/JavaScript.

## Estructura

```text
uciplays-project/
├── uciplays-django/          # Backend activo Django + PostgreSQL
│   └── core/
│       ├── modelo/           # Modelos del dominio
│       ├── vista/            # Vistas y clases controladoras
│       └── plantilla/        # Formularios de presentación
├── proyecto-jump-frontend/   # Frontend estático activo
└── docs/                     # Documentación
```

El backend Node/Express antiguo se conserva como respaldo fuera del repositorio:
`/home/lawija/Documentos/uciplays-backend`.

## Ejecución

### Backend Django

```bash
cd uciplays-django
.venv/bin/python manage.py migrate
.venv/bin/python manage.py runserver 127.0.0.1:8000
```

### Frontend estático

```bash
cd "proyecto-jump-frontend/JUMP (2)/JUMP/Project"
python3 -m http.server 5500
```

Abrir `http://127.0.0.1:5500/jump/frontend/html/index.html`.
El frontend consume las APIs de Django mediante `http://127.0.0.1:8000/api`.

## Base de datos y dependencias

- PostgreSQL es la base de datos activa de Django.
- No se migraron los datos completos de SQLite; únicamente facultades y logos.
- Los IDs se generan automáticamente mediante `BigAutoField`.
- Las imágenes están en `uciplays-django/img/` y en la carpeta `img` del frontend.
- El backend Node antiguo y sus dependencias están en `/home/lawija/Documentos/`.
- `/home/lawija/Documentos/node_modules` no es necesario para ejecutar Django ni el frontend estático.

## API

- Consultas públicas: `/api/public/...`
- Operaciones administrativas: `/api/admin/...`
- Login administrativo: `/api/admin/auth/login`
- Las operaciones administrativas requieren `Authorization: Bearer <JWT>`.

Consulta [`docs/`](./docs/) para arquitectura, flujos y endpoints completos.
