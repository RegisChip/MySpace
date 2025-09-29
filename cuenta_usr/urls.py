from django.urls import path
from . import views

urlpatterns = [
    path('publi/', views.general, name='general'),
]