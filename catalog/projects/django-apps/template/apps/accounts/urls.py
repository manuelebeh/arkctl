from django.urls import path

from .views import list_accounts

urlpatterns = [
    path("accounts/", list_accounts, name="list-accounts"),
]
