from django.db.models import QuerySet

from .models import Account


def account_list() -> QuerySet[Account]:
    return Account.objects.all()
