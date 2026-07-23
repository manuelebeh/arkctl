# Django modular DDD

Bounded contexts live under `domains/{Domain}/` with domain, application, and infrastructure layers. Cross-cutting code lives in `shared/`.

## Rules of thumb

1. New business area → new domain folder.
2. **domain** holds entities, value objects, repository interfaces (no ORM).
3. **application** orchestrates use cases.
4. **infrastructure** holds Django models, repository implementations, adapters.
5. Domain must not import infrastructure.

## Typical shape

```text
domains/
  accounts/
    domain/
    application/
    infrastructure/
shared/
  lib/
config/
```
