from django import forms

from .models import Facultad


class FacultadForm(forms.ModelForm):
    class Meta:
        model = Facultad
        fields = ["nombre", "logo_url"]
        widgets = {
            "nombre": forms.TextInput(attrs={"required": True}),
            "logo_url": forms.URLInput(),
        }

    def clean_nombre(self):
        return self.cleaned_data["nombre"].strip()
