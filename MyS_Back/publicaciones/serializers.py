# MySpace\MyS_Back\publicaciones\serializers.py

from rest_framework import serializers
from .models import Publicacion, Fotos, Comentario
from cuenta_usr.serializers import PerfilSerializer

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
    fotos_rutas = serializers.ListField(
        child=serializers.CharField(max_length=255),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Publicacion
        fields = ['texto', 'perfil', 'fotos_rutas']
    
    def create(self, validated_data):
        fotos_rutas = validated_data.pop('fotos_rutas', [])
        publicacion = Publicacion.objects.create(**validated_data)
        
        # Crear fotos asociadas
        for ruta in fotos_rutas:
            Fotos.objects.create(ruta_foto=ruta, publicacion=publicacion)
        
        return publicacion