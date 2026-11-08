class IntegranteSerializer:
    @staticmethod
    def to_dict(integrante):
        equipo = integrante.equipo
        return {
            "id": integrante.id,
            "nombre": integrante.nombre,
            "ci": integrante.ci,
            "matricula": integrante.matricula,
            "equipo_id": integrante.equipo_id,
            "equipo_nombre": equipo.nombre,
            "facultad_nombre": equipo.facultad.nombre,
            "deporte": equipo.deporte.nombre,
        }
