from django.core.exceptions import ValidationError

from .models import Equipo
from .repositories_integrantes import IntegranteRepository


class IntegranteService:
    def __init__(self, repository=None):
        self.repository = repository or IntegranteRepository()

    def listar(self):
        return self.repository.listar()

    def por_equipo(self, equipo_id):
        return self.repository.por_equipo(equipo_id)

    def crear(self, *, nombre, ci, matricula, equipo_id):
        data = self._validar(nombre, ci, matricula, equipo_id)
        if self.repository.existe_ci(data["ci"]):
            raise ValidationError("Ya existe un integrante con esa CI.")
        if self.repository.existe_matricula(data["matricula"]):
            raise ValidationError("Ya existe un integrante con esa matrícula.")
        return self.repository.crear(**data)

    def actualizar(self, integrante_id, *, nombre, ci, matricula):
        nombre = nombre.strip()
        ci = ci.strip()
        matricula = matricula.strip()
        if len(nombre) < 2:
            raise ValidationError("Nombre inválido.")
        if not ci:
            raise ValidationError("CI requerida.")
        if not matricula:
            raise ValidationError("Matrícula requerida.")
        if self.repository.existe_ci(ci, integrante_id):
            raise ValidationError("CI ya registrada en otro integrante.")
        if self.repository.existe_matricula(matricula, integrante_id):
            raise ValidationError("Matrícula ya registrada en otro integrante.")
        integrante = self.repository.obtener(integrante_id)
        if integrante is None:
            raise ValidationError("Integrante no encontrado.")
        return self.repository.guardar(
            integrante, nombre=nombre, ci=ci, matricula=matricula
        )

    def borrar(self, integrante_id):
        integrante = self.repository.obtener(integrante_id)
        if integrante is None:
            raise ValidationError("Integrante no encontrado.")
        self.repository.borrar(integrante)

    @staticmethod
    def _validar(nombre, ci, matricula, equipo_id):
        nombre = nombre.strip()
        ci = ci.strip()
        matricula = matricula.strip()
        if len(nombre) < 2:
            raise ValidationError("Nombre inválido.")
        if not ci:
            raise ValidationError("CI requerida.")
        if not matricula:
            raise ValidationError("Matrícula requerida.")
        if not equipo_id:
            raise ValidationError("equipo_id requerido.")
        if not Equipo.objects.filter(pk=equipo_id).exists():
            raise ValidationError("Equipo no encontrado.")
        return {
            "nombre": nombre,
            "ci": ci,
            "matricula": matricula,
            "equipo_id": equipo_id,
        }
