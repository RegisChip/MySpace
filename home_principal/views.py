from django.shortcuts import render, get_object_or_404
from cuenta_usr.models import Usuario
from django.templatetags.static import static

# Create your views here.

def principal(request):
    imagen_url = static('media/myspace.svg')
    return render(request, 'home_prin/index.html', {'imagen_url': imagen_url})