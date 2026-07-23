# Django best practices

## Project layout

* Keep one Django project settings package; split settings by environment (`base`, `local`, `prod`) when config diverges
* Put business domains in apps under `apps/` (or the project's chosen apps root)
* Prefer small, focused apps over a single catch-all app
* Shared cross-app helpers live in a dedicated shared package, not in random apps
* Use `AppConfig` and explicit `INSTALLED_APPS` entries

## Settings & configuration

* Load secrets from environment variables; never commit `.env` with real credentials
* Keep `DEBUG=False` outside local development
* Use `django-environ` or equivalent for typed env parsing when settings grow
* Separate `STATIC` / `MEDIA` / database / cache config clearly
* Prefer `STORAGES` / modern Django settings keys over deprecated aliases

## Views, URLs & forms

* Prefer class-based views when they reduce boilerplate; function views when logic is thin
* Keep URL namespaced per app (`app_name` + `include()`)
* Validate input with Django forms or serializers; do not trust `request.POST` / query params raw
* Return the correct status codes for create/update/delete flows
* Keep view functions thin: push business rules into services or model methods

## Auth & permissions

* Use Django's auth system (`User`, groups, permissions) before inventing a parallel model
* Enforce access with `LoginRequiredMixin`, `PermissionRequiredMixin`, or DRF permissions
* Prefer object-level checks via custom permissions or guarded querysets
* Hash passwords only through Django's password hashers

## Security

* Keep `CSRF` middleware on for session/cookie forms
* Set `SECURE_*` / `SESSION_COOKIE_*` / `CSRF_COOKIE_*` appropriately in production
* Validate and sanitize all user input; escape output in templates by default
* Avoid raw SQL unless necessary; parameterize when you must
* Run `python manage.py check --deploy` before production

## Testing

* Use Django's `TestCase` / `SimpleTestCase` / `TransactionTestCase` appropriately
* Prefer factories (factory_boy) or fixtures for reusable data
* Cover views, permissions, and critical model invariants
* Keep tests fast; isolate DB when possible

## Performance

* Avoid N+1 queries (see `django-orm` for QuerySet patterns)
* Cache expensive reads with Django's cache framework or Redis when justified
* Use `select_related` / `prefetch_related` before denormalizing
* Profile with Django Debug Toolbar or query logging in development

## Dependencies & tools

* Pin Django to a supported LTS or current stable
* Manage deps with `uv`, `poetry`, or `pip-tools`
* Use Ruff/Black and MyPy (or Django stubs) when the project already does

## Database & ORM

See the `django-orm` agent for models, migrations, and QuerySet details.
