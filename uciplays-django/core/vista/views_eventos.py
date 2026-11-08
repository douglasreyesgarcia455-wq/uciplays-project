import json

from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View

from ..plantilla.fr_plantilla import EventoForm
from ..serializers_eventos import EventoSerializer
from ..services_eventos import EventoService
from ..authentication import api_admin_required


def _payload(request):
    if request.content_type == "application/json":
        return json.loads(request.body or "{}")
    return request.POST


def _error(error, status=400):
    return JsonResponse({"error": error.message}, status=status)


def _serialize(evento, service):
    return EventoSerializer.to_dict(evento, service.repository.participantes(evento.id))


class EventoApiView(View):
    def get(self, request, evento_id=None):
        service = EventoService()
        if evento_id:
            evento = service.obtener(evento_id)
            if not evento:
                return JsonResponse({"error": "Evento no encontrado."}, status=404)
            return JsonResponse(_serialize(evento, service))
        return JsonResponse(
            [_serialize(evento, service) for evento in service.listar(request.GET.get("estado"))],
            safe=False,
        )

    @api_admin_required
    def post(self, request, evento_id=None):
        try:
            payload = _payload(request)
            data = {
                "deporte_id": int(payload.get("deporte_id", 0)),
                "fecha": payload.get("fecha"),
                "hora": payload.get("hora"),
                "lugar": payload.get("lugar", ""),
                "estado": payload.get("estado", "pendiente"),
                "detalles": payload.get("detalles", ""),
                "participantes": payload.get("participantes", []),
            }
            if evento_id:
                evento = EventoService().actualizar(evento_id, **data)
            else:
                evento = EventoService().crear(**data)
        except (ValidationError, TypeError, ValueError, json.JSONDecodeError) as error:
            return _error(error)
        return JsonResponse(
            {"message": "Actualizado" if evento_id else "Creado", "id": evento.id},
            status=200 if evento_id else 201,
        )

    @api_admin_required
    def put(self, request, evento_id):
        return self.post(request, evento_id)

    @api_admin_required
    def delete(self, request, evento_id):
        try:
            EventoService().borrar(evento_id)
        except ValidationError as error:
            return _error(error, 404)
        return JsonResponse({"message": "Eliminado"})


class EventoIniciarApiView(View):
    @api_admin_required
    def post(self, request, evento_id):
        try:
            payload = _payload(request)
            evento = EventoService().iniciar(
                evento_id, payload.get("fecha"), payload.get("hora")
            )
        except (ValidationError, TypeError, ValueError, json.JSONDecodeError) as error:
            return _error(error, 404)
        return JsonResponse({"message": "Evento iniciado", "id": evento.id})


class EventoResultadoApiView(View):
    @api_admin_required
    def post(self, request, evento_id):
        try:
            payload = _payload(request)
            EventoService().registrar_resultado(
                evento_id, payload.get("resultados", [])
            )
        except (ValidationError, TypeError, ValueError, json.JSONDecodeError) as error:
            return _error(error)
        return JsonResponse({"message": "Resultado guardado y evento finalizado"})


class EventosTemplateView(View):
    template_name = "core/eventos.html"

    def get(self, request):
        return render(
            request,
            self.template_name,
            {"eventos": EventoService().listar(), "form": EventoForm()},
        )
