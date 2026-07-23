from django.urls import path

from interfaces.http import views

urlpatterns = [
    path("accounts/", views.list_accounts),
    path("accounts/register/", views.register_account),
]
