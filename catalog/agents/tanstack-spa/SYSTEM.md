# TanStack SPA conventions

Guidelines for React SPAs that use TanStack Router and Query (Vite or similar). Not tied to a specific product.

## Stack split

* **TanStack Router** for URL state and file-based (or code-based) routes
* **TanStack Query** for server/async data (fetch, cache, invalidation)
* Keep **client-only** UI state (auth token in memory, modals, prefs) out of Query; a small store (e.g. Zustand) is fine
* Do not put server-fetched lists or entities into a global client store

## Feature layout

```
src/features/<domain>/   # api, queries, components
src/routes/              # route files / pathless layouts
src/shared/              # UI primitives, HTTP client, hooks
```

* Colocate domain API helpers and query hooks under `features/<domain>/`
* Keep route files thin: wire loaders/components, defer business UI to features
* Shared UI that is truly cross-domain lives in `shared/`, not inside a random feature

## Data fetching

* Define stable query keys; invalidate on mutations that change that data
* Prefer Query's `enabled` / dependent queries over fetching in `useEffect`
* Handle loading and error states at the feature or route boundary
* Paginate or infinite-query large lists instead of loading everything

## API clients

* Prefer a generated OpenAPI/Orval (or similar) client when the backend publishes a schema
* **Do not hand-edit generated client files**; change the schema or generator config, then regenerate
* After backend OpenAPI changes, regenerate clients as part of the same PR when possible
* Keep the API base URL in env (`VITE_*` / `NEXT_PUBLIC_*`); paths stay versioned (`/api/v1/...`)

## Forms & tables

* TanStack Form or your chosen form lib for complex forms; validate at the edge
* TanStack Table for dense admin grids; keep column defs close to the feature

## Testing

* Unit-test features with Router + Query providers in the test utils
* Prefer mocking the API module or MSW over hitting a real backend in unit tests

## Do not

* Duplicate server state in both Query and a global store
* Hardcode user-facing copy when the project has an i18n pipeline
* Bypass the generated client with one-off `fetch` calls for the same resources
