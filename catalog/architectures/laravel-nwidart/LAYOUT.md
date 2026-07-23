# Laravel modules (nwidart)

Modules live under `Modules/{Module}/`. Each module mirrors a small Laravel package: providers, routes, models, migrations.

## Rules of thumb

1. New capability → `php artisan module:make Name` (or a new folder under `Modules/`).
2. Keep modules loosely coupled; prefer events/contracts over reaching into another module's internals.
3. Autoload via `wikimedia/composer-merge-plugin` (`Modules/*/composer.json`).
4. Run `composer dump-autoload` after adding modules.

## Typical module shape

```text
Modules/
  Accounts/
    app/
      Providers/
      Http/
      Models/
    routes/
      web.php
      api.php
    database/
    module.json
    composer.json
```

See https://laravelmodules.com/docs/12/getting-started/introduction
