import json

from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View

from ..repositories_ranking import RankingRepository
from ..serializers_ranking import RankingSerializer, SancionSerializer
from ..services_sanciones import SancionService
from ..authentication import api_admin_required


def _payload(request):
    if request.content_type == "application/json":
        return json.loads(request.body or "{}")
    return request.POST


def _error(error, status=400):
    return JsonResponse({"error": error.message}, status=status)


class RankingApiView(View):
    def get(self, request):
        return JsonResponse(
            [RankingSerializer.to_dict(item) for item in RankingRepository().listar()],
            safe=False,
        )


class SancionApiView(View):
    def get(self, request):
        return JsonResponse(
            [SancionSerializer.to_dict(item) for item in SancionService().listar()],
            safe=False,
        )

    @api_admin_required
    def post(self, request):
        try:
            payload = _payload(request)
            sancion = SancionService().crear(
                equipo_id=int(payload.get("equipo_id", 0)),
                puntos_descontados=payload.get("puntos_descontados"),
                motivo=payload.get("motivo", ""),
                observaciones=payload.get("observaciones", ""),
            )
        except (ValidationError, ValueError, TypeError, json.JSONDecodeError) as error:
            return _error(error)
        return JsonResponse({"message": "Creado", "id": sancion.id}, status=201)


class SancionDeleteApiView(View):
    @api_admin_required
    def delete(self, request, sancion_id):
        try:
            SancionService().borrar(sancion_id)
        except ValidationError as error:
            return _error(error, 404)
        return JsonResponse({"message": "Eliminado"})


class RankingSancionesTemplateView(View):
    def get(self, request):
        return render(
            request,
            "core/ranking_sanciones.html",
            {
                "ranking": RankingRepository().listar(),
                "sanciones": SancionService().listar(),
            },
        )
