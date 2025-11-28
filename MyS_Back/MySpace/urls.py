# MySpace\MyS_Back\MySpace\urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [ # Con eso Django expone endpoints REST
    path('admin/', admin.site.urls),
    path('api/usuario/', include('cuenta_usr.urls')),
    path('api/publicaciones/', include('publicaciones.urls')),
    path('api/', include('home_principal.urls')),
]