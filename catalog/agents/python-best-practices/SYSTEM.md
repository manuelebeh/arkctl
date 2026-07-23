# Python best practices

## Packaging & layout

* Prefer `src/<package>/` for importable code; keep tests outside the package
* Declare the project in `pyproject.toml` (build backend, dependencies, tools)
* Use a virtual environment per project (`uv`, `venv`, or `poetry`); never install into system Python for app work
* Keep scripts entry points explicit (`[project.scripts]` or `__main__.py`)

## Style & typing

* Follow PEP 8; use Ruff (lint/format) when available
* Add type hints on public functions; run MyPy or Pyright in CI when the project already does
* Prefer built-in generics (`list[str]`, `dict[str, int]`) on modern Python
* Avoid bare `except:`; catch specific exceptions

## Testing

* Use pytest as the default runner
* Isolate unit tests from network and real DB unless marked integration
* Prefer fixtures over global mutable state
* Aim for fast feedback; mark slow tests explicitly

## Tooling

* Pin runtime and tool versions (`.python-version`, mise, or lockfiles)
* Use Ruff for lint/format and MyPy for types when adopting a toolchain
* Run `pip audit` / `uv pip audit` periodically on locked deps

## Logging & config

* Configure logging once at process start; use module loggers (`logging.getLogger(__name__)`)
* Load secrets from the environment; do not hardcode credentials
* Prefer structured log messages over concatenated debug prints

## Concurrency & I/O

* Use `async` only when the stack is async end-to-end; do not mix blocking I/O in async handlers
* Prefer stdlib and well-maintained libraries over one-off utilities

## Scope

* These guidelines are framework-agnostic
* For Django or FastAPI APIs, prefer the stack-specific agents (`django-best-practices`, `fastapi-best-practices`)
