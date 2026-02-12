# FR/NFR Coverage Matrix

Date: 2026-02-12
Scope: MVP end-to-end closure (Epics 1-8)

## Functional Requirements

| Requirement | Implementation Evidence | Validation Evidence |
|---|---|---|
| FR1 | `services/api/src/routes/admin-auth.js`, `apps/admin/src/auth/AuthContext.jsx` | `services/api/tests/integration/admin-auth.test.js`, `apps/admin/src/routes/ProtectedRoute.test.jsx` |
| FR2 | `services/api/src/routes/events.js`, `apps/admin/src/pages/DashboardPage.jsx` | `services/api/tests/integration/events-crud.test.js` |
| FR3 | `services/api/src/services/event-service.js`, `services/api/src/repositories/sqlite/event-repository.js` | `services/api/tests/integration/events-crud.test.js` |
| FR4 | `services/api/src/routes/lessons.js`, `apps/admin/src/pages/DashboardPage.jsx` | `services/api/tests/integration/lessons-crud.test.js` |
| FR5 | `services/api/src/services/lesson-service.js` | `services/api/tests/integration/public-access.test.js` |
| FR6 | `services/api/src/routes/public-access.js`, `apps/web/src/pages/CatalogPage.jsx` | `services/api/tests/integration/public-catalog.test.js` |
| FR7 | `services/api/src/services/learner-access-service.js`, `apps/web/src/pages/PlaybackPage.jsx` | `services/api/tests/integration/public-access.test.js` |
| FR8 | `apps/web/src/pages/CatalogPage.jsx` | `e2e/tests/learner-smoke.spec.mjs` |
| FR9 | `apps/web/src/pages/PlaybackPage.jsx`, `services/api/src/routes/public-access.js` | `services/api/tests/integration/public-access.test.js`, `e2e/tests/learner-smoke.spec.mjs` |
| FR10 | `services/api/src/routes/materials.js`, `apps/admin/src/pages/DashboardPage.jsx` | `services/api/tests/integration/materials-access.test.js` |
| FR11 | `services/api/src/routes/public-access.js`, `apps/web/src/pages/PlaybackPage.jsx` | `services/api/tests/integration/materials-access.test.js` |
| FR12 | `services/api/src/routes/quizzes.js`, `apps/admin/src/pages/DashboardPage.jsx` | `services/api/tests/integration/quiz-flow.test.js` |
| FR13 | `services/api/src/routes/public-access.js`, `apps/web/src/pages/PlaybackPage.jsx` | `services/api/tests/integration/quiz-flow.test.js` |
| FR14 | `services/api/src/routes/admin-dashboard.js` | `services/api/tests/integration/admin-dashboard.test.js` |
| FR15 | `services/api/src/routes/events.js`, `apps/admin/src/pages/DashboardPage.jsx`, `apps/web/src/pages/CatalogPage.jsx` | `services/api/tests/integration/events-crud.test.js`, `apps/admin/src/services/admin-api.test.js` |
| FR16 | `apps/web/src/styles.css`, `apps/admin/src/styles.css` | `e2e/tests/admin-smoke.spec.mjs`, `e2e/tests/learner-smoke.spec.mjs` |
| FR17 | `package.json` workspaces, `apps/*`, `services/*`, `packages/*` | `README.md`, `docs/architecture/unified-project-structure.md` |
| FR18 | `services/api/src/routes/*.js`, `services/api/src/plugins/error-handler.js` | `services/api/tests/integration/api-contract-regression-sqlite.test.js` |
| FR19 | `services/api/src/services/branding-service.js`, `services/api/src/services/branding-adapters/gemini-branding-adapter.js` | `services/api/tests/integration/branding-flow.test.js` |
| FR20 | `services/api/src/routes/events.js`, `services/api/src/services/event-service.js` | `services/api/tests/integration/events-crud.test.js`, `services/api/tests/integration/public-catalog.test.js` |
| FR21 | `services/api/src/services/learner-access-service.js`, `services/api/src/routes/public-access.js` | `services/api/tests/integration/public-catalog.test.js`, `services/api/tests/integration/public-access.test.js` |

## Non-Functional Requirements

| Requirement | Implementation Evidence | Validation Evidence |
|---|---|---|
| NFR1 | `services/api/src/middleware/require-admin.js`, protected routes in `services/api/src/routes/*.js` | `services/api/tests/integration/protected-route.test.js` |
| NFR2 | `zod` schemas in `services/api/src/routes/*.js` | `services/api/tests/integration/events-crud.test.js`, `services/api/tests/integration/materials-access.test.js` |
| NFR3 | `services/api/src/services/lesson-service.js` deterministic status resolution | `services/api/tests/integration/public-access.test.js` |
| NFR4 | Vite runtime apps (`apps/web`, `apps/admin`) | `npm run build --workspace @flix/web`, `npm run build --workspace @flix/admin` |
| NFR5 | Canonical DS policy and package boundary | `docs/design-system-canonical-policy.md`, `packages/design-system` |
| NFR6 | `services/api/src/services/observability-service.js` | `services/api/tests/integration/observability.test.js` |
| NFR7 | `services/api/src/services/material-service.js` validation rules | `services/api/tests/integration/materials-access.test.js` |
| NFR8 | standardized error shapes in route handlers + error plugin | `services/api/tests/integration/api-contract-regression-sqlite.test.js` |
| NFR9 | automated unit/integration/e2e scripts in workspace | `npm run test`, `npm run e2e:smoke:gate`, `.github/workflows/ci-quality-gate.yml` |
| NFR10 | `services/api/src/plugins/security.js` (`helmet`, `cors`, `rate-limit`) | `scripts/release-readiness-gate.mjs` security check |
| NFR11 | private gating in learner access and catalog/playback APIs | `services/api/tests/integration/public-catalog.test.js`, `services/api/tests/integration/public-access.test.js` |
