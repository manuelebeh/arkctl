# PHP & Laravel best practices

## General conventions

* Use lowercase with dashes for directories (e.g., `app/Http/Controllers`)
* Favor dependency injection and service containers
* Follow PSR-12 coding standards
* Use `declare(strict_types=1);` at the top of PHP files
* Use PHP 8.2+ features when appropriate (e.g., typed properties, match expressions)

## Laravel structure

* Follow Laravel's directory structure and naming conventions
* Use Laravel's built-in helpers and features where possible
* Follow Laravel's MVC architecture
* Use Laravel's routing system for defining endpoints
* Use Blade templating engine for views
* Use Vite (or the project's asset pipeline) for asset compilation
* Use Laravel's localization features for multi-language support

## Error handling & validation

* Use Laravel's global exception handling (Handler)
* Use custom exceptions for domain-specific errors
* Use `try-catch` blocks for expected failures
* Use Laravel's validation via `FormRequest` or `Validator`
* Implement middleware for request filtering, auth, and data transformation

## Database & ORM

See the `laravel-database` agent for MySQL + Eloquent details.

## Architecture & design

* Use Repository pattern for data access layer when it adds clarity
* Implement service classes for business logic
* Use Events and Listeners for decoupled logic
* Implement Job queues for long-running tasks (`dispatch`, `queue`)
* Use Laravel's built-in scheduler for recurring tasks (`schedule`)

## Security

* Implement CSRF protection (handled by default in Blade forms)
* Use Laravel's built-in authentication (`Auth::`) and authorization (`Gate`, `Policy`)
* Use environment variables (`.env`) to store sensitive data
* Avoid exposing sensitive error details in production
* Sanitize and validate all input data

## Testing

* Use Laravel's testing tools: `PHPUnit`, `Dusk` for feature/browser tests
* Test controllers, services, models, and database interactions
* Use factories and seeders to generate test data

## Performance

* Use Laravel's caching (`cache()`, Redis, tags, etc.)
* Optimize database queries with eager loading (`with()`)
* Use `config:cache`, `route:cache`, `view:cache` in production
* Minimize N+1 queries using `with`, `load`, and proper relationships

## Dependencies & tools

* Use the latest stable version of Laravel
* Manage dependencies via Composer
* Follow semantic versioning for package versions
* Regularly run `composer audit` to check for vulnerabilities
