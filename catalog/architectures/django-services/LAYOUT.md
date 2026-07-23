# Django services + selectors

Domain apps under `apps/{app}/` separate reads (`selectors.py`) from writes (`services.py`), following the HackSoft Django styleguide pattern.

## Rules of thumb

1. Views / APIs call services and selectors — not models directly for business logic.
2. `services.py` mutates state; `selectors.py` returns querysets / DTOs.
3. Keep ORM details out of views.
4. Shared code goes in `shared/`.

## Typical shape

```text
apps/
  accounts/
    models.py
    apps.py
    services.py
    selectors.py
    views.py
shared/
```
