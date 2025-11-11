# MySpace\MyS_Back\publicaciones\serializers.py

from rest_framework import serializers
from .models import Publicacion, Fotos, Comentario
from cuenta_usr.serializers import PerfilSerializer

# Puede que requieran modificaciones

class FotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fotos
        fields = ['id', 'ruta_foto', 'publicacion']


class ComentarioSerializer(serializers.ModelSerializer):
    perfil_info = PerfilSerializer(source='perfil', read_only=True)
    
    class Meta:
        model = Comentario
        fields = ['id', 'texto', 'like_com', 'fecha_com', 'publicacion', 'perfil', 'perfil_info']
        read_only_fields = ['fecha_com', 'like_com']


class ComentarioCreateSerializer(serializers.ModelSerializer):
    """Serializer para CREAR comentarios"""
    
    class Meta:
        model = Comentario
        fields = ['texto', 'publicacion', 'perfil']
    
    def validate_texto(self, value):
        """Validar que el texto no esté vacío"""
        if not value or not value.strip():
            raise serializers.ValidationError("El comentario no puede estar vacío")
        return value.strip()
    
    def validate_publicacion(self, value):
        """Validar que la publicación exista"""
        if not Publicacion.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("La publicación no existe")
        return value
    
    def create(self, validated_data):
        """Crear el comentario en la base de datos"""
        comentario = Comentario.objects.create(**validated_data)
        return comentario


class PublicacionSerializer(serializers.ModelSerializer):
    perfil_info = PerfilSerializer(source='perfil', read_only=True)
    fotos = FotosSerializer(many=True, read_only=True)
    comentarios = ComentarioSerializer(many=True, read_only=True)
    total_comentarios = serializers.SerializerMethodField()
    
    class Meta:
        model = Publicacion
        fields = ['id', 'texto', 'fecha_pub', 'like_pub', 'perfil', 'perfil_info', 
                  'fotos', 'comentarios', 'total_comentarios']
        read_only_fields = ['fecha_pub', 'like_pub']
    
    def get_total_comentarios(self, obj):
        return obj.comentarios.count()


class PublicacionCreateSerializer(serializers.ModelSerializer):
    """Serializer para CREAR publicaciones"""
    fotos_rutas = serializers.ListField(
        child=serializers.CharField(max_length=255),
        write_only=True,
        required=False,
        allow_empty=True
    )
    
    class Meta:
        model = Publicacion
        fields = ['texto', 'perfil', 'fotos_rutas']
    
    def validate_texto(self, value):
        """Validar que el texto no esté vacío"""
        if not value or not value.strip():
            raise serializers.ValidationError("La publicación no puede estar vacía")
        return value.strip()
    
    def create(self, validated_data):
        """Crear la publicación y sus fotos en la base de datos"""
        fotos_rutas = validated_data.pop('fotos_rutas', [])
        
        # Crear la publicación
        publicacion = Publicacion.objects.create(**validated_data)
        
        # Crear fotos asociadas (si existen)
        for ruta in fotos_rutas:
            if ruta and ruta.strip():  # Solo crear si la ruta no está vacía
                Fotos.objects.create(ruta_foto=ruta.strip(), publicacion=publicacion)
        
        return publicacion