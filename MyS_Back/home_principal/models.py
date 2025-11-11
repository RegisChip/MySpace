# MySpace\MyS_Back\home_principal\models.py

from django.db import models
from django.contrib.auth.models import Group

# Create your models here.

class GrupoExtendido(models.Model):
    grupo = models.OneToOneField(Group, on_delete=models.CASCADE, related_name='extension')
    descripcion = models.TextField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.grupo.name
