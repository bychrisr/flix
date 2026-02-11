# Flix Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Deliver a complete MVP for infoproduct creators to launch and manage course journeys end-to-end.
- Provide a premium streaming-like learning experience with release-window control per lesson.
- Centralize admin operations (events, lessons, materials, quizzes) in a single platform.
- Ensure consistent UI foundations across public and admin apps through a shared design-system package.

### Background Context
Flix addresses a common operational gap for infoproduct creators: course launch workflows are usually fragmented across multiple tools for hosting, release scheduling, student experience, and assessments. This increases setup complexity and creates inconsistent learner journeys.

The product direction is to provide a unified platform where admins can configure events and lesson timelines, while learners consume content in a streaming-inspired interface with clear release status, lesson progression, and supporting resources. The project already established a monorepo baseline and a migration path for a canonical design-system package.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-02-11 | 0.1 | Initial PRD draft from approved Project Brief | PM (@pm flow) |

## Requirements

### Functional
1. **FR1:** The system must provide admin authentication with secure session/token handling.
2. **FR2:** The system must allow admins to create, edit, list, activate/deactivate, and delete events.
3. **FR3:** The system must allow admins to define event metadata including title, slug, hero descriptions, cover media, and visual style configuration.
4. **FR4:** The system must allow admins to create, edit, list, and delete lessons linked to events.
5. **FR5:** The system must support lesson release windows via `release_at` and optional `access_expires_at`.
6. **FR6:** The public catalog must display lesson status as `released`, `locked`, or `expired` based on server-side time validation.
7. **FR7:** The system must prevent playback access to locked or expired lessons and provide user-facing status messaging.
8. **FR8:** The system must render an event landing experience with hero section, event context, and lesson catalog navigation.
9. **FR9:** The lesson page must provide embedded video playback and navigation to adjacent lessons.
10. **FR10:** The system must allow admins to upload and manage support materials per lesson.
11. **FR11:** Learners must be able to list and download support materials available for released lessons.
12. **FR12:** The system must allow admins to create and manage quizzes with questions, options, and correct answers.
13. **FR13:** Learners must be able to submit quiz responses and receive immediate result feedback.
14. **FR14:** The platform must expose admin metrics for core operational visibility (events, lessons, release status baseline).
15. **FR15:** The system must support visual customization inputs for event branding and apply them in the public experience.
16. **FR16:** The system must support responsive behavior across desktop, tablet, and mobile for core user journeys.
17. **FR17:** The codebase must run as a monorepo with separate app/service boundaries (`apps/web`, `apps/admin`, `services/api`, `packages/design-system`).
18. **FR18:** The system must provide API contracts for auth, events, lessons, materials, and quizzes with consistent validation/error patterns.
19. **FR19:** The system must integrate Gemini API as the initial external AI provider for event logo generation and related AI-assisted branding actions.
20. **FR20:** The system must allow each journey/event to be configured as `public` or `private`.
21. **FR21:** The system must enforce access control for private journeys/events before exposing event details, lesson catalog, or playback.

### Non Functional
1. **NFR1:** All protected endpoints must enforce authentication and authorization checks.
2. **NFR2:** All write operations must validate payload shape and business rules server-side.
3. **NFR3:** The release-window logic must be deterministic and timezone-safe.
4. **NFR4:** Core pages (catalog and lesson) should target performant load behavior on modern devices.
5. **NFR5:** The UI must maintain consistent token-driven styling through the canonical design-system package.
6. **NFR6:** The system must implement structured logging for critical auth/content operations.
7. **NFR7:** File upload handling must validate type/size and reject unsafe payloads.
8. **NFR8:** API responses must be standardized to support predictable frontend error handling.
9. **NFR9:** The codebase must support automated test execution at least for unit and integration layers in MVP.
10. **NFR10:** Security headers and baseline anti-abuse controls (rate limiting/CORS policy) must be enabled in production configuration.
11. **NFR11:** Private journey/event data must never be exposed by public endpoints without successful access validation.

## User Interface Design Goals

### Overall UX Vision
Deliver a streaming-inspired learning experience that feels premium, clear, and conversion-oriented for infoproduct launches, while keeping admin workflows practical and low-friction.

### Key Interaction Paradigms
- Catalog-first discovery with strong visual hierarchy.
- Lesson gating by time window with explicit status communication.
- Direct progression from event overview to lesson playback.
- Admin CRUD workflows optimized for repeated publishing operations.

### Core Screens and Views
- Admin Login
- Admin Dashboard
- Event List and Event Form
- Lesson List and Lesson Form
- Quiz List and Quiz Form
- Public Event Landing (Hero + Catalog)
- Lesson Playback Page
- Materials View
- Quiz Execution and Quiz Result View

### Accessibility: WCAG AA
- Target baseline WCAG AA for color contrast and keyboard navigation in core flows.

### Branding
- Netflix-inspired visual direction as product identity baseline.
- Canonical branding implementation must come from `packages/design-system`.
- Existing `design-system/` folder is reference-only input for migration.

### Target Device and Platforms: Web Responsive
- Primary target: responsive web for desktop/tablet/mobile.

## Technical Assumptions

### Repository Structure: Monorepo
- Monorepo is the required structure for MVP execution.
- Canonical boundaries:
  - `apps/web`
  - `apps/admin`
  - `services/api`
  - `packages/design-system`

### Service Architecture
- Modular monolith API in `services/api` for MVP speed and coherence.
- Domain modules: auth, events, lessons, materials, quizzes.
- Clear separation between application services, controllers/routes, and persistence adapters.

### Testing Requirements
- **Unit + Integration** for MVP.
- Unit tests for domain/business rules (release logic, quiz evaluation, validators).
- Integration tests for critical API flows (auth, event->lesson publishing, quiz submission).
- Optional E2E smoke coverage after MVP hardening.

### Additional Technical Assumptions and Requests
- Database is relational and modeled around event->lesson->material/quiz relationships.
- Upload storage abstraction must allow local development and cloud storage migration.
- Public lesson access checks must be server-authoritative.
- Design-system migration is incremental; tokens/foundations come before broader component rollout.
- KPI instrumentation points are implemented even if business thresholds are defined later.
- Gemini is the initial external API and must be wrapped behind an internal service adapter with retry/fallback behavior.

## Epic List
1. **Epic 1: Platform Foundation and Security Baseline**  
   Goal: Establish monorepo, API/application skeleton, auth foundation, and operational baseline needed for all downstream work.
2. **Epic 2: Admin Content Operations (Events and Lessons)**  
   Goal: Enable admins to configure events and lesson timelines with validated publishing workflows.
3. **Epic 3: Learner Experience Core (Catalog and Playback)**  
   Goal: Deliver public event/lesson experience with release-window enforcement and reliable playback journey.
4. **Epic 4: Learning Complements (Materials and Quiz)**  
   Goal: Complete learning cycle with support materials and assessment workflows.
5. **Epic 5: UX Consistency, Responsiveness, and Productization**  
   Goal: Apply design-system foundations, responsive refinements, and production-readiness controls across user journeys.

## Epic 1 Platform Foundation and Security Baseline
Epic goal: Build the technical and operational foundation so all subsequent functionality can be delivered safely and consistently. This epic must produce a runnable baseline with initial value, not just setup.

### Story 1.1 Monorepo Runtime Baseline
As a development team,
I want a runnable monorepo baseline with workspace-level scripts,
so that web, admin, api, and design-system can evolve in parallel without setup drift.

#### Acceptance Criteria
1. Root workspace scripts execute per package and report clear status.
2. Workspace boundaries map to `apps/web`, `apps/admin`, `services/api`, `packages/design-system`.
3. Basic package-level start/build/test placeholders are present and runnable.

### Story 1.2 API Skeleton and Health Contract
As a platform engineer,
I want an API service skeleton with health contract,
so that we have a deployable backend slice from the first epic.

#### Acceptance Criteria
1. API service exposes a health endpoint with deterministic success response.
2. Request parsing, error handling middleware, and route module structure are in place.
3. Health endpoint is covered by an integration test.

### Story 1.3 Admin Authentication Foundation
As an admin user,
I want secure login and protected admin session handling,
so that only authorized users can manage platform content.

#### Acceptance Criteria
1. Login endpoint validates credentials and returns secure auth context.
2. Protected routes reject unauthenticated requests.
3. Auth failure scenarios return standardized errors.

### Story 1.4 Security and Validation Baseline
As a platform owner,
I want baseline security controls active from day one,
so that MVP features are built on a safe foundation.

#### Acceptance Criteria
1. Input validation is enforced for write endpoints.
2. CORS and rate-limit policies are configurable by environment.
3. Security headers baseline is enabled in production profile.

## Epic 2 Admin Content Operations (Events and Lessons)
Epic goal: Enable complete administrative control over event and lesson lifecycle, including release scheduling logic as core business capability. This epic creates the content operations backbone of the product.

### Story 2.1 Event CRUD and Listing
As an admin,
I want to create and manage events,
so that I can define distinct course launches and their metadata.

#### Acceptance Criteria
1. Admin can create, update, list, and delete events.
2. Event uniqueness constraints (e.g., slug) are enforced.
3. Event activation state is represented and editable.
4. Event visibility (`public` or `private`) is represented and editable.

### Story 2.2 Event Visual and Hero Configuration
As an admin,
I want to configure visual metadata for event presentation,
so that each launch can be branded and differentiated.

#### Acceptance Criteria
1. Event form supports hero text and visual style configuration fields.
2. Stored visual configuration is retrievable through event APIs.
3. Validation prevents malformed style payloads.

### Story 2.3 Lesson CRUD with Release Window Rules
As an admin,
I want to schedule lesson release and optional expiration dates,
so that content availability follows launch strategy.

#### Acceptance Criteria
1. Admin can create, update, list, and delete lessons linked to an event.
2. Release datetime is required and expiration datetime is optional.
3. Business validation rejects invalid date windows.

### Story 2.4 Admin Dashboard Operational Snapshot
As an admin,
I want dashboard-level operational metrics,
so that I can quickly understand platform publishing status.

#### Acceptance Criteria
1. Dashboard exposes counts for events and lessons.
2. Dashboard shows lesson release status distribution baseline.
3. Data is sourced from API endpoints with auth protection.

## Epic 3 Learner Experience Core (Catalog and Playback)
Epic goal: Deliver the primary learner-facing journey from event landing to lesson playback with strict release window enforcement. This epic is the core value delivery for student consumption.

### Story 3.1 Public Event Landing and Catalog
As a learner,
I want to browse an event and its lessons in a clear catalog,
so that I can understand available and upcoming content.

#### Acceptance Criteria
1. Event landing displays hero content and lesson catalog.
2. Each lesson card displays status: released, locked, or expired.
3. Catalog rendering consumes API data and handles empty/error states.
4. Private events require successful access validation before catalog rendering.

### Story 3.2 Release-Window Access Enforcement
As a platform owner,
I want server-authoritative release checks for lesson access,
so that learners cannot bypass content gating rules.

#### Acceptance Criteria
1. Access endpoint returns consistent authorization based on release/expiry windows.
2. Locked and expired lessons are blocked from playback route access.
3. User-facing status messaging is returned for blocked scenarios.
4. Private event access rules are validated together with release-window checks.

### Story 3.3 Lesson Playback Experience
As a learner,
I want a stable lesson page with embedded playback,
so that I can consume content smoothly.

#### Acceptance Criteria
1. Lesson page renders video player for authorized lessons.
2. Adjacent lesson navigation (previous/next) is available when applicable.
3. Basic anti-abuse/embed constraints are applied in player integration.

### Story 3.4 Release Countdown and Status Clarity
As a learner,
I want clear countdown/status cues for upcoming lessons,
so that I know when content will unlock.

#### Acceptance Criteria
1. Countdown UI appears when lesson is not yet released.
2. Countdown is derived from server timestamps to avoid client drift issues.
3. Status transitions are reflected correctly after release time.

## Epic 4 Learning Complements (Materials and Quiz)
Epic goal: Complete the learning workflow by adding support content and assessment capability. This epic expands engagement and practical course delivery completeness.

### Story 4.1 Materials Upload and Attachment (Admin)
As an admin,
I want to upload support files per lesson,
so that learners can access complementary resources.

#### Acceptance Criteria
1. Admin can upload multiple files to a lesson.
2. File type and size validation is enforced.
3. Uploaded assets are linked and retrievable per lesson.

### Story 4.2 Materials Access (Learner)
As a learner,
I want to view and download available lesson materials,
so that I can use supporting documents during study.

#### Acceptance Criteria
1. Materials list is visible for released lessons.
2. Download links resolve to valid files.
3. Access respects lesson availability rules.

### Story 4.3 Quiz Authoring (Admin)
As an admin,
I want to create quizzes with questions and options,
so that I can assess learner comprehension.

#### Acceptance Criteria
1. Quiz CRUD supports multiple questions and options.
2. Validation enforces at least one correct option per question.
3. Quiz structure persists consistently in database relations.

### Story 4.4 Quiz Submission and Result (Learner)
As a learner,
I want to submit quiz answers and get a result,
so that I can validate understanding immediately.

#### Acceptance Criteria
1. Learner can submit one quiz attempt payload per flow.
2. System calculates score and pass/fail outcome.
3. Result view displays score summary and status.

## Epic 5 UX Consistency, Responsiveness, and Productization
Epic goal: Harden user experience quality and product readiness by applying shared design foundations, responsive quality, and observability/security refinements. This epic turns feature-complete MVP into releasable MVP.

### Story 5.1 Canonical Design-System Token Adoption
As a product team,
I want canonical token usage from `packages/design-system`,
so that UI consistency scales across web and admin apps.

#### Acceptance Criteria
1. Color/typography/foundation tokens are consumed from canonical package.
2. Legacy `design-system/` folder is treated as reference-only input.
3. Token usage replaces ad-hoc hardcoded styling in core screens.

### Story 5.2 Responsive Quality Pass
As a learner and admin,
I want core workflows usable across desktop/tablet/mobile,
so that platform value is maintained on all target devices.

#### Acceptance Criteria
1. Core screens meet responsive layout expectations for web breakpoints.
2. Navigation and form interactions remain usable on mobile.
3. Playback and catalog views preserve clarity across breakpoints.

### Story 5.3 Operational Logging and KPI Event Hooks
As a product owner,
I want baseline observability and KPI instrumentation points,
so that we can monitor usage and define success thresholds iteratively.

#### Acceptance Criteria
1. Critical events (auth, lesson access, quiz completion) emit structured logs.
2. KPI hook points are implemented for later metric thresholds.
3. Errors in critical flows are traceable with request context.

### Story 5.4 MVP Release Readiness Gate
As a delivery team,
I want a release-readiness checklist gate,
so that MVP launch quality is verified before production rollout.

#### Acceptance Criteria
1. Core journey smoke tests pass for admin and learner flows.
2. Security baseline checks are verified for production profile.
3. Open blockers are documented with explicit go/no-go status.

## Checklist Results Report
Pending. Full PM checklist execution/report can be generated after this PRD is approved.

## Next Steps

### UX Expert Prompt
Use `docs/prd.md` and `docs/project-brief.md` to produce a high-level UI architecture and design direction for Flix (admin + learner flows), including core screens, interaction patterns, responsive behavior, and component priorities aligned to the monorepo structure.

### Architect Prompt
Use `docs/prd.md`, `docs/project-brief.md`, and the current monorepo scaffold to produce the technical architecture document, including backend modular design, API contracts, data model evolution plan, testing strategy, and implementation sequencing by epic/story.
