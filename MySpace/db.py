import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

POSTGRESQL = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mySpace',
        'USER': 'postgres',
        'PASSWORD': 'R3g1nard-0710',
        'HOST': 'localhost',
        'POST': '5432'
    }
}