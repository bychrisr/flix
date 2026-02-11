# Requirements

## Functional
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

## Non Functional
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
