
from django.urls import path
from . import views

urlpatterns = [
    path('', views.principal),  # Ruta para la vista principal
]