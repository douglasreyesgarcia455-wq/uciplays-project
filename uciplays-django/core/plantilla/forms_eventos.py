from django import forms

from ..modelo.models import Evento


class EventoForm(forms.ModelForm):
    class Meta:
        model = Evento
        fields = ["deporte", "fecha", "hora", "lugar", "estado", "detalles"]
        widgets = {
            "fecha": forms.DateInput(attrs={"type": "date"}),
            "hora": forms.TimeInput(attrs={"type": "time"}),
        }
