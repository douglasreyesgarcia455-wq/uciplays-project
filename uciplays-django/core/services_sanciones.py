from django.core.exceptions import ValidationError

from .models import Equipo
from .repositories_ranking import SancionRepository


class SancionService:
    def __init__(self, repository=None):
        self.repository = repository or SancionRepository()

    def listar(self):
        return self.repository.listar()

    def crear(self, *, equipo_id, puntos_descontados, motivo="", observaciones=""):
        try:
            puntos = int(puntos_descontados)
        except (TypeError, ValueError) as error:
            raise ValidationError(
                "puntos_descontados debe ser un número negativo."
            ) from error
        if not equipo_id:
            raise ValidationError("equipo_id requerido.")
        if puntos >= 0:
            raise ValidationError("puntos_descontados debe ser un número negativo.")
        if not Equipo.objects.filter(pk=equipo_id).exists():
            raise ValidationError("Equipo no encontrado.")
        return self.repository.crear(
            equipo_id=equipo_id,
            puntos_descontados=puntos,
            motivo=motivo or "",
            observaciones=observaciones or "",
        )

    def borrar(self, sancion_id):
        sancion = self.repository.obtener(sancion_id)
        if sancion is None:
            raise ValidationError("Sanción no encontrada.")
        self.repository.borrar(sancion)
