# Symfony clean

Clean architecture on Symfony: pure `Domain/`, use cases in `Application/`, adapters in `Infrastructure/`.

## Rules of thumb

1. Domain imports nothing from Application or Infrastructure.
2. Application depends on Domain and defines ports (interfaces).
3. Infrastructure implements ports (HTTP, CLI, DB, external APIs).
4. Wire Symfony services in `config/`; exclude Domain from autoconfigure.

## Typical shape

```text
src/
  Domain/
  Application/
  Infrastructure/
config/
public/
bin/
composer.json
```
