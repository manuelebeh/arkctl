from django.http import JsonResponse
from django.views.decorators.http import require_POST

from . import services


@require_POST
def register_account(request):
    email = request.POST.get("email", "")
    account = services.register_account(email=email)
    return JsonResponse({"id": account.pk, "email": account.email})
