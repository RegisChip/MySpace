from django.urls import path
from . import views

urlpatterns = [
    path('', views.general, name='general'), # Página general de publicaciones
]
