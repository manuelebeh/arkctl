from django.http import JsonResponse

from .models import Account


def list_accounts(_request):
    emails = list(Account.objects.values_list("email", flat=True))
    return JsonResponse({"accounts": emails})
