import json

from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views import View

from .forms import FacultadForm
from .models import Facultad
from .serializers import FacultadSerializer
from .services import FacultadService
from .authentication import api_admin_required


class FacultadView(View):
    """Vista MVT para listar y editar facultades."""

    template_name = "core/facultades.html"

    def get(self, request, facultad_id=None):
        service = FacultadService()
        facultad = service.obtener(facultad_id) if facultad_id else None
        return render(
            request,
            self.template_name,
            {"facultades": service.listar(), "form": FacultadForm(instance=facultad), "editando": facultad},
        )

    @login_required
    def post(self, request, facultad_id=None):
        service = FacultadService()
        facultad = service.obtener(facultad_id) if facultad_id else None
        form = FacultadForm(request.POST, instance=facultad)
        if form.is_valid():
            try:
                data = form.cleaned_data
                if facultad:
                    service.actualizar(facultad.id, **data)
                else:
                    service.crear(**data)
            except ValidationError as error:
                form.add_error(None, error.message)
            else:
                return redirect("facultades")
        return render(
            request,
            self.template_name,
            {"facultades": service.listar(), "form": form, "editando": facultad},
            status=400,
        )


@api_admin_required
def facultad_delete(request, facultad_id):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)
    cascade = request.POST.get("cascade") == "true"
    try:
        FacultadService().borrar(facultad_id, cascade=cascade)
    except ValidationError as error:
        return JsonResponse({"error": error.message}, status=409)
    return redirect("facultades")


class FacultadApiView(View):
    """Adaptador JSON compatible con /api/* del frontend existente."""

    def get(self, request, facultad_id=None):
        service = FacultadService()
        if facultad_id:
            facultad = get_object_or_404(Facultad, pk=facultad_id)
            return JsonResponse(FacultadSerializer.to_dict(facultad))
        data = [FacultadSerializer.to_dict(item) for item in service.listar()]
        return JsonResponse(data, safe=False)


class AdminFacultadApiView(View):
    @api_admin_required
    def get(self, request, facultad_id=None):
        return FacultadApiView().get(request, facultad_id)

    @api_admin_required
    def post(self, request, facultad_id=None):
        try:
            data = json.loads(request.body or "{}")
            service = FacultadService()
            facultad = (
                service.actualizar(
                    facultad_id,
                    nombre=str(data.get("nombre", "")),
                    logo_url=data.get("logo_url", ""),
                )
                if facultad_id
                else service.crear(
                    nombre=str(data.get("nombre", "")),
                    logo_url=data.get("logo_url", ""),
                )
            )
        except (ValidationError, TypeError, ValueError, json.JSONDecodeError) as error:
            return JsonResponse({"error": error.message}, status=400)
        return JsonResponse(
            {"message": "Actualizado" if facultad_id else "Creado", "id": facultad.id},
            status=200 if facultad_id else 201,
        )

    @api_admin_required
    def put(self, request, facultad_id):
        return self.post(request, facultad_id)

    @api_admin_required
    def delete(self, request, facultad_id):
        cascade = request.GET.get("cascade") == "true"
        try:
            FacultadService().borrar(facultad_id, cascade=cascade)
        except ValidationError as error:
            return JsonResponse({"error": error.message}, status=409)
        return JsonResponse({"message": "Eliminado", "cascade": cascade})
