
from django.urls import path
from . import views

urlpatterns = [
    path('', views.principal),  # Ruta para la vista principal
    path('user/', views.index_user, name='user_index'),
    path('user/perfil/', views.perfil, name='perfil'),
]