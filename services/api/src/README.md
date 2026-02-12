# @flix/api

Backend service (auth, events, lessons, quizzes, materials).

## Database Bootstrap (Story 6.1)

Default local database file:

- `DATABASE_URL=file:.data/flix.sqlite`

Commands:

- `npm run db:migrate --workspace @flix/api`
- `npm run db:seed --workspace @flix/api`
- `npm run db:reset --workspace @flix/api`
- `npm run db:verify --workspace @flix/api`
