# MySpace\MyS_Back\cuenta_usr\views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .models import Usuario, Perfil, Seguidores
from .serializers import (
    UsuarioSerializer, PerfilSerializer, SeguidoresSerializer,
    LoginSerializer, RegistroSerializer
)

# Create your views here.

# Vistas para los JSON/APIS
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'], url_path='por-correo/(?P<correo>[^/.]+)')
    def por_correo(self, request, correo=None):
        # Buscar usuario por correo
        try:
            usuario = Usuario.objects.get(correo=correo)
            serializer = self.get_serializer(usuario)
            return Response(serializer.data)
        except Usuario.DoesNotExist:
            return Response(
                {'error': 'Usuario no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'], url_path='por-usuario/(?P<nom_usuario>[^/.]+)')
    def por_usuario(self, request, nom_usuario=None):
        """Buscar perfil por nombre de usuario"""
        try:
            perfil = Perfil.objects.get(nom_usuario=nom_usuario)
            serializer = self.get_serializer(perfil)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response(
                {'error': 'Perfil no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def seguidores(self, request, pk=None):
        """Obtener seguidores de un perfil"""
        perfil = self.get_object()
        seguidores = perfil.seguidores.all()
        serializer = SeguidoresSerializer(seguidores, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def siguiendo(self, request, pk=None):
        """Obtener a quiénes sigue un perfil"""
        perfil = self.get_object()
        siguiendo = perfil.siguiendo.all()
        serializer = SeguidoresSerializer(siguiendo, many=True)
        return Response(serializer.data)
        
# ======= APIS ======= #

@api_view(['POST'])
@permission_classes([AllowAny])
def registro_view(request): # Endpoint para registrar un nuevo usuario

    serializer = RegistroSerializer(data=request.data)
    
    if serializer.is_valid():
        resultado = serializer.save()
        usuario = resultado['usuario']
        perfil = resultado['perfil']
        
        # Genera tokens JWT
        refresh = RefreshToken.for_user(usuario)
        
        return Response({
            'message': 'Usuario registrado exitosamente',
            'usuario': UsuarioSerializer(usuario).data,
            'perfil': PerfilSerializer(perfil).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request): # Endpoint para iniciar sesión

    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        usuario = serializer.validated_data['usuario']
        
        # Obtiene el perfil del usuario
        try:
            perfil = Perfil.objects.get(usuario=usuario)
        except Perfil.DoesNotExist:
            return Response(
                {'error': 'Este usuario no tiene un perfil asociado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Genera tokens JWT
        refresh = RefreshToken.for_user(usuario)
        
        return Response({
            'message': 'Inicio de sesión exitoso',
            'usuario': UsuarioSerializer(usuario).data,
            'perfil': PerfilSerializer(perfil).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request): # Endpoint para cerrar sesión (No esta refinada, no sé si funciona)
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Sesión cerrada'}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)