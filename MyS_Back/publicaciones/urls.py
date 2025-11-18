# MySpace\MyS_Back\publicaciones\urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicacionViewSet, ComentarioViewSet, FotosViewSet

router = DefaultRouter()
router.register(r'publicaciones', PublicacionViewSet, basename='publicacion')
router.register(r'fotos', FotosViewSet, basename='fotos')
router.register(r'comentarios', ComentarioViewSet, basename='comentario')

urlpatterns = [
    # Router endpoints
    path('', include(router.urls)),
]