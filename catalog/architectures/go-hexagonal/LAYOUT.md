# Go hexagonal

Ports and adapters under `internal/`: pure domain, use cases in application, adapters at the edge. Split adapters into inbound (CLI, HTTP handlers) and outbound (DB, APIs, messaging).

## Rules of thumb

1. Domain stays pure; no adapter or framework imports.
2. Application defines ports (interfaces) and orchestrates use cases.
3. Inbound adapters drive the application (CLI, HTTP, gRPC).
4. Outbound adapters implement persistence and external service ports.
5. Keep `cmd/` thin; wire adapters and use cases in main.

## Typical shape

```text
cmd/
  myapp/
    main.go
internal/
  domain/
  application/
  adapters/
    inbound/
      cli/
    outbound/
      console/
go.mod
```
