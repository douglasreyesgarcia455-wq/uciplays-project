from django.db.models import IntegerField, OuterRef, Subquery, Sum, Value
from django.db.models.functions import Coalesce

from .models import Auditoria, Equipo, Facultad, Sancion


class RankingRepository:
    def listar(self):
        sanciones = (
            Sancion.objects.filter(equipo__facultad_id=OuterRef("pk"))
            .values("equipo__facultad_id")
            .annotate(total=Sum("puntos_descontados"))
            .values("total")
        )
        eventos = (
            Equipo.objects.filter(facultad_id=OuterRef("pk"))
            .values("facultad_id")
            .annotate(total=Sum("eventoparticipante__puntos"))
            .values("total")
        )
        return (
            Facultad.objects.annotate(
                puntos_eventos=Coalesce(
                    Subquery(eventos, output_field=IntegerField()), Value(0)
                ),
                puntos_sanciones=Coalesce(
                    Subquery(sanciones, output_field=IntegerField()), Value(0)
                ),
            )
            .annotate(
                puntos=(
                    Value(0)
                    + Coalesce("puntos_eventos", Value(0))
                    + Coalesce("puntos_sanciones", Value(0))
                )
            )
            .order_by("-puntos", "nombre")
        )


class SancionRepository:
    def listar(self):
        return Sancion.objects.select_related(
            "equipo__facultad", "equipo__deporte"
        ).order_by("-fecha", "-id")

    def obtener(self, sancion_id):
        return Sancion.objects.filter(pk=sancion_id).first()

    def crear(self, **data):
        return Sancion.objects.create(**data)

    def borrar(self, sancion):
        sancion.delete()
