# MySpace\MyS_Back\cuenta_usr\admin.py

from django.contrib import admin
from .models import Usuario, Perfil, Seguidores, ConfiguracionesUsuario

# Register your models here.

@admin.register(Usuario) #  USUARIO - Usuarios de la página web
class UsuarioAdmin(admin.ModelAdmin): 

    list_display = ('nombre', 'apellido_p', 'apellido_m', 'correo', 'fecha_nacimiento')
    search_fields = ('nombre', 'apellido_p', 'apellido_m', 'correo')
    list_filter = ('fecha_nacimiento',)
    ordering = ('nombre',)
    
    exclude = ('id',)

    fieldsets = (
        ("Información personal", {
            "fields": ('nombre', 'apellido_p', 'apellido_m', 'correo', 'fecha_nacimiento')
        }),
        ("Contraseña (solo para visualización o actualización manual)", {
            "fields": ('contrasena',),
            "description": "Modificación de la contraseña del usuario."
        }),
    )



@admin.register(Perfil) # PERFIL
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('nom_usuario', 'usuario', 'descripcion_corta', 'foto_perfil')
    search_fields = ('nom_usuario', 'usuario__nombre', 'usuario__correo')
    list_filter = ('usuario__fecha_nacimiento',)
    ordering = ('nom_usuario',)
    
    exclude = ('id',)

    def descripcion_corta(self, obj):
        """Mostrar una versión corta de la descripción"""
        if obj.descripcion:
            return obj.descripcion[:50] + '...' if len(obj.descripcion) > 50 else obj.descripcion
        return '-'
    descripcion_corta.short_description = 'Descripción'



@admin.register(Seguidores) # SEGUIDORES
class SeguidoresAdmin(admin.ModelAdmin):
    list_display = ('perfil_seguidor', 'relacion', 'perfil_seguido')
    search_fields = ('perfil_seguidor__nom_usuario', 'perfil_seguido__nom_usuario')
    list_filter = ('perfil_seguidor__nom_usuario',)
    
    exclude = ('id',)

    def relacion(self, obj):
        """Mostrar la relación en formato legible"""
        return "→"
    relacion.short_description = 'Sigue a'
    

    
@admin.register(ConfiguracionesUsuario) # CONFIGURACIONES USUARIO
class ConfiguracionesUsuarioAdmin(admin.ModelAdmin):
    list_display = ('perfil', 'modo_tema', 'tipo_fond', 'fuente', 'tam_fuente')
    search_fields = ('perfil__nom_usuario',)
    list_filter = ('modo_tema', 'tipo_fond')
    ordering = ('perfil',)
    
    exclude = ('id',)

    fieldsets = (
        ("Perfil", {
            "fields": ('perfil',)
        }),
        ("Tema y Apariencia", {
            "fields": ('modo_tema', 'tipo_fond')
        }),
        ("Tipografía", {
            "fields": ('fuente', 'tam_fuente', 'color_fuente')
        }),
        ("Colores", {
            "fields": ('color_primario', 'color_secundario', 'acentos')
        }),
    )