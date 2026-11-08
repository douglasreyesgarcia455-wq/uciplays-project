from django.core.exceptions import ValidationError
from django.db import transaction

from .repositories import FacultadRepository


class FacultadService:
    """Casos de uso de facultades (GRASP: Controller)."""

    def __init__(self, repository=None):
        self.repository = repository or FacultadRepository()

    def listar(self):
        return self.repository.listar()

    def obtener(self, facultad_id):
        return self.repository.obtener(facultad_id)

    def crear(self, *, nombre, logo_url=""):
        nombre = nombre.strip()
        self._validar_nombre(nombre)
        if self.repository.existe_nombre(nombre):
            raise ValidationError("Ya existe una facultad con ese nombre.")
        return self.repository.crear(nombre, logo_url)

    def actualizar(self, facultad_id, *, nombre, logo_url=""):
        nombre = nombre.strip()
        self._validar_nombre(nombre)
        if self.repository.existe_nombre(nombre, excluir_id=facultad_id):
            raise ValidationError("Ya existe otra facultad con ese nombre.")
        facultad = self._require(facultad_id)
        return self.repository.guardar(facultad, nombre, logo_url)

    @transaction.atomic
    def borrar(self, facultad_id, *, cascade=False):
        facultad = self._require(facultad_id)
        total_equipos = self.repository.contar_equipos(facultad_id)
        if total_equipos and not cascade:
            raise ValidationError(
                f"La facultad tiene {total_equipos} equipos. "
                "Confirma cascade para eliminarla."
            )
        if total_equipos:
            facultad.equipo_set.all().delete()
        self.repository.borrar(facultad)
        return cascade

    @staticmethod
    def _validar_nombre(nombre):
        if len(nombre) < 2:
            raise ValidationError(
                "El nombre debe tener al menos 2 caracteres."
            )

    def _require(self, facultad_id):
        facultad = self.repository.obtener(facultad_id)
        if facultad is None:
            raise ValidationError("Facultad no encontrada.")
        return facultad
