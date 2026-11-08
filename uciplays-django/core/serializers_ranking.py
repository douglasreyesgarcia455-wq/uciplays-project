class SancionSerializer:
    @staticmethod
    def to_dict(sancion):
        equipo = sancion.equipo
        return {
            "id": sancion.id,
            "equipo_id": sancion.equipo_id,
            "equipo_nombre": equipo.nombre,
            "facultad_nombre": equipo.facultad.nombre,
            "deporte": equipo.deporte.nombre,
            "puntos_descontados": sancion.puntos_descontados,
            "motivo": sancion.motivo,
            "observaciones": sancion.observaciones,
            "fecha": sancion.fecha.isoformat() if sancion.fecha else None,
        }


class RankingSerializer:
    @staticmethod
    def to_dict(facultad):
        return {
            "id": facultad.id,
            "nombre": facultad.nombre,
            "logo_url": facultad.logo_url,
            "puntos_eventos": facultad.puntos_eventos,
            "puntos_sanciones": facultad.puntos_sanciones,
            "puntos": facultad.puntos,
        }
