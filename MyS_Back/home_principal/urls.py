# MySpace\MyS_Back\home_principal\urls.py

from django.urls import path
from .views import api_root

urlpatterns = [
    path('', api_root, name='api-root'),
]