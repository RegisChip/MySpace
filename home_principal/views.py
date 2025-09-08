from django.shortcuts import render

# Create your views here.

def principal(request):
    return render(request, 'paginaPrin.html') 
    # Render de paginaPrin.html de templates

def database(request):
    return render(request, 'bd_exitosa.html')
    # Render de bd_exitosa.html de templates