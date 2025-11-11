# MySpace\MyS_Back\cuenta_usr\backends.py

from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import Usuario

class UsuarioBackend(BaseBackend):
    
    # Backend de autenticación personalizado para el modelo Usuario
    
    def authenticate(self, request, username=None, password=None, **kwargs):

        # username será el correo del usuario
        try:
            # Buscar usuario por correo
            usuario = Usuario.objects.get(correo=username)
            # Verificar contraseña
            if check_password(password, usuario.contrasena):
                return usuario
        except Usuario.DoesNotExist:
            return None
        
        return None
    
    def get_user(self, user_id):

        # Obtener usuario por ID (requerido por Django)
        try:
            return Usuario.objects.get(pk=user_id)
        except Usuario.DoesNotExist:
            return None