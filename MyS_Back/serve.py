# MySpace\MyS_Back\serve.py

from waitress import serve
from MySpace.wsgi import application
import logging

# Configurar logging para mostrar errores en la terminal
logging.basicConfig(level=logging.DEBUG)

# Ejecutar servidor con trazas visibles (solo para desarrollo)
serve(
    application,
    host='0.0.0.0',
    port=8001,
    threads=1,
    expose_tracebacks=True
)
