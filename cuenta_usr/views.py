from django.shortcuts import render, get_object_or_404
from cuenta_usr.models import Usuario
from django.templatetags.static import static

# Create your views here.
def general(request):
    return render(request, 'publi/index.html')