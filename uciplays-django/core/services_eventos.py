from django.core.exceptions import ValidationError
from django.db import transaction

from .models import Deporte, Equipo
from .repositories_eventos import EventoRepository


class EventoService:
    def __init__(self, repository=None):
        self.repository = repository or EventoRepository()

    def listar(self, estado=None):
        return self.repository.listar(estado)

    def obtener(self, evento_id):
        return self.repository.obtener(evento_id)

    @transaction.atomic
    def crear(self, *, deporte_id, fecha=None, hora=None, lugar="", estado="pendiente",
              detalles="", participantes=None):
        participantes = participantes or []
        self._validar_evento(deporte_id, participantes, require_participants=True)
        return self.repository.crear(
            deporte_id=deporte_id,
            fecha=fecha or None,
            hora=hora or None,
            lugar=lugar or "",
            estado=estado or "pendiente",
            detalles=detalles or "",
            participantes=participantes,
        )

    @transaction.atomic
    def actualizar(self, evento_id, **data):
        participantes = data.pop("participantes", [])
        self._validar_evento(
            data.get("deporte_id"), participantes, require_participants=False
        )
        evento = self._require(evento_id)
        return self.repository.guardar(evento, participantes=participantes, **data)

    @transaction.atomic
    def borrar(self, evento_id):
        self.repository.borrar(self._require(evento_id))

    @transaction.atomic
    def iniciar(self, evento_id, fecha, hora):
        evento = self._require(evento_id)
        self.repository.iniciar(evento, fecha, hora)
        return evento

    @transaction.atomic
    def registrar_resultado(self, evento_id, resultados):
        evento = self._require(evento_id)
        if not resultados:
            raise ValidationError("Se requiere al menos un resultado.")
        posiciones = [item.get("posicion") for item in resultados if item.get("posicion") is not None]
        if len(posiciones) != len(set(posiciones)):
            raise ValidationError("Las posiciones no pueden repetirse.")
        self.repository.guardar_resultados(evento, resultados)
        return evento

    def _validar_evento(self, deporte_id, participantes, require_participants):
        if not deporte_id:
            raise ValidationError("deporte_id requerido.")
        if not Deporte.objects.filter(pk=deporte_id).exists():
            raise ValidationError("Deporte no encontrado.")
        if require_participants and len(participantes) < 2:
            raise ValidationError("Se requieren al menos 2 participantes.")
        equipo_ids = [item.get("equipo_id") for item in participantes if item.get("equipo_id")]
        if len(equipo_ids) != len(set(equipo_ids)):
            raise ValidationError("Los participantes no pueden repetirse.")
        if equipo_ids and Equipo.objects.filter(pk__in=equipo_ids).count() != len(equipo_ids):
            raise ValidationError("Uno o más equipos no existen.")

    def _require(self, evento_id):
        evento = self.repository.obtener(evento_id)
        if evento is None:
            raise ValidationError("Evento no encontrado.")
        return evento
