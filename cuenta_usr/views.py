from django.shortcuts import render, get_object_or_404
from cuenta_usr.models import Usuario
from django.templatetags.static import static

# Create your views here.
def index(request):
    imagen_url = static('media/myspace.svg')
    return render(request, 'user/index.html', {'imagen_url': imagen_url})

def register(request):
    imagen_url = static('media/myspace.svg')
    return render(request, 'user/register.html', {'imagen_url': imagen_url})

def perfil(request):
    imagen_url = static('media/myspace.svg')
    return render(request, 'user/perfil.html', {'imagen_url': imagen_url})

def editar(request):
    imagen_url = static('media/myspace.svg')
    return render(request, 'user/mod_perfil.html', {'imagen_url': imagen_url})
