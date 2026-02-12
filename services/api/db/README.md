# API Database Baseline

Versioned SQL migrations live in `services/api/db/migrations`.

## Migration strategy

- Files are applied in lexical order (`001_*.sql`, `002_*.sql`, ...).
- Applied migrations are tracked in `schema_migrations`.
- Checksum mismatch fails fast to prevent drift.

## Seed baseline

`db:seed` populates a minimum deterministic dataset for:

- admin auth context (`admins`)
- public/private events
- released lessons
- lesson material attachment
- quiz with questions/options

This baseline enables end-to-end admin and learner smoke flows.

For richer local manual testing, use `db:seed:mock` / `db:reset:mock` to populate:

- multiple public/private events
- released, locked, and expired lessons
- materials in multiple lessons
- quizzes prepared for full submission flow
