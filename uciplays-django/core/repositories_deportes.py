from django.db.models import Count

from .models import Deporte


class DeporteRepository:
    def listar(self):
        return Deporte.objects.annotate(total_equipos=Count("equipo")).order_by(
            "nombre"
        )

    def obtener(self, deporte_id):
        return Deporte.objects.filter(pk=deporte_id).first()

    def existe_nombre(self, nombre, excluir_id=None):
        query = Deporte.objects.filter(nombre__iexact=nombre)
        if excluir_id is not None:
            query = query.exclude(pk=excluir_id)
        return query.exists()

    def crear(self, nombre):
        return Deporte.objects.create(nombre=nombre)

    def guardar(self, deporte, nombre):
        deporte.nombre = nombre
        deporte.save(update_fields=["nombre"])
        return deporte

    def borrar(self, deporte):
        deporte.delete()
