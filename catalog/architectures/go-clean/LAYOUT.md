# Go clean architecture

Clean layers under `internal/`: pure domain, use cases in application, I/O adapters in infrastructure. `cmd/` wires the binary.

## Rules of thumb

1. Domain imports nothing from application or infrastructure.
2. Application depends on domain types and defines ports (interfaces).
3. Infrastructure implements ports (console, HTTP, DB, external APIs).
4. Keep `cmd/` thin; compose layers in main or a small wiring package.

## Typical shape

```text
cmd/
  myapp/
    main.go
internal/
  domain/
  application/
  infrastructure/
    console/
go.mod
```
