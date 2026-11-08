from .models import Integrante


class IntegranteRepository:
    def listar(self):
        return (
            Integrante.objects.select_related(
                "equipo__facultad", "equipo__deporte"
            )
            .order_by(
                "equipo__facultad__nombre",
                "equipo__nombre",
                "nombre",
            )
        )

    def por_equipo(self, equipo_id):
        return (
            Integrante.objects.select_related(
                "equipo__facultad", "equipo__deporte"
            )
            .filter(equipo_id=equipo_id)
            .order_by("nombre")
        )

    def obtener(self, integrante_id):
        return Integrante.objects.filter(pk=integrante_id).first()

    def existe_ci(self, ci, excluir_id=None):
        query = Integrante.objects.filter(ci=ci)
        if excluir_id is not None:
            query = query.exclude(pk=excluir_id)
        return query.exists()

    def existe_matricula(self, matricula, excluir_id=None):
        query = Integrante.objects.filter(matricula=matricula)
        if excluir_id is not None:
            query = query.exclude(pk=excluir_id)
        return query.exists()

    def crear(self, **data):
        return Integrante.objects.create(**data)

    def guardar(self, integrante, **data):
        for field, value in data.items():
            setattr(integrante, field, value)
        integrante.save(update_fields=list(data))
        return integrante

    def borrar(self, integrante):
        integrante.delete()
