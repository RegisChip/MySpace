# MySpace\MyS_Back\publicaciones\serializers.py

from rest_framework import serializers
from .models import Publicacion, Comentario, Fotos
from cuenta_usr.serializers import PerfilSerializer

# ===========================
# Serializadores para Fotos
# ===========================

class FotosSerializer(serializers.ModelSerializer):
    # Clase Meta
    class Meta:
        model = Fotos
        fields = ['id', 
                  'ruta_foto', 
                  'publicacion']

# =================================
# Serializadores para comentarios
# =================================

# Serializer simplificado de publicación para comentarios

class PublicacionSimpleSerializer(serializers.ModelSerializer):
    # Dato del perfil
    perfil_info = PerfilSerializer(source='perfil', read_only=True)

    # Clase Meta
    class Meta:
        model = Publicacion
        fields = ['id',
                  'texto',
                  'fecha_pub',
                  'like_pub',
                  'perfil',
                  'perfil_info']


class ComentarioSerializer(serializers.ModelSerializer):
    # Datos del comentario: perfil y a que publicacion pertenece
    perfil_info = PerfilSerializer(source='perfil', read_only=True)
    publicacion_info = PublicacionSimpleSerializer(source='publicacion', read_only=True)

    # Clase Meta
    class Meta:
        model = Comentario
        read_only_fields = ['fecha_com', 'like_com']
        fields = ['id',
                  'texto',
                  'like_com',
                  'fecha_com',
                  'publicacion',
                  'perfil',
                  'perfil_info',
                  'publicacion_info'] 
        

class ComentarioCreateSerializer(serializers.ModelSerializer):
    # Clase Meta
    class Meta:
        model = Comentario
        fields = ['texto', 'publicacion', 'perfil']
    
    # Metodos para validar y crear el comentario
    def validate_texto(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El comentario no puede estar vacío")
        return value.strip()
    def validate_publicacion(self, value):
        if not Publicacion.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("La publicación no existe")
        return value
    def create(self, validated_data):
        comentario = Comentario.objects.create(**validated_data)
        return comentario

# ===================================
# Serializadores para publicaciones
# ===================================

class PublicacionSerializer(serializers.ModelSerializer):
    # Datos del la publicacione: perfil, foto y contenido de los comentarios
    perfil_info = PerfilSerializer(source='perfil', read_only=True)
    fotos = FotosSerializer(many=True, read_only=True)
    comentarios = ComentarioSerializer(many=True, read_only=True)
    total_comentarios = serializers.SerializerMethodField()

    # Clase Meta
    class Meta:
        model = Publicacion
        read_only_fields = ['fecha_pub', 'like_pub']
        fields = ['id',
                  'texto',
                  'fecha_pub',
                  'like_pub',
                  'perfil',
                  'perfil_info', 
                  'fotos',
                  'comentarios',
                  'total_comentarios']
        
    # Metodo para obtener el total de comentarios
    def get_total_comentarios(self, obj):
        return obj.comentarios.count()


class PublicacionCreateSerializer(serializers.ModelSerializer):
    # Datos extra para crear una publicacion
    fotos_rutas = serializers.ListField(child=serializers.CharField(max_length=255),
                                        write_only=True,
                                        required=False,
                                        allow_empty=True)
    
    # Clase Meta
    class Meta:
        model = Publicacion
        fields = ['texto',
                  'perfil',
                  'fotos_rutas']
    
    # Metodos para validar y crear la publicacion
    def validate_texto(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("La publicación no puede estar vacía")
        return value.strip()
    def create(self, validated_data):
        fotos_rutas = validated_data.pop('fotos_rutas', [])
        publicacion = Publicacion.objects.create(**validated_data)
        for ruta in fotos_rutas:
            if ruta and ruta.strip():
                Fotos.objects.create(ruta_foto=ruta.strip(), publicacion=publicacion)
        return publicacion