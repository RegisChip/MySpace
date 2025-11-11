# MySpace\MyS_Back\home_principal\admin.py
# Se utiliza este admin.py para la gestion y vista de los administradores/superusuarios

from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models import GrupoExtendido

# Register your models here.

# Elimina el registro original del modelo User
admin.site.unregister(User)

#  Registramos con la versión personalizada
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'mostrar_grupos'
    )

    def mostrar_grupos(self, obj):
        # Muestra los grupos a los que pertenece el usuario
        grupos = obj.groups.all()
        if grupos.exists():
            return ", ".join([g.name for g in grupos])
        return "Sin grupo"
    mostrar_grupos.short_description = "Grupos"


# Desregistramos el Group original
admin.site.unregister(Group)

# Registramos nuestro nuevo admin personalizado
class GrupoExtendidoInline(admin.StackedInline):
    model = GrupoExtendido
    can_delete = False
    verbose_name_plural = "Descripción del grupo"

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    inlines = [GrupoExtendidoInline]
    list_display = ('name', 'mostrar_descripcion')

    def mostrar_descripcion(self, obj):
        if hasattr(obj, 'extension') and obj.extension.descripcion:
            return obj.extension.descripcion
        return "Sin descripción"
    mostrar_descripcion.short_description = "Descripción"