import json

import jwt
from django.conf import settings
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views import View

from ..audit import registrar_auditoria
from ..authentication import api_auth_required
from ..modelo.models import Auditoria


class AuthLoginView(View):
    def post(self, request):
        try:
            payload = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON inválido"}, status=400)
        username = str(payload.get("username", "")).strip()
        password = payload.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user is None:
            return JsonResponse({"error": "Credenciales incorrectas"}, status=401)
        if not user.is_active:
            return JsonResponse({"error": "Usuario inactivo"}, status=403)
        claims = {"id": user.id, "username": user.username, "rol": "admin" if user.is_staff else "user"}
        token = jwt.encode(claims, settings.JWT_SECRET, algorithm="HS256")
        request.api_user = user
        registrar_auditoria(request, "login", "usuario", user.id, {"username": user.username})
        return JsonResponse(
            {"token": token, "user": {**claims}},
        )


class AuthMeView(View):
    @api_auth_required
    def get(self, request):
        user = request.api_user
        return JsonResponse(
            {"user": {"id": user.id, "username": user.username, "rol": "admin" if user.is_staff else "user"}}
        )


class AuthLogoutView(View):
    @api_auth_required
    def post(self, request):
        registrar_auditoria(request, "logout", "usuario", request.api_user.id, None)
        return JsonResponse({"message": "Logout registrado"})


class AuditoriaApiView(View):
    @api_auth_required
    def get(self, request):
        limit = min(int(request.GET.get("limite", 100)), 500)
        rows = Auditoria.objects.order_by("-fecha", "-id")[:limit]
        return JsonResponse(
            [
                {
                    "id": row.id,
                    "usuario_id": row.usuario_id,
                    "username": row.username,
                    "accion": row.accion,
                    "entidad": row.entidad,
                    "entidad_id": row.entidad_id,
                    "detalles": row.detalles,
                    "ip": row.ip,
                    "fecha": row.fecha.isoformat(),
                }
                for row in rows
            ],
            safe=False,
        )
