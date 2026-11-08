from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.views import View

from ..modelo.models import Deporte, Equipo
from ..serializers_deportes import DeporteSerializer, EquipoSerializer
from ..services_deportes import DeporteService, EquipoService
from ..authentication import api_admin_required


def _error(error, status=400):
    return JsonResponse({"error": error.message}, status=status)


class DeporteApiView(View):
    def get(self, request, deporte_id=None):
        if deporte_id:
            deporte = Deporte.objects.filter(pk=deporte_id).first()
            if not deporte:
                return JsonResponse({"error": "Deporte no encontrado."}, status=404)
            return JsonResponse(DeporteSerializer.to_dict(deporte))
        return JsonResponse(
            [DeporteSerializer.to_dict(item) for item in DeporteService().listar()],
            safe=False,
        )

    @api_admin_required
    def post(self, request, deporte_id=None):
        try:
            nombre = request.POST.get("nombre", "")
            if request.content_type == "application/json":
                import json

                nombre = json.loads(request.body).get("nombre", "")
            deporte = (
                DeporteService().actualizar(deporte_id, nombre)
                if deporte_id
                else DeporteService().crear(nombre)
            )
        except (ValidationError, TypeError, ValueError) as error:
            return _error(error)
        return JsonResponse(
            {"message": "Actualizado" if deporte_id else "Creado", "id": deporte.id},
            status=200 if deporte_id else 201,
        )

    @api_admin_required
    def put(self, request, deporte_id):
        return self.post(request, deporte_id)

    @api_admin_required
    def delete(self, request, deporte_id):
        try:
            DeporteService().borrar(deporte_id)
        except ValidationError as error:
            return _error(error, 409)
        return JsonResponse({"message": "Eliminado"})


class EquipoApiView(View):
    def get(self, request, equipo_id=None):
        if equipo_id:
            equipo = EquipoService().repository.obtener(equipo_id)
            if not equipo:
                return JsonResponse({"error": "Equipo no encontrado."}, status=404)
            return JsonResponse(EquipoSerializer.to_dict(equipo))
        return JsonResponse(
            [EquipoSerializer.to_dict(item) for item in EquipoService().listar()],
            safe=False,
        )

    @api_admin_required
    def post(self, request, equipo_id=None):
        import json

        payload = (
            json.loads(request.body)
            if request.content_type == "application/json"
            else request.POST
        )
        try:
            data = {
                "nombre": payload.get("nombre", ""),
                "facultad_id": int(payload.get("facultad_id", 0)),
                "deporte_id": int(payload.get("deporte_id", 0)),
            }
            equipo = (
                EquipoService().actualizar(equipo_id, **data)
                if equipo_id
                else EquipoService().crear(**data)
            )
        except (ValidationError, TypeError, ValueError) as error:
            return _error(error)
        return JsonResponse(
            {"message": "Actualizado" if equipo_id else "Creado", "id": equipo.id},
            status=200 if equipo_id else 201,
        )

    @api_admin_required
    def put(self, request, equipo_id):
        return self.post(request, equipo_id)

    @api_admin_required
    def delete(self, request, equipo_id):
        try:
            EquipoService().borrar(equipo_id)
        except ValidationError as error:
            return _error(error, 409)
        return JsonResponse({"message": "Eliminado"})
