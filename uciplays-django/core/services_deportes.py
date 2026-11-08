from django.core.exceptions import ValidationError
from django.db import transaction

from .models import Equipo, Facultad
from .repositories_deportes import DeporteRepository


class DeporteService:
    def __init__(self, repository=None):
        self.repository = repository or DeporteRepository()

    def listar(self):
        return self.repository.listar()

    def crear(self, nombre):
        nombre = nombre.strip()
        self._validar_nombre(nombre)
        if self.repository.existe_nombre(nombre):
            raise ValidationError("Ya existe un deporte con ese nombre.")
        return self.repository.crear(nombre)

    def actualizar(self, deporte_id, nombre):
        nombre = nombre.strip()
        self._validar_nombre(nombre)
        if self.repository.existe_nombre(nombre, deporte_id):
            raise ValidationError("Ya existe otro deporte con ese nombre.")
        deporte = self.repository.obtener(deporte_id)
        if deporte is None:
            raise ValidationError("Deporte no encontrado.")
        return self.repository.guardar(deporte, nombre)

    def borrar(self, deporte_id):
        deporte = self.repository.obtener(deporte_id)
        if deporte is None:
            raise ValidationError("Deporte no encontrado.")
        if Equipo.objects.filter(deporte_id=deporte_id).exists():
            raise ValidationError("No se puede borrar: hay equipos asociados.")
        self.repository.borrar(deporte)

    @staticmethod
    def _validar_nombre(nombre):
        if len(nombre) < 2:
            raise ValidationError("El nombre debe tener al menos 2 caracteres.")


class EquipoService:
    def __init__(self, repository=None):
        from .repositories_equipos import EquipoRepository

        self.repository = repository or EquipoRepository()

    def listar(self):
        return self.repository.listar()

    def crear(self, *, nombre, facultad_id, deporte_id):
        data = self._validar(nombre, facultad_id, deporte_id)
        if self.repository.existe_nombre(data["nombre"]):
            raise ValidationError("Ya existe un equipo con ese nombre.")
        if self.repository.existe_facultad_deporte(facultad_id, deporte_id):
            raise ValidationError(
                "Ya existe un equipo de esa facultad para ese deporte."
            )
        return self.repository.crear(**data)

    def actualizar(self, equipo_id, *, nombre, facultad_id, deporte_id):
        data = self._validar(nombre, facultad_id, deporte_id)
        if self.repository.existe_nombre(data["nombre"], equipo_id):
            raise ValidationError("Ya existe otro equipo con ese nombre.")
        if self.repository.existe_facultad_deporte(
            facultad_id, deporte_id, equipo_id
        ):
            raise ValidationError(
                "Ya existe otro equipo de esa facultad para ese deporte."
            )
        equipo = self.repository.obtener(equipo_id)
        if equipo is None:
            raise ValidationError("Equipo no encontrado.")
        return self.repository.guardar(equipo, **data)

    def borrar(self, equipo_id):
        equipo = self.repository.obtener(equipo_id)
        if equipo is None:
            raise ValidationError("Equipo no encontrado.")
        if self.repository.contar_eventos(equipo_id):
            raise ValidationError("El equipo tiene eventos asociados.")
        self.repository.borrar(equipo)

    @staticmethod
    def _validar(nombre, facultad_id, deporte_id):
        nombre = nombre.strip()
        if len(nombre) < 2:
            raise ValidationError("El nombre debe tener al menos 2 caracteres.")
        if not facultad_id or not deporte_id:
            raise ValidationError("facultad_id y deporte_id son requeridos.")
        if not Facultad.objects.filter(pk=facultad_id).exists():
            raise ValidationError("Facultad no encontrada.")
        from .models import Deporte

        if not Deporte.objects.filter(pk=deporte_id).exists():
            raise ValidationError("Deporte no encontrado.")
        return {
            "nombre": nombre,
            "facultad_id": facultad_id,
            "deporte_id": deporte_id,
        }
