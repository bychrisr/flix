# @flix/api

Backend service (auth, events, lessons, quizzes, materials).

## Database Bootstrap (Story 6.1)

Default local database file:

- `DATABASE_URL=file:.data/flix.sqlite`
- `PERSISTENCE_ADAPTER=sqlite` (default in non-test runtime)
- `DATABASE_PROFILE=local` (`managed` is also accepted for external profile wiring)

Commands:

- `npm run db:migrate --workspace @flix/api`
- `npm run db:seed --workspace @flix/api`
- `npm run db:reset --workspace @flix/api`
- `npm run db:verify --workspace @flix/api`

## Runtime Adapter

- `PERSISTENCE_ADAPTER=memory` uses in-memory repositories (default for `NODE_ENV=test`)
- `PERSISTENCE_ADAPTER=sqlite` uses persistent SQLite repositories and auto-applies migrations on app boot

## AI Branding (Story 8.1)

- Admin endpoint: `POST /api/events/:eventId/branding/generate`
- Provider abstraction via internal branding service; default provider is Gemini.
- Environment variables:
  - `BRANDING_PROVIDER` (default: `gemini`)
  - `BRANDING_PROMPT_VERSION` (default: `v1`)
  - `BRANDING_TIMEOUT_MS` (default: `9000`)
  - `BRANDING_MAX_RETRIES` (default: `2`)
  - `GEMINI_API_KEY` (optional; when unset, generation falls back to deterministic local output)
  - `GEMINI_MODEL` (default: `gemini-2.0-flash`)
