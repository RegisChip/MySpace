# MySpace\MyS_Back\cuenta_usr\urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (UsuarioViewSet,
                    PerfilViewSet,
                    login_view,
                    logout_view,
                    registro_view,
                    validar_email_ajax,
                    validar_nombre_completo_ajax)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'perfiles', PerfilViewSet, basename='perfil')

urlpatterns = [
    # Auth endpoints
    path('registro/', registro_view, name='registro'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    
    # Nuevas rutas de validación AJAX
    path('validar/email/', validar_email_ajax, name='validar_email_ajax'),
    path('validar/nombre-completo/', validar_nombre_completo_ajax, name='validar_nombre_completo_ajax'),
    
    # Router endpoints
    path('', include(router.urls)),
]