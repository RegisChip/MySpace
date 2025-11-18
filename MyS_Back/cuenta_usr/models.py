# MySpace\MyS_Back\cuenta_usr\models.py

from django.db import models
from django.contrib.auth.hashers import check_password as django_chp # verifica la contraseña

class Usuario(models.Model):
    nombre = models.CharField(max_length=30)
    apellido_p = models.CharField(max_length=20)
    apellido_m = models.CharField(max_length=20)
    correo = models.EmailField(unique=True, max_length=50)
    contrasena = models.CharField(max_length=100)
    fecha_nacimiento = models.DateTimeField()

    # Propiedades requeridas por JWT ===========
    @property
    def is_authenticated(self): # Siempre retorna True para validar usuarios
        return True
    @property
    def is_anonymous(self): # Siemore retorna False para validar usuarios
        return False
    @property
    def pk(self): # SimpleJWT necesita acceder al pk o id
        return self.id
    # Metodos criticos para JWT ================
    def check_password(self, raw_password): # Verifica si la contrcontraseña coincide con la base de datos
        return django_chp(raw_password, self.contrasena)
    
    # Propiedades adicionales de Usuario
    def __str__(self):
        return f"{self.nombre} {self.apellido_p}"
    
    class Meta: # Configura atributos de la tabla de BD
        db_table = 'cuenta_usr_usuario'
        unique_together = ('nombre', 'apellido_p', 'apellido_m',)
        # Nombre de la tabla
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"


class Perfil(models.Model):
    nom_usuario = models.CharField(max_length=30, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    foto_perfil = models.CharField(max_length=255, blank=True, null=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='perfiles')

    # Propiedades adicionales de Perfil
    def __str__(self):
        return self.nom_usuario
    
    class Meta: # Configura atributos de la tabla de BD
        db_table = 'cuenta_usr_perfil'
        # Nombre de la tabla
        verbose_name = "Perfil"
        verbose_name_plural = "Perfiles"


class Seguidores(models.Model):
    # Perfil sigue a otro Perfil
    perfil_seguidor = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='siguiendo')
    perfil_seguido = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='seguidores')

    # Propiedades adicionales de Seguidores
    def __str__(self):
        return f"{self.perfil_seguidor} sigue a {self.perfil_seguido}"
    
    class Meta: # Configura atributos de la tabla de BD
        db_table = 'cuenta_usr_seguidores' 
        unique_together = ('perfil_seguidor', 'perfil_seguido')
        constraints = [
            models.CheckConstraint(
                check=~models.Q(perfil_seguidor=models.F('perfil_seguido')),
                name='no_self_follow'
            )
        ]
        # Nombre de la tabla
        verbose_name = "Seguimiento"
        verbose_name_plural = "Seguimientos"


class ConfiguracionesUsuario(models.Model): # Tabla bajo revision

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

    # Propiedades adicionales de ConfiguracionesUsuario
    def __str__(self):
        return f"Configuración de {self.perfil.nom_usuario}"
    
    class Meta: # Configura atributos de la tabla de BD
        db_table = 'cuenta_usr_configuracionesusuario' 
        unique_together = ('perfil_seguidor', 'perfil_seguido')
        constraints = [
            models.CheckConstraint(
                check=~models.Q(perfil_seguidor=models.F('perfil_seguido')),
                name='no_self_follow'
            )
        ]
        # Nombre de la tabla
        verbose_name = "ConfiguracionesUsuario"
        verbose_name_plural = "ConfiguracionesUsuarios"