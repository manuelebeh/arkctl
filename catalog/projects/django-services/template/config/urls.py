from django.urls import path

from apps.accounts.views import register_account

urlpatterns = [
    path("accounts/register/", register_account),
]
