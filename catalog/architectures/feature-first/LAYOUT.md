# Feature-first

Domain behavior lives under `features/<name>/`. Anything truly cross-cutting lives under `shared/`.

## Rules of thumb

1. New product capability → new or existing **feature**, never a global `services/` dump.
2. A feature exposes a **public API** (`index.ts` / equivalent). Other features import that only.
3. `shared/` is for UI primitives, config, and utilities, not domain logic.
4. Prefer colocated tests inside the feature.

## Typical feature shape

```text
features/
  billing/
    index.ts      # public API
    ui/
    data/
    domain/
```
