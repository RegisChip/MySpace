# MySpace\MyS_Back\cuenta_usr\models.py

from django.db import models

class Usuario(models.Model):
    nombre = models.CharField(max_length=30)
    apellido_p = models.CharField(max_length=20)
    apellido_m = models.CharField(max_length=20)
    correo = models.EmailField(unique=True, max_length=50)
    contrasena = models.CharField(max_length=100)
    fecha_nacimiento = models.DateTimeField()

    def __str__(self):
        return f"{self.nombre} {self.apellido_p}"

class Perfil(models.Model):
    nom_usuario = models.CharField(max_length=30, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    foto_perfil = models.CharField(max_length=255, blank=True, null=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='perfiles')

    def __str__(self):
        return self.nom_usuario

class Seguidores(models.Model):
    perfil_seguidor = models.ForeignKey(
        Perfil, on_delete=models.CASCADE, related_name='siguiendo'
    )
    perfil_seguido = models.ForeignKey(
        Perfil, on_delete=models.CASCADE, related_name='seguidores'
    )

    class Meta:
        unique_together = ('perfil_seguidor', 'perfil_seguido')
        constraints = [
            models.CheckConstraint(
                check=~models.Q(perfil_seguidor=models.F('perfil_seguido')),
                name='no_self_follow'
            )
        ]

    def __str__(self):
        return f"{self.perfil_seguidor} sigue a {self.perfil_seguido}"

class ConfiguracionesUsuario(models.Model): # Así está en la base de datos, pero no sé si se va a a modificar después
    MODO_TEMA_CHOICES = [
        ('claro', 'Claro'),
        ('obscuro', 'Obscuro'),
    ]
    TIPO_FOND_CHOICES = [
        ('color', 'Color'),
        ('imagen', 'Imagen'),
    ]

    modo_tema = models.CharField(max_length=10, choices=MODO_TEMA_CHOICES, default='claro')
    tipo_fond = models.CharField(max_length=10, choices=TIPO_FOND_CHOICES, default='color')
    fuente = models.CharField(max_length=200, default='Arial')
    tam_fuente = models.CharField(max_length=10, default='16px')
    color_fuente = models.CharField(max_length=45, default='#000000')
    color_primario = models.CharField(max_length=20, default='#3498db')
    color_secundario = models.CharField(max_length=45, default='#2ecc71')
    acentos = models.CharField(max_length=45, default='#e74c3c')
    perfil = models.OneToOneField(Perfil, on_delete=models.CASCADE, related_name='configuracion')

    def __str__(self):
        return f"Configuración de {self.perfil.nom_usuario}"