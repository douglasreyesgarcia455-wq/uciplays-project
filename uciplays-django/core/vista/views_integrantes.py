import json

from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View

from ..plantilla.fr_plantilla import IntegranteForm
from ..modelo.models import Integrante
from ..serializers_integrantes import IntegranteSerializer
from ..services_integrantes import IntegranteService
from ..authentication import api_admin_required


def _payload(request):
    if request.content_type == "application/json":
        return json.loads(request.body or "{}")
    return request.POST


def _error(error, status=400):
    return JsonResponse({"error": error.message}, status=status)


class IntegranteApiView(View):
    def get(self, request, equipo_id=None):
        service = IntegranteService()
        integrantes = (
            service.por_equipo(equipo_id)
            if equipo_id is not None
            else service.listar()
        )
        return JsonResponse(
            [IntegranteSerializer.to_dict(item) for item in integrantes],
            safe=False,
        )

    @api_admin_required
    def post(self, request, integrante_id=None):
        try:
            payload = _payload(request)
            data = {
                "nombre": payload.get("nombre", ""),
                "ci": payload.get("ci", ""),
                "matricula": payload.get("matricula", ""),
            }
            if integrante_id:
                integrante = IntegranteService().actualizar(integrante_id, **data)
            else:
                data["equipo_id"] = int(payload.get("equipo_id", 0))
                integrante = IntegranteService().crear(**data)
        except (ValidationError, TypeError, ValueError, json.JSONDecodeError) as error:
            return _error(error)
        return JsonResponse(
            {"message": "Actualizado" if integrante_id else "Creado", "id": integrante.id},
            status=200 if integrante_id else 201,
        )

    @api_admin_required
    def put(self, request, integrante_id):
        return self.post(request, integrante_id)

    @api_admin_required
    def delete(self, request, integrante_id):
        try:
            IntegranteService().borrar(integrante_id)
        except ValidationError as error:
            return _error(error, 404)
        return JsonResponse({"message": "Eliminado"})


class IntegrantesTemplateView(View):
    template_name = "core/integrantes.html"

    def get(self, request):
        return render(
            request,
            self.template_name,
            {"integrantes": IntegranteService().listar(), "form": IntegranteForm()},
        )

    @login_required
    def post(self, request):
        form = IntegranteForm(request.POST)
        if form.is_valid():
            try:
                data = form.cleaned_data
                IntegranteService().crear(
                    nombre=data["nombre"],
                    ci=data["ci"],
                    matricula=data["matricula"],
                    equipo_id=data["equipo"].id,
                )
            except ValidationError as error:
                form.add_error(None, error.message)
            else:
                return render(
                    request,
                    self.template_name,
                    {"integrantes": IntegranteService().listar(), "form": IntegranteForm()},
                )
        return render(
            request,
            self.template_name,
            {"integrantes": IntegranteService().listar(), "form": form},
            status=400,
        )
