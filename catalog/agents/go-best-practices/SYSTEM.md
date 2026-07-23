# Go best practices

## Modules & layout

* Use Go modules (`go.mod` / `go.sum`); commit `go.sum` for applications and libraries
* Put binaries under `cmd/{name}/main.go`; keep `main` thin (flags, wiring, exit codes)
* Place private code under `internal/`; use `pkg/` only for intentionally public APIs
* One package per directory; package name matches the directory (lowercase, no underscores)

## Errors & context

* Return errors; reserve `panic` for truly unrecoverable programmer bugs
* Wrap errors with `%w` so callers can use `errors.Is` / `errors.As`
* Pass `context.Context` as the first parameter on I/O and request-scoped functions
* Check and handle every error; do not discard with `_` unless documented

## Naming & style

* Avoid stuttering: `user.User` not `user.UserService` when the package already names the domain
* Use mixedCaps for exported identifiers; keep interfaces small and behavior-focused (`Reader`, `Store`)
* Run `gofmt` / `goimports` on every change; match existing file conventions
* Prefer table-driven tests with `t.Run` subtests for multiple cases

## Testing

* Colocate tests as `*_test.go` in the same package (or `_test` suffix package for black-box tests)
* Use `testing.T` helpers and `t.Helper()` in shared setup functions
* Prefer `t.Parallel()` only when tests do not share mutable state
* Use `httptest`, `sqlmock`, or fakes instead of live external services in unit tests

## Scope

* These guidelines are framework-agnostic Go
* For Ark layout rules, follow the selected architecture pack (go-internal, go-clean, go-hexagonal)
