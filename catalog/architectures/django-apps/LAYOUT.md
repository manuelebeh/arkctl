# Django domain apps

Domain logic lives in Django apps under `apps/{app}/`. Project settings stay in `config/`.

## Rules of thumb

1. New business area → new app under `apps/`.
2. Keep models, views, urls, and admin close to the app that owns them.
3. Shared utilities go in `shared/`, not in a kitchen-sink app.
4. Prefer one clear responsibility per app.

## Typical shape

```text
config/
apps/
  accounts/
    models.py
    apps.py
    views.py
    urls.py
shared/
  lib/
manage.py
```
