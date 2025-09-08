from django.shortcuts import render
from cuenta_usr.models import Usuario

# Create your views here.

def principal(request):
    return render(request, 'paginaPrin.html') 
    # Render de paginaPrin.html de templates

def database(request):
    user = Usuario.objects.all()
    return render(request, 'bd_exitosa.html',
                  {'user': user})
    # Render de bd_exitosa.html de templates