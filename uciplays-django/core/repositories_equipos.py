from django.db.models import Count

from .models import Equipo


class EquipoRepository:
    def listar(self):
        return (
            Equipo.objects.select_related("facultad", "deporte")
            .annotate(total_eventos=Count("eventoparticipante"))
            .order_by("facultad__nombre", "deporte__nombre", "nombre")
        )

    def obtener(self, equipo_id):
        return Equipo.objects.select_related("facultad", "deporte").filter(
            pk=equipo_id
        ).first()

    def existe_nombre(self, nombre, excluir_id=None):
        query = Equipo.objects.filter(nombre__iexact=nombre)
        if excluir_id is not None:
            query = query.exclude(pk=excluir_id)
        return query.exists()

    def existe_facultad_deporte(self, facultad_id, deporte_id, excluir_id=None):
        query = Equipo.objects.filter(
            facultad_id=facultad_id, deporte_id=deporte_id
        )
        if excluir_id is not None:
            query = query.exclude(pk=excluir_id)
        return query.exists()

    def crear(self, **data):
        return Equipo.objects.create(**data)

    def guardar(self, equipo, **data):
        for field, value in data.items():
            setattr(equipo, field, value)
        equipo.save(update_fields=list(data))
        return equipo

    def contar_eventos(self, equipo_id):
        return Equipo.objects.filter(
            pk=equipo_id, eventoparticipante__isnull=False
        ).count()

    def borrar(self, equipo):
        equipo.delete()
