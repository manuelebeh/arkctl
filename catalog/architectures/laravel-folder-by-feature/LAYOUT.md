# Laravel folder-by-feature

Business features live under `app/{Feature}/`. Each feature owns its controllers, models, and routes.

## Rules of thumb

1. New product capability → new or existing **feature folder** under `app/`, never a global `Http/Controllers` dump.
2. Cross-feature access goes through the feature's routes / explicit public entrypoints, not deep into another feature's internals.
3. Keep framework glue (providers, console) outside feature folders when possible.
4. Prefer colocated tests under the feature.

## Typical feature shape

```text
app/
  Accounts/
    Controllers/
    Models/
    Routes/
      routes.php
```

Shared technical helpers may live under `shared/` at the project root (or under `app/Support/` with an architecture exception).
