from django.contrib import admin

from .models import (
    Auditoria,
    Deporte,
    Equipo,
    Evento,
    EventoParticipante,
    Facultad,
    Integrante,
    Sancion,
    Usuario,
)

for model in (
    Facultad,
    Deporte,
    Equipo,
    Evento,
    EventoParticipante,
    Integrante,
    Sancion,
    Usuario,
    Auditoria,
):
    admin.site.register(model)
