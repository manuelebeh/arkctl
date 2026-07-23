# Symfony standard

Symfony Flex layout: thin controllers, injectable services, Doctrine entities and repositories under `src/`.

## Rules of thumb

1. Controllers live in `src/Controller/` and end with `Controller.php`.
2. Business logic belongs in `src/Service/`.
3. Persistence uses `src/Entity/` and `src/Repository/`.
4. Keep the web root in `public/`; wire the app through `config/` and `bin/console`.

## Typical shape

```text
src/
  Controller/
  Service/
  Entity/
  Repository/
config/
public/
bin/
composer.json
```
