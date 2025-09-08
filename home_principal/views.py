from django.shortcuts import render
from cuenta_usr.models import Usuario

# Create your views here.

def principal(request):
    return render(request, 'paginaPrin.html') 
    # Render de paginaPrin.html de templates

def database(request):
    try:
        user = Usuario.objects.all()
        db_ok = True
    except Exception:
        user = []
        db_ok 
    return render(request, 'bd_exitosa.html',
                  {'db_ok': db_ok ,'user': user})
    # Render de bd_exitosa.html de templates