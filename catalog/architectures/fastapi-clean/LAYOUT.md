# FastAPI clean architecture

Classic clean layers: `domain/`, `application/`, `infrastructure/`, `presentation/`.

## Rules of thumb

1. Domain has no framework imports.
2. Application depends on domain only.
3. Infrastructure implements ports; presentation (FastAPI routers) calls application.
4. Shared helpers live in `shared/`.

## Typical shape

```text
domain/
application/
infrastructure/
presentation/
shared/
```
