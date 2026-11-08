from django.urls import path

from .views import health
from .views_facultades import (
    AdminFacultadApiView,
    FacultadApiView,
    FacultadView,
    facultad_delete,
)
from .views_deportes import DeporteApiView, EquipoApiView
from .views_deportes_template import DeportesEquiposView
from .views_integrantes import IntegranteApiView, IntegrantesTemplateView
from .views_eventos import (
    EventoApiView,
    EventoIniciarApiView,
    EventoResultadoApiView,
    EventosTemplateView,
)
from .views_ranking import (
    RankingApiView,
    RankingSancionesTemplateView,
    SancionApiView,
    SancionDeleteApiView,
)
from .views_auth import AuthLoginView, AuthLogoutView, AuthMeView, AuditoriaApiView


urlpatterns = [
    path("", health, name="health"),
    path("facultades/", FacultadView.as_view(), name="facultades"),
    path("deportes-equipos/", DeportesEquiposView.as_view(), name="deportes_equipos"),
    path("integrantes/", IntegrantesTemplateView.as_view(), name="integrantes"),
    path("eventos/", EventosTemplateView.as_view(), name="eventos"),
    path("ranking-sanciones/", RankingSancionesTemplateView.as_view(), name="ranking_sanciones"),
    path("api/public/auth/login/", AuthLoginView.as_view(), name="api_public_login"),
    path("api/public/auth/logout/", AuthLogoutView.as_view(), name="api_public_logout"),
    path("api/public/auth/me/", AuthMeView.as_view(), name="api_public_me"),
    path("api/admin/auth/login/", AuthLoginView.as_view(), name="api_admin_login"),
    path("api/admin/auth/logout/", AuthLogoutView.as_view(), name="api_admin_logout"),
    path("api/admin/auth/me/", AuthMeView.as_view(), name="api_admin_me"),
    path("api/admin/auditoria/", AuditoriaApiView.as_view(), name="api_admin_auditoria"),
    path(
        "facultades/<int:facultad_id>/",
        FacultadView.as_view(),
        name="facultad_edit",
    ),
    path(
        "facultades/<int:facultad_id>/eliminar/",
        facultad_delete,
        name="facultad_delete",
    ),
    path("api/public/facultades/", FacultadApiView.as_view(), name="api_facultades"),
    path(
        "api/admin/facultades/",
        AdminFacultadApiView.as_view(),
        name="api_admin_facultades",
    ),
    path(
        "api/admin/facultades/<int:facultad_id>/",
        AdminFacultadApiView.as_view(),
        name="api_admin_facultad",
    ),
    path(
        "api/public/facultades/<int:facultad_id>/",
        FacultadApiView.as_view(),
        name="api_facultad",
    ),
    path("api/public/deportes/", DeporteApiView.as_view(), name="api_deportes"),
    path("api/public/equipos/", EquipoApiView.as_view(), name="api_equipos"),
    path(
        "api/public/integrantes/",
        IntegranteApiView.as_view(),
        name="api_integrantes",
    ),
    path(
        "api/public/integrantes/equipo/<int:equipo_id>/",
        IntegranteApiView.as_view(),
        name="api_integrantes_equipo",
    ),
    path("api/public/eventos/", EventoApiView.as_view(), name="api_eventos"),
    path("api/public/ranking/", RankingApiView.as_view(), name="api_ranking"),
    path("api/public/sanciones/", SancionApiView.as_view(), name="api_sanciones"),
    path(
        "api/public/eventos/<int:evento_id>/",
        EventoApiView.as_view(),
        name="api_evento",
    ),
    path(
        "api/admin/deportes/",
        DeporteApiView.as_view(),
        name="api_admin_deportes",
    ),
    path(
        "api/admin/deportes/<int:deporte_id>/",
        DeporteApiView.as_view(),
        name="api_admin_deporte",
    ),
    path("api/admin/equipos/", EquipoApiView.as_view(), name="api_admin_equipos"),
    path(
        "api/admin/equipos/<int:equipo_id>/",
        EquipoApiView.as_view(),
        name="api_admin_equipo",
    ),
    path(
        "api/admin/integrantes/",
        IntegranteApiView.as_view(),
        name="api_admin_integrantes",
    ),
    path(
        "api/admin/integrantes/<int:integrante_id>/",
        IntegranteApiView.as_view(),
        name="api_admin_integrante",
    ),
    path("api/admin/eventos/", EventoApiView.as_view(), name="api_admin_eventos"),
    path(
        "api/admin/eventos/<int:evento_id>/",
        EventoApiView.as_view(),
        name="api_admin_evento",
    ),
    path(
        "api/admin/eventos/<int:evento_id>/iniciar/",
        EventoIniciarApiView.as_view(),
        name="api_admin_evento_iniciar",
    ),
    path(
        "api/admin/eventos/<int:evento_id>/resultado/",
        EventoResultadoApiView.as_view(),
        name="api_admin_evento_resultado",
    ),
    path("api/admin/sanciones/", SancionApiView.as_view(), name="api_admin_sanciones"),
    path(
        "api/admin/sanciones/<int:sancion_id>/",
        SancionDeleteApiView.as_view(),
        name="api_admin_sancion",
    ),
]

# The existing static frontend uses slashless API paths.
for pattern in list(urlpatterns):
    route = getattr(pattern, "pattern", None)
    if route and str(route).startswith("api/") and str(route).endswith("/"):
        urlpatterns.append(
            path(str(route)[:-1], pattern.callback, name=f"{pattern.name}_slashless")
        )
