# FastAPI feature modules

Domain packages under `src/{feature}/` (Netflix Dispatch / [fastapi-best-practices](https://github.com/zhanymkanov/fastapi-best-practices) style). Each feature owns `router.py`, `schemas.py`, `models.py`, `service.py`.

## Rules of thumb

1. New capability → new package under `src/`.
2. Cross-feature access goes through that feature's public service / router surface.
3. Shared cross-cutting code lives in `src/` root helpers or `shared/`, not inside a random feature.

## Typical shape

```text
src/
  main.py
  accounts/
    router.py
    schemas.py
    models.py
    service.py
    dependencies.py
  shared/
```
