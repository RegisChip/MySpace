# MySpace\MyS_Back\home_principal\views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response


# Pequeño menu para la vista de las APIs
@api_view(['GET'])
def api_root(request): # Endpoint raíz de la API
    return Response({
        'message': 'Bienvenido a la API de MySpace',
        'endpoints': {
            'usuarios': '/api/usuario/',
            'publicaciones': '/api/publicaciones/',
            'login': '/api/usuario/login/',
            'registro': '/api/usuario/registro/',
        }
    })