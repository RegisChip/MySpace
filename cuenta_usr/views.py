from django.shortcuts import render, get_object_or_404
from cuenta_usr.models import Usuario
from django.templatetags.static import static

# Create your views here.
def index(request):
    return render(request, 'user/index.html')

def register(request):
    return render(request, 'user/register.html')

def perfil(request):
    return render(request, 'user/perfil.html')