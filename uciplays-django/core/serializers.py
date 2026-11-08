class FacultadSerializer:
    """DTO de salida para no exponer directamente el modelo (GoF: Adapter)."""

    @staticmethod
    def to_dict(facultad):
        return {
            "id": facultad.id,
            "nombre": facultad.nombre,
            "logo_url": facultad.logo_url,
            "total_equipos": getattr(facultad, "total_equipos", None),
        }
