# MySpace\MyS_Back\serve.py

from waitress import serve
from MySpace.wsgi import application  

serve(application, host='127.0.0.1', port=8001)