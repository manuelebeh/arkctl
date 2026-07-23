---
name: tanstack-intent
description: >-
  Discover and wire Agent Skills shipped inside TanStack (and other
  intent-enabled) npm packages via the @tanstack/intent CLI.
---

# TanStack Intent

Use when the project depends on TanStack libraries (Query, Router, Table, Form, …) or other packages that ship Agent Skills with Intent.

## What it does

`@tanstack/intent` discovers skills from installed npm packages and wires them into agent config (`AGENTS.md`, Cursor rules, etc.). Skills stay versioned with the library instead of stale training data.

Docs: https://tanstack.com/intent

## When to run

* After adding or upgrading TanStack (or intent-enabled) dependencies
* When agents miss current library APIs or patterns
* Once per clone/setup if the team relies on package-shipped skills

## Commands

```bash
npx @tanstack/intent@latest list
npx @tanstack/intent@latest install
```

`install` updates agent guidance in place (default target often `AGENTS.md`). Use package allowlists via `package.json#intent.skills` when you need to limit which packages contribute skills.

## Notes

* Skills come from **installed** `node_modules` versions; keep lockfiles honest
* Intent is a maintainer + consumer CLI; this pack only covers the consumer `install` path
* Prefer Intent-discovered skills for library-specific how-to; keep app architecture rules in project guidelines
