# Laravel packages (InterNACHI Modular)

Modules live under `app-modules/{module}/` as real Composer packages (path repositories + Laravel package discovery).

## Rules of thumb

1. New capability → `php artisan make:module module-name`.
2. Directory names are **kebab-case**; PHP namespaces are PascalCase under `Modules\`.
3. Each module has its own `composer.json` with PSR-4 and optional service providers.
4. Prefer extracting a module to a standalone package when boundaries stabilize.

## Typical module shape

```text
app-modules/
  accounts/
    composer.json
    src/
      Providers/
      Models/
      Http/
    routes/
      web.php
    database/
      migrations/
    tests/
```

See https://github.com/InterNACHI/modular
