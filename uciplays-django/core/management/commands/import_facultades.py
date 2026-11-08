import sqlite3
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import connection, transaction

from core.models import Facultad


class Command(BaseCommand):
    help = "Importa únicamente facultades y logo_url desde la base SQLite."

    def add_arguments(self, parser):
        parser.add_argument(
            "--source",
            type=Path,
            default=Path("../uciplays-backend/database.sqlite"),
        )

    def handle(self, *args, **options):
        source = options["source"].resolve()
        if not source.is_file():
            raise CommandError(f"No existe la base SQLite: {source}")
        if Facultad.objects.exists():
            raise CommandError(
                "PostgreSQL ya contiene facultades; no se sobrescribieron registros."
            )

        with sqlite3.connect(source) as sqlite:
            rows = sqlite.execute(
                """
                SELECT id, nombre, COALESCE(logo_url, '')
                FROM facultades
                ORDER BY id
                """
            ).fetchall()

        with transaction.atomic():
            Facultad.objects.bulk_create(
                [
                    Facultad(id=faculty_id, nombre=nombre, logo_url=logo_url)
                    for faculty_id, nombre, logo_url in rows
                ]
            )
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT setval(
                        pg_get_serial_sequence('facultades', 'id'),
                        (SELECT MAX(id) FROM facultades),
                        true
                    )
                    """
                )

        self.stdout.write(
            self.style.SUCCESS(f"Facultades importadas: {len(rows)}")
        )
