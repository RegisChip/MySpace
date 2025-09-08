
from django.urls import path
from . import views

urlpatterns = [
    path('', views.principal),  # Ruta para la vista principal
    path('database/', views.database),  # Ruta para la base de datos
]