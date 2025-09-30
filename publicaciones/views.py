from django.templatetags.static import static
from django.shortcuts import render

def general(request):
    return render(request, 'publi/index.html')