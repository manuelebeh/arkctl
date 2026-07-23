# FastAPI best practices

## Project structure

* Organize by domain module under `src/<domain>/` (router, schemas, services, models)
* Keep a thin `main.py` / app factory that mounts routers and lifespan
* Share cross-cutting code in `core/` (config, DB session, auth deps, middleware)
* Use lowercase snake_case for packages and modules (`routers/user_routes.py`)
* Prefer functions and Pydantic models over heavy class hierarchies

## Routers & API design

* Split routes with `APIRouter`; include them with clear prefixes and tags
* Use correct HTTP methods and status codes (`201` create, `204` delete, `404` missing)
* Declare response models explicitly; avoid returning raw dicts from handlers
* Keep handlers thin: validate → call service → return schema
* Document public APIs so OpenAPI stays accurate (clients often generate from it)

## Dependencies & layering

* Use FastAPI `Depends` for DB sessions, current user, and shared resources
* Layer as router → service → repository/ORM; do not put SQL in route handlers
* Prefer Receive an Object, Return an Object (RORO) at service boundaries
* Type-hint all public function signatures

## Models & validation

* Use Pydantic `BaseModel` for request and response schemas
* Separate ORM models from API schemas when fields diverge
* Validate early; reject invalid input before side effects
* Use `def` for CPU-bound pure helpers; `async def` for I/O-bound work

## Database

* Prefer SQLAlchemy (async session) + Alembic migrations for relational data
* Scope one session per request via `Depends`
* Use transactions for multi-step writes
* Avoid N+1: eager-load relationships or batch queries
* Handle integrity errors and map them to clear HTTP responses

## Auth & security

* Prefer OAuth2 / JWT patterns FastAPI documents; hash passwords with a proven library
* Enforce roles/permissions in dependencies, not ad hoc checks deep in services
* Enable CORS deliberately; do not use `*` with credentials
* Use `HTTPException` for expected failures; middleware for unexpected errors and logging
* Guard clauses and early returns; happy path last

## Lifespan & async

* Prefer lifespan context managers over deprecated `@app.on_event("startup"|"shutdown")`
* Keep route handlers non-blocking: async DB and HTTP clients for external I/O
* Use background tasks sparingly for work that must not block the response

## Testing

* Use `TestClient` or `httpx.AsyncClient` with pytest-asyncio
* Fixture the app, DB, and auth overrides via `dependency_overrides`
* Cover auth failures, validation errors, and domain edge cases

## Performance

* Cache hot read paths when correctness allows
* Stream or paginate large payloads
* Measure latency on critical endpoints; fix blocking calls first

## Key conventions

* Named exports for routers and utilities
* Descriptive booleans (`is_active`, `has_permission`)
* Keep OpenAPI exportable as the source of truth for generated clients
