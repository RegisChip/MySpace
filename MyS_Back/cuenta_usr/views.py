# MySpace\MyS_Back\cuenta_usr\views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Usuario, Perfil, Seguidores
from .serializers import (
    UsuarioSerializer, PerfilSerializer, SeguidoresSerializer,
    LoginSerializer, RegistroSerializer
)

# Create your views here.

# ======= VIEWSETS ======= #

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    def get_permissions(self):
        # Solo lectura pública, escritura requiere autenticación
        if self.action in ['list', 'retrieve', 'por_correo']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['get'], url_path='por-correo/(?P<correo>[^/.]+)')
    def por_correo(self, request, correo=None):
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
    
    def get_permissions(self):
        # Lectura pública, escritura requiere autenticación
        if self.action in ['list', 'retrieve', 'por_usuario', 'seguidores', 'siguiendo']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['get'], url_path='por-usuario/(?P<nom_usuario>[^/.]+)')
    def por_usuario(self, request, nom_usuario=None):
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
    def mi_perfil(self, request):
        """Obtener el perfil del usuario autenticado"""
        try:
            # request.user es tu modelo Usuario personalizado
            perfil = Perfil.objects.get(usuario=request.user)
            serializer = self.get_serializer(perfil)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response(
                {'error': 'No tienes un perfil asociado'}, 
                status=status.HTTP_404_NOT_FOUND
            )


# ======= APIS ======= #

# ======= AUTENTICACIÓN ======= #

@api_view(['POST'])
@permission_classes([AllowAny])
def registro_view(request):
    """Registrar nuevo usuario"""
    serializer = RegistroSerializer(data=request.data)
    
    if serializer.is_valid():
        resultado = serializer.save()
        usuario = resultado['usuario']
        perfil = resultado['perfil']
        
        # Generar tokens JWT para el nuevo usuario
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
def login_view(request):
    """Iniciar sesión"""
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    correo = serializer.validated_data['correo']
    contrasena = serializer.validated_data['contrasena']
    
    # Autenticar usando el backend personalizado
    # username=correo porque así lo configuramos en el backend
    usuario = authenticate(request, username=correo, password=contrasena)
    
    if usuario is None:
        return Response(
            {'error': 'Correo o contraseña incorrectos'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Verificar que tenga perfil
    try:
        perfil = Perfil.objects.get(usuario=usuario)
    except Perfil.DoesNotExist:
        return Response(
            {'error': 'Este usuario no tiene un perfil asociado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Generar tokens JWT
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Cerrar sesión - Solo validación del lado del cliente"""
    # Sin blacklist, el token seguirá siendo válido hasta que expire
    # El logout real se maneja en el frontend eliminando el token del localStorage
    return Response(
        {'message': 'Sesión cerrada exitosamente'}, 
        status=status.HTTP_205_RESET_CONTENT
    )