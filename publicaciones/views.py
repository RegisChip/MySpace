from django.templatetags.static import static
from django.shortcuts import render

def index_user(request):
    return render(request, 'user/index.html')
