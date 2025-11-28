# MySpace\MyS_Back\cuenta_usr\serializers.py

from rest_framework import serializers
from .models import Usuario, Perfil, Seguidores
from django.contrib.auth.hashers import make_password

class UsuarioSerializer(serializers.ModelSerializer):
    # Clase Meta
    class Meta: # Estructura el JSON y sus datos
        model = Usuario
        fields = ['id', 
                  'nombre', 
                  'apellido_p', 
                  'apellido_m', 
                  'correo', 
                  'contrasena', 
                  'fecha_nacimiento']
        extra_kwargs = {'contrasena': {'write_only': True}}

    # Metodos para crear y actualizar los datos de Usuario
    def create(self, validated_data):
        validated_data['contrasena'] = make_password(validated_data['contrasena'])
        return super().create(validated_data)
    def update(self, instance, validated_data):
        if 'contrasena' in validated_data:
            validated_data['contrasena'] = make_password(validated_data['contrasena'])
        return super().update(instance, validated_data)
    

class PerfilSerializer(serializers.ModelSerializer):
    # Datos de Perfil contados: Info del usuario, num. de publicaciones, seguidores y seguidos
    usuario_info = UsuarioSerializer(source='usuario', read_only=True)
    total_publicaciones = serializers.SerializerMethodField()
    total_seguidores = serializers.SerializerMethodField()
    total_siguiendo = serializers.SerializerMethodField()

    # Clase Meta
    class Meta:
        model = Perfil
        fields = ['id', 
                  'nom_usuario', 
                  'descripcion', 
                  'foto_perfil', 
                  'usuario', 
                  'usuario_info', 
                  'total_publicaciones', 
                  'total_seguidores', 
                  'total_siguiendo']
        
    # Metodos para contar publicaciones, seguidores y seguidos
    def get_total_publicaciones(self, obj):
        return obj.publicaciones.count()
    def get_total_seguidores(self, obj):
        return obj.seguidores.count()
    def get_total_siguiendo(self, obj):
        return obj.siguiendo.count()


class SeguidoresSerializer(serializers.ModelSerializer):
    # Datos de Seguidores: Seguidor y Seguido con su nombre de perfil
    seguidor_nombre = serializers.CharField(source='perfil_seguidor.nom_usuario', read_only=True)
    seguido_nombre = serializers.CharField(source='perfil_seguido.nom_usuario', read_only=True)
    # Info del perfil seguidor y seguido
    seguidor_info = serializers.SerializerMethodField()
    seguido_info = serializers.SerializerMethodField()
    
    # Clase Meta
    class Meta:
        model = Seguidores
        fields = ['id', 
                  'perfil_seguidor', 
                  'perfil_seguido', 
                  'seguidor_nombre', 
                  'seguido_nombre',
                  'seguidor_info',
                  'seguido_info']
        
    # Metodos para contar conseguir seguidores y seguidos
    def get_seguidor_info(self, obj):
        perfil = obj.perfil_seguidor
        return {'id': perfil.id,
                'nom_usuario': perfil.nom_usuario,
                'foto_perfil': perfil.foto_perfil,
                'descripcion': perfil.descripcion} if perfil else None
    def get_seguido_info(self, obj):
        perfil = obj.perfil_seguido
        return {'id': perfil.id,
                'nom_usuario': perfil.nom_usuario,
                'foto_perfil': perfil.foto_perfil,
                'descripcion': perfil.descripcion} if perfil else None


# =====================================================
# Serializadores para el inicio de sesion y registro
# =====================================================
class LoginSerializer(serializers.Serializer): # Serializa la informacion al inisiar sesion
    # Datos requeridos para iniciar sesion
    correo = serializers.EmailField()
    contrasena = serializers.CharField(write_only=True, min_length=6)
    
    # Metodo para validar el correo
    def validate_correo(self, value):
        if not Usuario.objects.filter(correo=value).exists():
            raise serializers.ValidationError('Correo no registrado')
        return value
    

class RegistroSerializer(serializers.Serializer): # Serializa la informacion al registrarse
    # Datos para registrarse
    nombre = serializers.CharField(max_length=30)
    apellido_p = serializers.CharField(max_length=20)
    apellido_m = serializers.CharField(max_length=20)
    correo = serializers.EmailField(max_length=50)
    contrasena = serializers.CharField(write_only=True, min_length=6)
    fecha_nacimiento = serializers.DateTimeField()

    # Datos que se le daran a Perfil
    nom_usuario = serializers.CharField(max_length=30, required=False)
    descripcion = serializers.CharField(required=False, allow_blank=True)
    foto_perfil = serializers.CharField(required=False, allow_blank=True)

    # Metodos para validar el correo y nombre de usuario y crear el usuario y perfil
    def validate_correo(self, value):
        if Usuario.objects.filter(correo=value).exists():
            raise serializers.ValidationError('Este correo ya está registrado')
        return value
    def validate_nom_usuario(self, value):
        if value and Perfil.objects.filter(nom_usuario=value).exists():
            raise serializers.ValidationError('Este nombre de usuario ya está en uso')
        return value
    def create(self, validated_data):
        nom_usuario = validated_data.pop('nom_usuario', None)
        if not nom_usuario: # El nombre default de perfil es el nombre de usuario
            base_username = validated_data['nombre'].lower().replace(' ', '')
            nom_usuario = base_username
            counter = 1
            while Perfil.objects.filter(nom_usuario=nom_usuario).exists():
                nom_usuario = f"{base_username}{counter}"
                counter += 1
        # Separa datos de perfil
        perfil_data = {'nom_usuario': nom_usuario,
                       'descripcion': validated_data.pop('descripcion', ''),
                       'foto_perfil': validated_data.pop('foto_perfil', ''),}
        validated_data['contrasena'] = make_password(validated_data['contrasena'])
        usuario = Usuario.objects.create(**validated_data)
        perfil = Perfil.objects.create(usuario=usuario, **perfil_data)
        return {'usuario': usuario, 'perfil': perfil}