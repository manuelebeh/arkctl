# Database best practices (MySQL + Laravel Eloquent)

## MySQL setup

* Configure `config/database.php` properly
* Use separate databases for each environment
* Enable MySQL strict mode (`'strict' => true`)
* Use `utf8mb4` as the default charset
* Secure credentials via `.env`
* Optimize connection pooling (`max_connections`, etc.)

## Laravel migrations

* Structure migrations clearly and consistently
* Use descriptive table and column names
* Implement foreign keys with constraints
* Use appropriate column types (`string`, `text`, `unsignedBigInteger`, etc.)
* Handle timestamps automatically (`timestamps()`)
* Add indexes (`index()`, `unique()`, `foreign()`)

## Laravel Eloquent models

* Use clear and singular model names (`User`, `Post`, etc.)
* Define relationships properly (`hasMany`, `belongsTo`, `morphTo`, etc.)
* Use `fillable` or `guarded` to protect mass assignment
* Implement casts (`$casts`, `$dates`, `$appends`)
* Use query scopes for reusable logic
* Add accessors and mutators as needed

## Eloquent queries

* Optimize queries with `select()`, `where()`, `with()`
* Load relationships efficiently (eager loading with `with()`)
* Handle transactions with `DB::transaction()`
* Implement pagination (`paginate()`, `cursorPaginate()`)
* Use aggregations (`count()`, `sum()`, `avg()`, etc.)
* Avoid N+1 problems with eager loading

## Laravel seeders & factories

* Use model factories for test data generation
* Create realistic data using Faker
* Seed related data (`User::factory()->hasPosts(5)`)
* Order seeders properly (respect foreign key dependencies)
* Avoid seeding sensitive or production-critical data automatically

## Database design (MySQL)

* Normalize data structures properly
* Implement indexes on frequently searched columns
* Use proper constraints (`NOT NULL`, `UNIQUE`, `CHECK`)
* Choose appropriate data types (`ENUM`, `BOOLEAN`, `DATETIME`, etc.)
* Define relationships with `ON DELETE CASCADE`, `ON UPDATE RESTRICT`
* Avoid unnecessary or ambiguous columns

## Performance

* Use MySQL profiling and `DB::listen()` to detect slow queries
* Avoid nested query loops
* Implement caching (`cache()`, `remember()`, Redis)
* Add indexes on frequently filtered columns
* Monitor with tools like Laravel Telescope, Laravel Debugbar, or New Relic
* Enable persistent connections only when appropriate

## Security

* Prevent SQL injection (Eloquent handles this when used properly)
* Hash passwords with `Hash::make()`
* Protect sensitive fields (`password`, `remember_token`, etc.)
* Enable CSRF protection in forms
* Use authorization (`Policies`, `Gates`) for data access
* Encrypt sensitive data using `Crypt::encrypt()`

## General

* Follow Laravel naming conventions for models and tables
* Document complex relationships clearly
* Version and structure migrations properly
* Handle errors with `try/catch` and `DB::transaction()`
* Write tests for critical data operations (`php artisan test`)
* Regularly check data integrity (foreign keys, orphaned records)
