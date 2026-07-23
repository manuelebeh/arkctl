SECRET_KEY = "dev-only-change-me"
DEBUG = True
INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "data",
]
ROOT_URLCONF = "interfaces.http.urls"
DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "db.sqlite3"}}
USE_TZ = True
