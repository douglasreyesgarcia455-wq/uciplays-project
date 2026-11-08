class EventoSerializer:
    @staticmethod
    def to_dict(evento, participantes):
        return {
            "id": evento.id,
            "deporte_id": evento.deporte_id,
            "deporte": evento.deporte.nombre,
            "fecha": evento.fecha.isoformat() if evento.fecha else None,
            "hora": evento.hora.strftime("%H:%M:%S") if evento.hora else None,
            "lugar": evento.lugar,
            "estado": evento.estado,
            "detalles": evento.detalles,
            "participantes": [
                {
                    "id": item.id,
                    "equipo_id": item.equipo_id,
                    "equipo_nombre": item.equipo_nombre,
                    "facultad": item.facultad,
                    "deporte": item.deporte,
                    "posicion": item.posicion,
                    "puntos": item.puntos,
                }
                for item in participantes
            ],
        }
