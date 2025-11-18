# MySpace\MyS_Back\cuenta_usr\views.py

# Importes de rest_framework para: hacer vistas, controlar permisos, crear endpoints, responder JSON y manejar tokens de autenticación en APIs con Django
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
# Importes de Django para autenticación y manejo de errores
from django.contrib.auth import authenticate
from django.db import IntegrityError
# Importes del modelo y serializadores personalizados
from .models import Usuario, Perfil
from .serializers import (UsuarioSerializer,
                          PerfilSerializer,
                          SeguidoresSerializer,
                          LoginSerializer,
                          RegistroSerializer)

import logging
logger = logging.getLogger(__name__)

# =========
# VIEWSETS
# =========

class UsuarioViewSet(viewsets.ModelViewSet): # View para el modelo Usuario
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    # Permisos dependiendo del estado: solo lectura pública, escritura requiere autenticación
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'por_correo']:
            return [AllowAny()]
        return [IsAuthenticated()]
    # Endpoint para obtener el usuario por correo
    @action(detail=False, methods=['get'], url_path='por-correo/(?P<correo>[^/.]+)')
    def por_correo(self, request, correo=None):
        try:
            usuario = Usuario.objects.get(correo=correo)
            serializer = self.get_serializer(usuario)
            return Response(serializer.data)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, 
                            status=status.HTTP_404_NOT_FOUND)
        

class PerfilViewSet(viewsets.ModelViewSet): # View para el modelo Perfil
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer

    # Permisos dependiendo del estado: solo lectura pública, escritura requiere autenticación
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'por_usuario', 'seguidores', 'siguiendo']:
            return [AllowAny()]
        return [IsAuthenticated()]
    # Endpoints para obtener todos los datos relacionados a perfil: nombre, datos, seguidores y siguiendo
    @action(detail=False, methods=['get'], url_path='por-usuario/(?P<nom_usuario>[^/.]+)')
    def por_usuario(self, request, nom_usuario=None):
        try:
            perfil = Perfil.objects.get(nom_usuario=nom_usuario)
            serializer = self.get_serializer(perfil)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response({'error': 'Perfil no encontrado'},
                            status=status.HTTP_404_NOT_FOUND)
    @action(detail=True, methods=['get'])
    def seguidores(self, request, pk=None):
        perfil = self.get_object()
        seguidores = perfil.seguidores.all()
        serializer = SeguidoresSerializer(seguidores, many=True)
        return Response(serializer.data)
    @action(detail=True, methods=['get'])
    def siguiendo(self, request, pk=None):
        perfil = self.get_object()
        siguiendo = perfil.siguiendo.all()
        serializer = SeguidoresSerializer(siguiendo, many=True)
        return Response(serializer.data)
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mi_perfil(self, request): # Obtiene el perfil del usuario autenticado
        try:
            perfil = Perfil.objects.get(usuario=request.user)
            serializer = self.get_serializer(perfil)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response({'error': 'No tienes un perfil asociado'},
                            status=status.HTTP_404_NOT_FOUND)
        
# ==========================
# APIS DE INICIO DE SESION
# ==========================

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request): # Inicia sesión

    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    correo = serializer.validated_data['correo']
    contrasena = serializer.validated_data['contrasena']
    # Autentifica usando el backend personalizado
    usuario = authenticate(request, username=correo, password=contrasena)
    if usuario is None:
        return Response({'error': 'Correo o contraseña incorrectos'}, 
                        status=status.HTTP_401_UNAUTHORIZED)
    # Verifica que tenga un perfil
    try:
        perfil = Perfil.objects.get(usuario=usuario)
    except Perfil.DoesNotExist:
        return Response({'error': 'Este usuario no tiene un perfil asociado'}, 
                        status=status.HTTP_404_NOT_FOUND)
    # Genera los tokens JWT
    refresh = RefreshToken.for_user(usuario)
    return Response({'message': 'Inicio de sesión exitoso',
                     'usuario': UsuarioSerializer(usuario).data,
                     'perfil': PerfilSerializer(perfil).data,
                     'tokens': {'refresh': str(refresh),
                                'access': str(refresh.access_token),}}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request): # Cierra sesión
    return Response({'message': 'Sesión cerrada exitosamente'}, 
                    status=status.HTTP_205_RESET_CONTENT)

# ==================================
# APIS DE REGISTRO Y AUTENTICACIÓN
# ==================================

@api_view(['POST'])
@permission_classes([AllowAny])
def registro_view(request): # Registra un nuevo usuario con captura de IntegrityError

    serializer = RegistroSerializer(data=request.data)
    if serializer.is_valid():
        try: # BLOQUE TRY para manejar la restricción unique_together
            resultado = serializer.save()
        except IntegrityError as e:
            # Mensaje para la restricción de nombre completo
            if 'unique_together' in str(e) or 'nombre' in str(e) or 'duplicate key' in str(e):
                return Response({'error': 'Ya existe un usuario con la misma combinación de nombre y apellidos.'},
                                status=status.HTTP_400_BAD_REQUEST)
            return Response( # Error generico de integridad
                {'error': f'Error de base de datos inesperado: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST)
        usuario = resultado['usuario']
        perfil = resultado['perfil']
        # Genera los tokens JWT
        refresh = RefreshToken.for_user(usuario)
        return Response({'message': 'Usuario registrado exitosamente',
                         'usuario': UsuarioSerializer(usuario).data,
                         'perfil': PerfilSerializer(perfil).data,
                         'tokens': {'refresh': str(refresh),
                                    'access': str(refresh.access_token),}}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# VALIDACIONES AJAX

@api_view(['POST'])
@permission_classes([AllowAny])
def validar_email_ajax(request): # Verifica si el correo ya existe

    correo = request.data.get('correo')
    if not correo:
        return Response(
            {'error': 'El campo correo es requerido.'},
            status=status.HTTP_400_BAD_REQUEST)
    existe = Usuario.objects.filter(correo=correo).exists()
    # Cambia el "disponible" a "existe"
    return Response({'existe': existe,
                     'disponible': not existe,
                     'mensaje': 'Este correo ya está registrado.' if existe else 'Correo disponible.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def validar_nombre_completo_ajax(request): # Verifica si la combinación de nombre, apellido p. y m. ya existe

    data = request.data
    nombre = data.get('nombre')
    apellido_p = data.get('apellido_p')
    apellido_m = data.get('apellido_m')
    if not all([nombre, apellido_p, apellido_m]):
        return Response({'existe': False,
                         'disponible': True,
                         'mensaje': 'Faltan campos.'}, status=status.HTTP_200_OK)
    existe = Usuario.objects.filter(nombre__iexact=nombre,          
                                    apellido_p__iexact=apellido_p,
                                    apellido_m__iexact=apellido_m).exists()
    # Cambia el "disponible" a "existe"
    return Response({'existe': existe,
                     'disponible': not existe,
                     'mensaje': 'Ya existe un usuario con esta combinación exacta de nombre y apellidos.'
                     if existe else 'Combinación de nombre disponible.'}, status=status.HTTP_200_OK)