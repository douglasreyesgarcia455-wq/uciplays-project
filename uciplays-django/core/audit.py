import json

from .models import Auditoria
from .models import Usuario


def registrar_auditoria(request, accion, entidad, entidad_id=None, detalles=None):
    user = getattr(request, "api_user", None)
    audit_user = Usuario.objects.filter(username=getattr(user, "username", "")).first()
    Auditoria.objects.create(
        usuario_id=getattr(audit_user, "id", None),
        username=getattr(user, "username", None),
        accion=accion,
        entidad=entidad,
        entidad_id=entidad_id,
        detalles=json.loads(json.dumps(detalles)) if detalles is not None else None,
        ip=request.META.get("REMOTE_ADDR"),
    )
