# End-to-End Gap Closure Plan (Architect)

Date: 2026-02-12
Objective: close all MVP gaps so the project can be run locally and used end-to-end by admin and learner personas.

## 1) Current State Summary

Completed
- API core domain flows exist: auth, events, lessons, public catalog/access, playback, materials, quiz, observability.
- Stories 1.x to 5.x are in `Review`.
- Security baseline exists (CORS, rate-limit, production helmet) and release gate script reports GO for current backend baseline.

Critical Gaps
- FR19 not implemented: no Gemini branding/logo generation adapter/API flow.
- Web/Admin are static responsive baselines, not real integrated apps.
- No persistent storage layer: services are in-memory only.
- Story lifecycle not finalized (`Review` -> `Done`).

Additional Gaps Found
- No production-ready frontend runtime/build (apps still echo/scaffold scripts).
- No explicit E2E UI automation for real browser journeys.
- No migration/seed strategy for reproducible local data.

## 2) Target End State (Definition of Ready-to-Use App)

A new developer can run:
1. `npm install`
2. `npm run dev` (or compose equivalent)
3. open web/admin URLs
4. log in as admin, create event + lesson + materials + quiz
5. open learner flow, pass access checks, watch playback, access materials, submit quiz

And all data persists across server restarts.

## 3) Execution Streams

### Stream A - Runtime Foundation and Persistence (must come first)
Scope
- Replace in-memory maps with persistent Postgres/Supabase repositories.
- Add schema migrations and seed scripts.
- Keep API contracts backward-compatible.

Deliverables
- Database schema + migration runner.
- Repository interfaces + concrete adapters.
- Local bootstrap command (`db:migrate`, `db:seed`).

Acceptance
- Restarting API does not lose events/lessons/materials/quizzes.
- Integration tests pass against real DB adapter in CI/local.

### Stream B - Gemini Branding Integration (FR19)
Scope
- Introduce provider-agnostic AI branding service interface.
- Implement Gemini adapter with retry/timeout/fallback.
- Add admin endpoint/workflow for logo generation and persistence in event metadata.

Deliverables
- `branding-service` domain module.
- `/api/events/:eventId/branding/logo:generate` (or equivalent) with auth.
- Configurable provider via env (`GEMINI_API_KEY`, model, timeout).

Acceptance
- Admin can request logo generation and persist result.
- Failures are handled with structured errors and observability events.
- Integration tests cover success/failure/timeouts.

### Stream C - Real Frontend Apps (web + admin)
Scope
- Convert static HTML baselines into real applications (recommended: Vite + React).
- Wire to existing API contracts.
- Preserve canonical token consumption from `packages/design-system`.

Deliverables
- Admin app pages: login, events list/form, lessons list/form, materials upload/list, quiz CRUD, branding trigger.
- Web app pages: event landing/catalog, lesson playback, materials list/download, quiz execution/result.
- Runtime env config (`VITE_API_BASE_URL`).

Acceptance
- End-to-end user journeys executable manually from browser.
- No hardcoded endpoint assumptions; env-driven base URL.

### Stream D - QA Hardening and Productization
Scope
- Move story statuses `Review -> Done` with evidence.
- Add browser E2E smoke tests for admin + learner happy path.
- Expand release gate to include frontend build + E2E smoke.

Deliverables
- Playwright/Cypress smoke suite.
- Updated release checklist and blocking policy.
- CI pipeline command sequence for app-level validation.

Acceptance
- `release:readiness` fails if frontend build or smoke E2E fails.
- All MVP FR/NFR are mapped to automated/manual evidence.

## 4) Recommended Story Pack (Sprint 6+)

### Epic 6 - Production Runtime Enablement
- 6.1 DB schema + migrations + seeds.
- 6.2 Repository refactor for events/lessons/materials/quizzes.
- 6.3 API adapter switch from in-memory to DB.
- 6.4 Data integrity + regression integration tests.

### Epic 7 - Frontend Delivery
- 7.1 Admin app bootstrap + auth shell.
- 7.2 Admin event/lesson/material/quiz flows.
- 7.3 Learner web catalog + playback + access enforcement UX.
- 7.4 Learner materials + quiz execution/result UX.

### Epic 8 - AI Branding + Readiness Closure
- 8.1 Gemini branding adapter and endpoint.
- 8.2 Branding UI integration in admin event flow.
- 8.3 Browser E2E smoke tests and release gate expansion.
- 8.4 Final compliance pass and story closure (`Done`).

## 5) Dependency Order (Critical Path)
1. Stream A (persistence) 
2. Stream B (Gemini adapter)
3. Stream C (real frontend)
4. Stream D (E2E + readiness closure)

Parallelism allowed
- C can start UI scaffolding in parallel with A, but API integration should wait for stable DB-backed contracts.
- B can be implemented in parallel with C after auth/event persistence is stable.

## 6) Risks and Mitigations
- Risk: Contract drift between frontend and API during refactor.
  - Mitigation: OpenAPI snapshot + contract tests before UI integration.
- Risk: Gemini quota/latency instability.
  - Mitigation: retries, timeout, circuit-breaker/fallback placeholder logo.
- Risk: scope inflation from design-system polish.
  - Mitigation: freeze MVP component set and postpone non-critical visual refinements.

## 7) Completion Gate (Must Be True)
- FR1..FR21 covered with evidence; no open critical requirement.
- NFR1..NFR11 covered with test/log/review evidence.
- All stories moved to `Done`.
- One-command local run documented and validated on clean environment.

## 8) Immediate Next Action
- Start Epic 6, Story 6.1 on a dedicated branch and deliver DB migration baseline first.
