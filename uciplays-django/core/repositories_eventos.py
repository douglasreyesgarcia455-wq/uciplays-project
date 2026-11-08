from django.db.models import F, Value
from django.db.models.functions import Coalesce

from .models import Evento, EventoParticipante


class EventoRepository:
    def participantes(self, evento_id):
        return (
            EventoParticipante.objects.select_related(
                "equipo__facultad", "equipo__deporte"
            )
            .filter(evento_id=evento_id)
            .annotate(
                equipo_nombre=F("equipo__nombre"),
                facultad=F("equipo__facultad__nombre"),
                deporte=F("equipo__deporte__nombre"),
            )
            .order_by(Coalesce("posicion", Value(999)), "equipo__nombre")
        )

    def listar(self, estado=None):
        query = Evento.objects.select_related("deporte").order_by("fecha", "hora", "id")
        if estado:
            query = query.filter(estado=estado)
        return query

    def obtener(self, evento_id):
        return Evento.objects.select_related("deporte").filter(pk=evento_id).first()

    def crear(self, **data):
        participantes = data.pop("participantes", [])
        evento = Evento.objects.create(**data)
        self.reemplazar_participantes(evento, participantes)
        return evento

    def guardar(self, evento, **data):
        participantes = data.pop("participantes", None)
        for field, value in data.items():
            setattr(evento, field, value)
        evento.save()
        if participantes is not None:
            self.reemplazar_participantes(evento, participantes)
        return evento

    def reemplazar_participantes(self, evento, participantes):
        EventoParticipante.objects.filter(evento=evento).delete()
        rows = [
            EventoParticipante(
                evento=evento,
                equipo_id=item["equipo_id"],
                posicion=item.get("posicion"),
                puntos=item.get("puntos", 0) or 0,
            )
            for item in participantes
            if item.get("equipo_id")
        ]
        EventoParticipante.objects.bulk_create(rows)

    def borrar(self, evento):
        evento.delete()

    def iniciar(self, evento, fecha, hora):
        evento.estado = "en curso"
        evento.fecha = fecha
        evento.hora = hora
        evento.save(update_fields=["estado", "fecha", "hora"])

    def guardar_resultados(self, evento, resultados):
        for resultado in resultados:
            participant = EventoParticipante.objects.filter(
                evento=evento, equipo_id=resultado["equipo_id"]
            ).first()
            if participant:
                participant.posicion = resultado.get("posicion")
                participant.puntos = puntos_por_posicion(participant.posicion)
                participant.save(update_fields=["posicion", "puntos"])
        evento.estado = "finalizado"
        evento.save(update_fields=["estado"])


def puntos_por_posicion(posicion):
    return {1: 3, 2: 2, 3: 1}.get(posicion, 0)
