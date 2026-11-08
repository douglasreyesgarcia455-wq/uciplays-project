# UCI Plays Django

Este backend es la migración progresiva de Express/SQLite a Django/PostgreSQL.
El backend Node actual se conserva mientras se migran y prueban los endpoints.

## Preparación

```bash
cd uciplays-django
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Configura en `.env` las credenciales de PostgreSQL. Luego crea la base `uciplays`
con PostgreSQL y ejecuta:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 8000
```

La vista inicial estará disponible en `http://localhost:8000/` y el panel en
`http://localhost:8000/admin/`.
