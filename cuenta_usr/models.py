# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30)
    apellido_p = models.CharField(max_length=20)
    apellido_m = models.CharField(max_length=20)
    correo = models.CharField(unique=True, max_length=50)
    contrasena = models.CharField(max_length=100)
    fecha_nacimiento = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'usuario'