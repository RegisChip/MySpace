from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.index, name='user_index'),         # Iniciar sesión
    path('register/', views.register, name='user_register'),# Registro
    path('perfil/', views.perfil, name='perfil'),           # Perfil
    path('edicion_perfil/', views.editar, name='edit_perfil'),
]