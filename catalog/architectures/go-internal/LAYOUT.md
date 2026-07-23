# Go internal layout

Standard Go module structure: `cmd/` holds thin `main` packages; library and application code lives under `internal/` (not importable by other modules).

## Rules of thumb

1. Keep `cmd/` thin: parse flags, wire dependencies, call into `internal/`.
2. Put private implementation packages under `internal/`; export only what callers need.
3. Use `pkg/` for code you intend to expose to other modules (optional).
4. Optional `api/` for OpenAPI/Protobuf contracts; `docs/` and `tooling/` for supporting assets.

## Typical shape

```text
cmd/
  myapp/
    main.go
internal/
  greeter/
    greeter.go
go.mod
```
