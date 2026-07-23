# Symfony best practices

## Layout & Flex

* Follow Symfony Flex directory layout: `src/`, `config/`, `public/`, `bin/console`
* Keep `public/index.php` as the only web entry point
* Map `App\` to `src/` via Composer PSR-4 autoload
* Use `config/packages/` for bundle configuration; keep secrets out of committed files

## Controllers & routing

* Prefer PHP attributes for routes (`#[Route(...)]`) over YAML/XML route files for app code
* Keep controllers thin: validate input, call a service or use case, return a response
* Standard Flex: `src/Controller/*Controller.php`
* Clean / hexagonal: HTTP adapters under `src/Infrastructure/Http/`

## Dependency injection

* Register services in `config/services.yaml` with `autowire: true` and `autoconfigure: true`
* Inject dependencies through constructors; avoid `$GLOBALS` and static service locators
* Exclude `src/Domain/` from autoconfigure (and usually from the resource glob) so domain stays framework-free
* Bind interfaces to implementations in `services.yaml` or via `_instanceof`

## Persistence & async

* Keep Doctrine entities, repositories, and DBAL code in Infrastructure only
* Define repository ports (interfaces) in Application; implement them in Infrastructure
* Use Symfony Messenger for async work and domain events; keep handlers in Infrastructure

## Configuration & security

* Store secrets in environment variables; reference them with `%env(...)%` in config
* Never commit `.env.local` or production credentials
* Validate and sanitize input at the HTTP boundary; map domain exceptions to HTTP responses

## Testing

* Use PHPUnit (or Pest) with `symfony/test-pack` conventions
* Unit-test Domain and Application without booting the kernel
* Use WebTestCase / Panther for HTTP integration tests when needed
* Autoload test classes via Composer `autoload-dev`

## Scope

* These guidelines assume Symfony 7+ on PHP 8.2+
* For plain PHP without Symfony, prefer `php-best-practices`
