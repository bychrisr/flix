# Smoke Test Plan

## Admin Flow
1. Login via `POST /api/admin/login`.
2. Create event via `POST /api/events`.
3. Create lesson via `POST /api/events/:eventId/lessons`.
4. Create materials and quiz for lesson.

## Learner Flow
1. Catalog fetch via `POST /api/public/events/:eventSlug/catalog`.
2. Access check and playback via public lesson endpoints.
3. Materials listing for released lesson.
4. Quiz fetch and submit with score result.

## Execution
- Automated by API integration tests and release readiness gate script.
