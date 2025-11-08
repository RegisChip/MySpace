# MySpace\MyS_Back\publicaciones\views.py

## AÚN OCUPAN MODIFICACIONES

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q

from .models import Publicacion, Fotos, Comentario
from .serializers import (
    PublicacionSerializer, PublicacionCreateSerializer,
    FotosSerializer, ComentarioSerializer
)

class PublicacionViewSet(viewsets.ModelViewSet):
    queryset = Publicacion.objects.all().order_by('-fecha_pub')
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PublicacionCreateSerializer
        return PublicacionSerializer
    
    @action(detail=False, methods=['get'], url_path='por-perfil/(?P<perfil_id>[^/.]+)')
    def por_perfil(self, request, perfil_id=None):
        """Obtener publicaciones de un perfil específico"""
        publicaciones = self.queryset.filter(perfil_id=perfil_id)
        serializer = PublicacionSerializer(publicaciones, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def feed(self, request):
        """Obtener feed de publicaciones (todas o de seguidos)"""
        perfil_id = request.query_params.get('perfil_id')
        
        if perfil_id:
            # Obtener publicaciones de perfiles que sigue el usuario
            from cuenta_usr.models import Seguidores
            perfiles_seguidos = Seguidores.objects.filter(
                perfil_seguidor_id=perfil_id
            ).values_list('perfil_seguido_id', flat=True)
            
            # Incluir también las propias publicaciones
            publicaciones = self.queryset.filter(
                Q(perfil_id__in=perfiles_seguidos) | Q(perfil_id=perfil_id)
            )
        else:
            # Todas las publicaciones
            publicaciones = self.queryset
        
        page = self.paginate_queryset(publicaciones)
        if page is not None:
            serializer = PublicacionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PublicacionSerializer(publicaciones, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def dar_like(self, request, pk=None):
        """Dar like a una publicación"""
        publicacion = self.get_object()
        publicacion.like_pub += 1
        publicacion.save()
        return Response({'likes': publicacion.like_pub}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def quitar_like(self, request, pk=None):
        """Quitar like a una publicación"""
        publicacion = self.get_object()
        if publicacion.like_pub > 0:
            publicacion.like_pub -= 1
            publicacion.save()
        return Response({'likes': publicacion.like_pub}, status=status.HTTP_200_OK)


class FotosViewSet(viewsets.ModelViewSet):
    queryset = Fotos.objects.all()
    serializer_class = FotosSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'], url_path='por-publicacion/(?P<publicacion_id>[^/.]+)')
    def por_publicacion(self, request, publicacion_id=None):
        """Obtener fotos de una publicación"""
        fotos = self.queryset.filter(publicacion_id=publicacion_id)
        serializer = self.get_serializer(fotos, many=True)
        return Response(serializer.data)


class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all().order_by('-fecha_com')
    serializer_class = ComentarioSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'], url_path='por-publicacion/(?P<publicacion_id>[^/.]+)')
    def por_publicacion(self, request, publicacion_id=None):
        """Obtener comentarios de una publicación"""
        comentarios = self.queryset.filter(publicacion_id=publicacion_id)
        serializer = self.get_serializer(comentarios, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def dar_like(self, request, pk=None):
        """Dar like a un comentario"""
        comentario = self.get_object()
        comentario.like_com += 1
        comentario.save()
        return Response({'likes': comentario.like_com}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def quitar_like(self, request, pk=None):
        """Quitar like a un comentario"""
        comentario = self.get_object()
        if comentario.like_com > 0:
            comentario.like_com -= 1
            comentario.save()
        return Response({'likes': comentario.like_com}, status=status.HTTP_200_OK)