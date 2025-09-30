# import os

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

POSTGRESQL = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'BD_MySpace',
        'USER': 'postgres',
        'PASSWORD': '31183119',
        'HOST': 'localhost',
        'PORT': '5432'
    }
}