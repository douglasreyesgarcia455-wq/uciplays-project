from django.db import models


class Facultad(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    logo_url = models.TextField(blank=True, default="")

    class Meta:
        db_table = "facultades"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Deporte(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "deportes"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Equipo(models.Model):
    nombre = models.CharField(max_length=150)
    facultad = models.ForeignKey(Facultad, on_delete=models.PROTECT)
    deporte = models.ForeignKey(Deporte, on_delete=models.PROTECT)

    class Meta:
        db_table = "equipos"
        constraints = [
            models.UniqueConstraint(
                fields=["facultad", "deporte"],
                name="equipos_facultad_deporte_unicos",
            )
        ]

    def __str__(self):
        return self.nombre


class Integrante(models.Model):
    nombre = models.CharField(max_length=150)
    ci = models.CharField(max_length=100, unique=True)
    matricula = models.CharField(max_length=100, unique=True)
    equipo = models.ForeignKey(Equipo, on_delete=models.PROTECT)

    class Meta:
        db_table = "integrantes"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Evento(models.Model):
    deporte = models.ForeignKey(Deporte, on_delete=models.PROTECT)
    fecha = models.DateField(null=True, blank=True)
    hora = models.TimeField(null=True, blank=True)
    lugar = models.CharField(max_length=200, blank=True, default="")
    estado = models.CharField(max_length=50, blank=True, default="pendiente")
    detalles = models.TextField(blank=True, default="")

    class Meta:
        db_table = "eventos"
        ordering = ["fecha", "hora", "id"]


class EventoParticipante(models.Model):
    evento = models.ForeignKey(
        Evento, on_delete=models.CASCADE, related_name="participantes"
    )
    equipo = models.ForeignKey(Equipo, on_delete=models.PROTECT)
    posicion = models.PositiveIntegerField(null=True, blank=True)
    puntos = models.IntegerField(default=0)

    class Meta:
        db_table = "evento_participantes"
        constraints = [
            models.UniqueConstraint(
                fields=["evento", "equipo"],
                name="evento_participante_unico",
            )
        ]


class Sancion(models.Model):
    equipo = models.ForeignKey(Equipo, on_delete=models.PROTECT)
    puntos_descontados = models.IntegerField()
    motivo = models.TextField(blank=True, default="")
    observaciones = models.TextField(blank=True, default="")
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "sanciones"
        ordering = ["-fecha", "-id"]


class Usuario(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password_hash = models.TextField()
    rol = models.CharField(max_length=50, default="admin")
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "usuarios"


class Auditoria(models.Model):
    usuario = models.ForeignKey(
        Usuario, on_delete=models.SET_NULL, null=True, blank=True
    )
    username = models.CharField(max_length=150, blank=True, null=True)
    accion = models.CharField(max_length=100)
    entidad = models.CharField(max_length=100)
    entidad_id = models.IntegerField(null=True, blank=True)
    detalles = models.JSONField(null=True, blank=True)
    ip = models.GenericIPAddressField(null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "auditoria"
        ordering = ["-fecha", "-id"]
