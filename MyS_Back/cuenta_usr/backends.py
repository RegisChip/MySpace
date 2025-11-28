# MySpace\MyS_Back\cuenta_usr\backends.py

from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import Usuario

class UsuarioBackend(BaseBackend): # Back para la autenticacion del usuario personalizado (Nuestro modelo usuario)

    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            usuario = Usuario.objects.get(correo=username)
            if check_password(password, usuario.contrasena):
                return usuario
        except Usuario.DoesNotExist:
            return None
        return None
    def get_user(self, user_id):
        try:
            return Usuario.objects.get(pk=user_id)
        except Usuario.DoesNotExist:
            return None