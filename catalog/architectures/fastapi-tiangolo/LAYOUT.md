# FastAPI Tiangolo layout

Starter layout aligned with [fastapi/full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template): routes under `app/api/`, persistence helpers in `app/crud.py`, SQLModel/ORM types in `app/models.py`, shared config in `app/core/`.

## Rules of thumb

1. Routers live in `app/api/` (versioned packages optional).
2. Database create/update helpers live in `app/crud.py` (or a small crud package).
3. Shared settings / DB engine live in `app/core/`.
4. Keep `main.py` boring: create the app and include routers.

## Typical shape

```text
app/
  main.py
  models.py
  crud.py
  api/
    main.py
    routes/
  core/
    config.py
    db.py
```
