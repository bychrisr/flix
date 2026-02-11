# Technical Assumptions

## Repository Structure: Monorepo
- Monorepo is the required structure for MVP execution.
- Canonical boundaries:
  - `apps/web`
  - `apps/admin`
  - `services/api`
  - `packages/design-system`

## Service Architecture
- Modular monolith API in `services/api` for MVP speed and coherence.
- Domain modules: auth, events, lessons, materials, quizzes.
- Clear separation between application services, controllers/routes, and persistence adapters.

## Testing Requirements
- **Unit + Integration** for MVP.
- Unit tests for domain/business rules (release logic, quiz evaluation, validators).
- Integration tests for critical API flows (auth, event->lesson publishing, quiz submission).
- Optional E2E smoke coverage after MVP hardening.

## Additional Technical Assumptions and Requests
- Database is relational and modeled around event->lesson->material/quiz relationships.
- Upload storage abstraction must allow local development and cloud storage migration.
- Public lesson access checks must be server-authoritative.
- Design-system migration is incremental; tokens/foundations come before broader component rollout.
- KPI instrumentation points are implemented even if business thresholds are defined later.
- Gemini is the initial external API and must be wrapped behind an internal service adapter with retry/fallback behavior.
