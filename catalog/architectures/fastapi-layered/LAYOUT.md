# FastAPI layered

Horizontal layers for mid-size APIs: thin `api/` routers, `services/` for business logic, `repositories/` for persistence, `models/` for ORM, `schemas/` for Pydantic I/O.

## Rules of thumb

1. Routers call services only — no ORM in route handlers.
2. Services orchestrate repositories and domain rules.
3. Repositories own database access.
4. Keep Pydantic schemas separate from ORM models.

## Typical shape

```text
api/
services/
repositories/
models/
schemas/
core/
```
