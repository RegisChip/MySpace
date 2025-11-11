# MySpace\MyS_Back\publicaciones\views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Publicacion, Fotos, Comentario
from .serializers import (
    PublicacionSerializer, PublicacionCreateSerializer,
    FotosSerializer, ComentarioSerializer, ComentarioCreateSerializer
)

# Create your views here.

# Puede que requieran modificaciones

class PublicacionViewSet(viewsets.ModelViewSet):
    queryset = Publicacion.objects.all().order_by('-fecha_pub')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PublicacionCreateSerializer
        return PublicacionSerializer
    
    def get_permissions(self):
        # Lectura pública, escritura requiere autenticación
        if self.action in ['list', 'retrieve', 'por_perfil', 'feed']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):
        """Crear nueva publicación"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Crear la publicación
        publicacion = serializer.save()
        
        # Retornar con el serializador completo para incluir perfil_info
        response_serializer = PublicacionSerializer(publicacion)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='por-perfil/(?P<perfil_id>[^/.]+)')
    def por_perfil(self, request, perfil_id=None):
        publicaciones = self.queryset.filter(perfil_id=perfil_id)
        serializer = PublicacionSerializer(publicaciones, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def feed(self, request):
        publicaciones = self.queryset
        page = self.paginate_queryset(publicaciones)
        if page is not None:
            serializer = PublicacionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PublicacionSerializer(publicaciones, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def dar_like(self, request, pk=None):
        publicacion = self.get_object()
        publicacion.like_pub += 1
        publicacion.save()
        return Response({'likes': publicacion.like_pub}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def quitar_like(self, request, pk=None):
        publicacion = self.get_object()
        if publicacion.like_pub > 0:
            publicacion.like_pub -= 1
            publicacion.save()
        return Response({'likes': publicacion.like_pub}, status=status.HTTP_200_OK)


class FotosViewSet(viewsets.ModelViewSet):
    queryset = Fotos.objects.all()
    serializer_class = FotosSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'por_publicacion']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['get'], url_path='por-publicacion/(?P<publicacion_id>[^/.]+)')
    def por_publicacion(self, request, publicacion_id=None):
        fotos = self.queryset.filter(publicacion_id=publicacion_id)
        serializer = self.get_serializer(fotos, many=True)
        return Response(serializer.data)


class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all().order_by('-fecha_com')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ComentarioCreateSerializer
        return ComentarioSerializer
    
    def get_permissions(self):
        # Lectura pública, escritura requiere autenticación
        if self.action in ['list', 'retrieve', 'por_publicacion']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):
        """Crear nuevo comentario"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Crear el comentario
        comentario = serializer.save()
        
        # Retornar con el serializador completo para incluir perfil_info
        response_serializer = ComentarioSerializer(comentario)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='por-publicacion/(?P<publicacion_id>[^/.]+)')
    def por_publicacion(self, request, publicacion_id=None):
        comentarios = self.queryset.filter(publicacion_id=publicacion_id)
        serializer = self.get_serializer(comentarios, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def dar_like(self, request, pk=None):
        comentario = self.get_object()
        comentario.like_com += 1
        comentario.save()
        return Response({'likes': comentario.like_com}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def quitar_like(self, request, pk=None):
        comentario = self.get_object()
        if comentario.like_com > 0:
            comentario.like_com -= 1
            comentario.save()
        return Response({'likes': comentario.like_com}, status=status.HTTP_200_OK)