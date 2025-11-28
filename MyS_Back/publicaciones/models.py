# MySpace\MyS_Back\publicaciones\models.py

from django.db import models
from cuenta_usr.models import Perfil

class Publicacion(models.Model):
    texto = models.TextField()
    fecha_pub = models.DateField(auto_now_add=True)
    like_pub = models.IntegerField(default=0)
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='publicaciones')

    # Propiedades adicionales de Publicaciones
    def __str__(self):
        return f"Publicación de {self.perfil.nom_usuario} ({self.id})"
    
    class Meta: # Configura atributos de la tabla de BD
        # Nombre de la tabla
        verbose_name = "Publicacion"
        verbose_name_plural = "Publicaciones"


class Comentario(models.Model):
    texto = models.CharField(max_length=500)
    like_com = models.IntegerField(default=0)
    fecha_com = models.DateTimeField(auto_now_add=True)
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='comentarios')
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='comentarios')

    # Propiedades adicionales de Comentarios
    def __str__(self):
        return f"Comentario de {self.perfil.nom_usuario} en publicación {self.publicacion.id}"
    
    class Meta:
        # Nombre de la tabla
        verbose_name = "Comentario"
        verbose_name_plural = "Comentarios"


class Fotos(models.Model):
    ruta_foto = models.CharField(max_length=255)
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='fotos')

    # Propiedades adicionales de Fotos
    def __str__(self):
        return f"Foto {self.id} de publicación {self.publicacion.id}"
    
    class Meta:
        # Nombre de la tabla
        verbose_name = "Foto"
        verbose_name_plural = "Fotos"