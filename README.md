# UCI Plays

Proyecto de software con backend y dos frontends:

- **Backend**: Node.js + Express + SQLite (casi intacto; único cambio permitido: agregar imágenes/logos estáticos).
- **Frontend viejo** (`uciplays-frontend/`): React 19 + Vite + Tailwind + React Router. Congelado salvo un enlace en la Navbar para integrar el nuevo.
- **Frontend nuevo** (`proyecto-jump-frontend/JUMP (2)/JUMP/Project/`): HTML/CSS/JS estático (sin build, sin framework). Se sirve bajo `/jump` a través del backend.

## Estructura de carpetas

```
uciplays-project/
├── uciplays-backend/         # Node.js, Express, SQLite
├── uciplays-frontend/        # React + Vite (frontend viejo)
└── proyecto-jump-frontend/   # Contiene el frontend nuevo estático
    └── JUMP (2)/JUMP/Project/
        ├── assets/           # Logos y favicon (versionados)
        ├── backend/js/       # JS cliente del nuevo (cartelera, estadísticas, etc.)
        └── frontend/
            ├── css/
            └── html/
```

## Cómo correr cada parte

### Backend
```bash
cd uciplays-backend
npm install   # solo si no existe node_modules
node index.js
# Servidor en http://localhost:4000
# Endpoints: /api/eventos, /api/ranking, /api/resultados, /api/auth/login
# Estáticos: http://localhost:4000/jump/ (frontend nuevo) y /assets/ (logos)
```

### Frontend viejo (React)
```bash
cd uciplays-frontend
npm install
npm run dev   # http://localhost:5173 (por defecto Vite)
```

### Frontend nuevo (estático)
Servido por el backend bajo:
```
http://localhost:4000/jump/index.html
http://localhost:4000/jump/cartelera.html
http://localhost:4000/jump/ranking.html
http://localhost:4000/jump/estadisticas.html
```

## Nota sobre bases de datos

- `uciplays-backend/database.sqlite`: base de datos activa usada por el backend.
- `uciplays-backend/uciplays.db`: duplicada obsoleta. Se comparará con `database.sqlite`; si está vacía o idéntica se eliminará, si tiene datos distintos se apartará como backup externo. No se versiona ninguna de las dos (`.gitignore` ignora `*.sqlite` y `*.db`).

## Reglas de integración

- Backend: no se altera lógica existente. Solo se agregan archivos estáticos y endpoints de facultades (`GET /api/facultades`, `GET /api/facultades/:id`).
- Frontend viejo: congelado. Se agrega un único enlace en `Navbar.jsx` apuntando al frontend nuevo.
- Autenticación: no compartida. Cada frontend maneja su propio acceso de forma independiente.