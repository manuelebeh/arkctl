from django.http import JsonResponse
from django.views.decorators.http import require_POST

from actions import accounts as account_actions
from readers import accounts as account_readers


def list_accounts(_request):
    emails = list(account_readers.account_list().values_list("email", flat=True))
    return JsonResponse({"accounts": emails})


@require_POST
def register_account(request):
    email = request.POST.get("email", "")
    account = account_actions.register_account(email=email)
    return JsonResponse({"id": account.pk, "email": account.email})
