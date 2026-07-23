from data.models import Account


def register_account(*, email: str) -> Account:
    return Account.objects.create(email=email)
