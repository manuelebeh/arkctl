# PHP best practices

## Language & style

* Use `declare(strict_types=1);` at the top of PHP files
* Follow PSR-12 coding style
* Prefer PHP 8.2+ features when the runtime allows (typed properties, `match`, enums, readonly)
* Use lowercase dash or PSR-4 namespace directories consistently with Composer autoload

## Composer & packages

* Manage dependencies with Composer; commit `composer.lock` for applications
* Prefer stable releases; run `composer audit` regularly
* Map namespaces in `composer.json` `autoload` / `autoload-dev` (PSR-4)
* Keep `vendor/` out of version control

## Structure

* Separate public front controller (`public/index.php`) from application code
* Keep domain/application code out of the web root
* Favor small classes with clear constructors and dependency injection over globals
* Avoid static mutable state for request-scoped data

## Errors & validation

* Throw domain-specific exceptions; map them at the HTTP boundary
* Validate input at the edge (request / CLI args) before touching persistence
* Do not expose stack traces or secrets in production responses

## Security

* Store secrets in environment variables
* Hash passwords with `password_hash` / `password_verify`
* Escape output for the target context (HTML, SQL via prepared statements, shell)
* Use prepared statements / query builders; never concatenate untrusted SQL

## Testing

* Use PHPUnit (or Pest) for automated tests
* Keep unit tests free of real network/DB unless marked integration
* Autoload test namespaces via Composer `autoload-dev`

## Scope

* These guidelines are framework-agnostic (plain PHP)
* For Laravel apps, prefer `laravel-best-practices` and `laravel-database`
