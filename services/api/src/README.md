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
