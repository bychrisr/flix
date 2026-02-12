# @flix/admin

Admin app (login, dashboard, event/lesson/quiz CRUD).

## Runtime

- Dev server: `npm run dev --workspace @flix/admin`
- API base URL env: `VITE_API_BASE_URL` (default `http://localhost:3001`)
- Authentication: `/api/admin/login` with session persisted in `sessionStorage`

## AI Branding UX (Story 8.2)

- Dashboard exposes AI branding controls (`prompt`, `styleHint`, `provider`, `fallbackOnError`).
- Generates preview via `POST /api/events/:eventId/branding/generate`.
- Admin can accept preview into form, accept+save immediately, or reject and rollback branding.
