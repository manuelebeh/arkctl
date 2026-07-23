# Database best practices (Django ORM)

## Models

* Use singular model names (`User`, `Hospital`); table names plural via `Meta.db_table` only when needed
* Prefer explicit `ForeignKey` / `OneToOne` / `ManyToMany` with clear `related_name`
* Set `on_delete` deliberately (`CASCADE`, `PROTECT`, `SET_NULL`, …)
* Use `UniqueConstraint` / `CheckConstraint` in `Meta.constraints` for integrity
* Keep `blank` / `null` consistent with the real domain (avoid `null=True` on string fields)
* Use `TextChoices` / `IntegerChoices` instead of magic strings
* Put reusable query logic on custom `QuerySet` / `Manager` classes

## Migrations

* One logical change per migration when practical
* Never edit a migration already applied in shared environments; add a new one
* Name migrations descriptively (`0007_add_hospital_geo_index`)
* Add indexes in migrations for columns used in filters and joins
* Review data migrations carefully; keep them idempotent when possible
* Run `makemigrations --check` / `migrate --plan` in CI

## QuerySets

* Prefer `select_related` for FK/O2O and `prefetch_related` for M2M / reverse FK
* Use `only()` / `defer()` when loading wide rows for list views
* Prefer `exists()` / `count()` over materializing full querysets
* Chain filters; avoid evaluating querysets early in loops
* Use `annotate()` / `aggregate()` for DB-side computation
* Wrap multi-step writes in `transaction.atomic()`

## Admin

* Register models with focused `ModelAdmin` (list_display, search_fields, list_filter)
* Use `readonly_fields` for derived or sensitive values
* Limit admin write access with permissions
* Avoid heavy querysets in admin without `select_related` / `prefetch_related`

## Performance

* Log or assert query counts in tests for hot paths
* Index foreign keys and frequent filter columns
* Bulk create/update with `bulk_create` / `bulk_update` when callbacks are not required
* Prefer DB constraints over application-only uniqueness checks

## Security

* Never interpolate user input into raw SQL; use params or the ORM
* Exclude secrets from `__str__`, serializers, and admin list displays
* Authorize before returning querysets (filter by ownership / tenant)

## Testing

* Test constraints (unique, protect) and cascade behavior
* Cover custom managers and critical QuerySet helpers
* Use `TransactionTestCase` when testing transaction edge cases
