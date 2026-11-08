class DeporteSerializer:
    @staticmethod
    def to_dict(deporte):
        return {
            "id": deporte.id,
            "nombre": deporte.nombre,
            "total_equipos": getattr(deporte, "total_equipos", 0),
        }


class EquipoSerializer:
    @staticmethod
    def to_dict(equipo):
        return {
            "id": equipo.id,
            "nombre": equipo.nombre,
            "facultad": equipo.facultad.nombre,
            "deporte": equipo.deporte.nombre,
            "facultad_id": equipo.facultad_id,
            "deporte_id": equipo.deporte_id,
            "total_eventos": getattr(equipo, "total_eventos", 0),
        }
