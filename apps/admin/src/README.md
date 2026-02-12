# @flix/admin

Admin app (login, dashboard, event/lesson/quiz CRUD).

## Runtime

- Dev server: `npm run dev --workspace @flix/admin`
- API base URL env: `VITE_API_BASE_URL` (default `http://localhost:3001`)
- Authentication: `/api/admin/login` with session persisted in `sessionStorage`
