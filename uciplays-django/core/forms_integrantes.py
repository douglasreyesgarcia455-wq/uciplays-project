from django import forms

from .models import Integrante


class IntegranteForm(forms.ModelForm):
    class Meta:
        model = Integrante
        fields = ["nombre", "ci", "matricula", "equipo"]

    def clean_nombre(self):
        return self.cleaned_data["nombre"].strip()

    def clean_ci(self):
        return self.cleaned_data["ci"].strip()

    def clean_matricula(self):
        return self.cleaned_data["matricula"].strip()
