# flix

Monorepo scaffold for the Flix platform.

## Workspace Structure

```txt
apps/
  web/            # Public app (catalog, hero, player, quiz)
  admin/          # Admin app (dashboard, events, lessons, quizzes)
packages/
  design-system/  # Canonical DS package for the monorepo
services/
  api/            # Backend service
design-system/    # Legacy/reference docs and extracted assets (non-canonical)
docs/
```

## Getting Started

```bash
npm install
npm run dev
```

## Scoped Commands

```bash
npm run dev:web
npm run dev:admin
npm run dev:api
```

## Quality Gates

```bash
npm run ci:local
npm run e2e:smoke
npm run e2e:smoke:gate
npm run release:readiness
```

## Documentation

- `docs/design-system-extraction.md` (what can be migrated from legacy DS)
- `docs/stories`
- `docs/architecture`
- `docs/guides`
