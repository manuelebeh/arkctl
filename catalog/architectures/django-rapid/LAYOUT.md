# Django RAPID layers

Horizontal layering from [Django RAPID architecture](https://www.django-rapid-architecture.org/structure/): separate **data**, **interfaces**, and business logic (**readers** / **actions**) at the top level. Domain partitioning happens *inside* each layer, not via project-specific Django apps.

## Rules of thumb

1. **data/** — models and migrations (the only INSTALLED_APPS domain package besides management commands).
2. **interfaces/** — HTTP views, URLconf, management commands (thin adapters).
3. **readers/** — read-side business logic (queries, visibility rules).
4. **actions/** — write-side business logic (creates, updates, side effects).
5. Interfaces call readers/actions; data must not import interfaces.

## Typical shape

```text
actions/
  accounts.py
readers/
  accounts.py
data/
  models/
  migrations/
interfaces/
  http/
    urls.py
    api/
config/
manage.py
```
