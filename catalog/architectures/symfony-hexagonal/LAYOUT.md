# Symfony hexagonal

Hexagonal layout on Symfony: pure `Domain/`, use cases in `Application/`, adapters in `Infrastructure/`. HTTP controllers live under `Infrastructure/Http/`, not `src/Controller/`.

## Rules of thumb

1. Domain imports nothing from Application or Infrastructure.
2. Application depends on Domain and defines ports (interfaces).
3. Infrastructure implements ports; HTTP adapters go in `Infrastructure/Http/`.
4. Doctrine entities, repositories, and Messenger handlers belong in Infrastructure.

## Typical shape

```text
src/
  Domain/
  Application/
  Infrastructure/
    Http/
config/
public/
bin/
composer.json
```
