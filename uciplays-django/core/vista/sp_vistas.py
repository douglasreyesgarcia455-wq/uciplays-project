"""Punto de entrada explícito para las clases controladoras."""

from ..views_auth import AuthLoginView, AuthLogoutView, AuthMeView
from ..views_deportes_template import DeportesEquiposView
from ..views_eventos import (
    EventoApiView,
    EventoIniciarApiView,
    EventoResultadoApiView,
    EventosTemplateView,
)
from ..views_facultades import FacultadView
from ..views_integrantes import IntegrantesTemplateView
from ..views_ranking import RankingSancionesTemplateView

__all__ = [
    "AuthLoginView", "AuthLogoutView", "AuthMeView",
    "DeportesEquiposView", "EventoApiView", "EventoIniciarApiView",
    "EventoResultadoApiView", "EventosTemplateView", "FacultadView",
    "IntegrantesTemplateView", "RankingSancionesTemplateView",
]
