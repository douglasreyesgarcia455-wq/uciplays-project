from functools import wraps

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse


def _token_from_request(request):
    header = request.headers.get("Authorization", "")
    return header[7:] if header.startswith("Bearer ") else None


def api_auth_required(view):
    @wraps(view)
    def wrapped(request_or_self, *args, **kwargs):
        bound_self = None
        request = request_or_self
        if not hasattr(request, "headers") and args:
            bound_self = request
            request = args[0]
            args = args[1:]
        token = _token_from_request(request)
        if not token:
            return JsonResponse({"error": "Token requerido"}, status=401)
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
            user = get_user_model().objects.get(
                pk=payload["id"], is_active=True
            )
        except (jwt.InvalidTokenError, KeyError, ValueError, get_user_model().DoesNotExist):
            return JsonResponse({"error": "Token inválido o expirado"}, status=401)
        request.api_user = user
        request.api_claims = payload
        if bound_self is not None:
            return view(bound_self, request, *args, **kwargs)
        return view(request, *args, **kwargs)

    return wrapped


def api_admin_required(view):
    @wraps(view)
    def admin_view(request_or_self, *args, **kwargs):
        bound_self = None
        request = request_or_self
        if not hasattr(request, "headers") and args:
            bound_self = request
            request = args[0]
            args = args[1:]
        if not request.api_user.is_staff:
            return JsonResponse({"error": "No autorizado para esta acción"}, status=403)
        if bound_self is not None:
            return view(bound_self, request, *args, **kwargs)
        return view(request, *args, **kwargs)

    return api_auth_required(admin_view)
