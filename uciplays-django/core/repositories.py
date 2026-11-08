from django.db.models import Count

from .models import Equipo, Facultad


class FacultadRepository:
    """Gateway de persistencia para facultades (GRASP: Pure Fabrication)."""

    def listar(self):
        return Facultad.objects.annotate(total_equipos=Count("equipo")).order_by(
            "nombre"
        )

    def obtener(self, facultad_id):
        return Facultad.objects.filter(pk=facultad_id).first()

    def existe_nombre(self, nombre, excluir_id=None):
        query = Facultad.objects.filter(nombre__iexact=nombre)
        if excluir_id is not None:
            query = query.exclude(pk=excluir_id)
        return query.exists()

    def crear(self, nombre, logo_url=""):
        return Facultad.objects.create(nombre=nombre, logo_url=logo_url or "")

    def guardar(self, facultad, nombre, logo_url=""):
        facultad.nombre = nombre
        facultad.logo_url = logo_url or ""
        facultad.save(update_fields=["nombre", "logo_url"])
        return facultad

    def contar_equipos(self, facultad_id):
        return Equipo.objects.filter(facultad_id=facultad_id).count()

    def borrar(self, facultad):
        facultad.delete()
