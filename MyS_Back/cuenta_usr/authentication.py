# MySpace\MyS_Back\cuenta_usr\authentication.py

from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Usuario

class CustomJWTAuthentication(JWTAuthentication): # Autenticacion JWT para el usuario personalizado (Nuestro modelo usuario)

    def get_user(self, validated_token):

        """
        Args:
            validated_token: Token JWT ya validado que contiene el user_id
        Returns:
            Usuario: Instancia del modelo Usuario personalizado
            None: Si el usuario no existe
        """

        try:
            user_id = validated_token.get('user_id')
            
            if user_id is None:
                return None
            
            usuario = Usuario.objects.get(id=user_id)
            return usuario
            
        except Usuario.DoesNotExist:
            return None
        except Exception as e:
            print(f"Error en CustomJWTAuthentication: {e}")
            return None