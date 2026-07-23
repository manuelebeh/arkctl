# Laravel modular DDD

Bounded contexts live under `app/Domains/{Domain}/` with classic DDD layers. Cross-cutting code lives in `app/Shared/`.

## Rules of thumb

1. New business area → new domain folder under `app/Domains/`.
2. **Domain** holds entities, value objects, domain events, repository interfaces (no Eloquent).
3. **Application** orchestrates use cases / actions / DTOs.
4. **Infrastructure** holds Eloquent models, repository implementations, external clients.
5. Domain must not depend on Infrastructure.

## Typical domain shape

```text
app/
  Domains/
    Accounts/
      Domain/
      Application/
      Infrastructure/
  Shared/
    lib/
```

Communicate across domains via application services, events, or Shared contracts — not by importing another domain's Infrastructure.
