# MySpace\MyS_Back\publicaciones\admin.py

from django.contrib import admin
from .models import Publicacion, Fotos, Comentario

# Register your models here.

@admin.register(Publicacion) # PUBLICACIONES
class PublicacionAdmin(admin.ModelAdmin):
    list_display = (
        'texto_corto',
        'perfil', 
        'fecha_pub',
        'like_pub',
        'num_fotos', 
        'num_comentarios'
    )
    list_display_links = ('texto_corto',)
    search_fields = ('texto', 'perfil__nom_usuario')
    list_filter = ('fecha_pub', 'perfil')
    ordering = ('-fecha_pub',)
    
    exclude = ('id',)
    readonly_fields = ('fecha_pub', 'num_fotos', 'num_comentarios')

    def texto_corto(self, obj):
        texto = obj.texto or ''
        return (texto[:60] + '...') if len(texto) > 60 else texto
    texto_corto.short_description = 'Texto'

    def num_fotos(self, obj):
        # Cuenta el número de fotos de la publicación
        return obj.fotos.count()
    num_fotos.short_description = 'Fotos'

    def num_comentarios(self, obj):
        # Cuenta el número de comentarios
        return obj.comentarios.count()
    num_comentarios.short_description = 'Comentarios'

    def get_fields(self, request, obj=None):
        # Muestra campos reales del modelo en el formulario.
        return ('perfil', 'texto', 'fecha_pub', 'like_pub')



@admin.register(Fotos) # FOTOS
class FotosAdmin(admin.ModelAdmin):
    list_display = (
        'ruta_foto_corta',
        'publicacion',
        'perfil_publicacion'
    )
    list_display_links = ('ruta_foto_corta',)
    search_fields = ('ruta_foto', 'publicacion__perfil__nom_usuario')
    list_filter = ('publicacion__fecha_pub',)
    ordering = ('-publicacion__fecha_pub',)
    
    exclude = ('id',)

    def ruta_foto_corta(self, obj):
        # Muestra ruta corta de la foto
        return obj.ruta_foto[:50] + '...' if len(obj.ruta_foto) > 50 else obj.ruta_foto
    ruta_foto_corta.short_description = 'Ruta'

    def perfil_publicacion(self, obj):
        # Muestra el perfil dueño de la publicación
        return obj.publicacion.perfil.nom_usuario
    perfil_publicacion.short_description = 'Perfil'



@admin.register(Comentario) # COMENTARIOS
class ComentarioAdmin(admin.ModelAdmin):
    list_display = (
        'texto_corto',      
        'publicacion_corta',
        'perfil',
        'like_com',
        'fecha_com'
    )
    list_display_links = ('texto_corto',)
    search_fields = (
        'texto',
        'perfil__nom_usuario',
        'publicacion__texto'
    )
    list_filter = ('fecha_com', 'perfil', 'publicacion')
    ordering = ('-fecha_com',)
    
    exclude = ('id',)
    readonly_fields = ('fecha_com',)

    def texto_corto(self, obj):
        # Versión corta del comentario
        texto = obj.texto or ''
        return (texto[:60] + '...') if len(texto) > 60 else texto
    texto_corto.short_description = 'Comentario'

    def publicacion_corta(self, obj):
        # Muestra un fragmento del texto de la publicación original
        if obj.publicacion and obj.publicacion.texto:
            texto = obj.publicacion.texto
            return (texto[:60] + '...') if len(texto) > 60 else texto
        return "(Sin texto)"
    publicacion_corta.short_description = 'Publicación original'

    def get_fields(self, request, obj=None):
        
        #Muestra los campos del formulario de detalle
        campos = ['perfil', 'texto', 'like_com', 'fecha_com']
        if request.user.is_superuser:
            campos.insert(1, 'publicacion')  # Solo admin puede cambiarla
        return campos

    def get_readonly_fields(self, request, obj=None):
        # Evita que usuarios no admin cambien la publicación original
        readonly = list(self.readonly_fields)
        if not request.user.is_superuser:
            readonly.append('publicacion')
        return readonly