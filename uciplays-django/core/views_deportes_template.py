from django.shortcuts import render
from django.views import View

from .services_deportes import DeporteService, EquipoService


class DeportesEquiposView(View):
    template_name = "core/deportes_equipos.html"

    def get(self, request):
        return render(
            request,
            self.template_name,
            {
                "deportes": DeporteService().listar(),
                "equipos": EquipoService().listar(),
            },
        )
