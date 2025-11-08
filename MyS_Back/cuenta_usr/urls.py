# MySpace\MyS_Back\cuenta_usr\urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (UsuarioViewSet, PerfilViewSet, registro_view, login_view, logout_view)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'perfiles', PerfilViewSet, basename='perfil')

urlpatterns = [
    # Auth endpoints
    path('registro/', registro_view, name='registro'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    
    # Router endpoints
    path('', include(router.urls)),
]