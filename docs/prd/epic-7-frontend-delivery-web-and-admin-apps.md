# Epic 7 Frontend Delivery (Web and Admin Apps)
Epic goal: Deliver runnable, integrated frontend applications for admin and learner personas, replacing static baselines with real end-to-end product flows.

## Story 7.1 Admin App Runtime Bootstrap and Auth Shell
As an admin,
I want a real admin application shell with authentication,
so that I can securely access operational workflows from the browser.

### Acceptance Criteria
1. Admin app has runnable framework runtime and environment-based API configuration.
2. Login flow integrates with existing admin auth endpoint and stores session context safely.
3. Protected admin routes block unauthenticated access and handle expired sessions.

## Story 7.2 Admin Content Operations UI (Events, Lessons, Materials, Quizzes, Branding)
As an admin,
I want complete content management workflows in the UI,
so that I can publish and operate events without direct API tooling.

### Acceptance Criteria
1. Admin UI supports event and lesson CRUD flows with validation feedback.
2. Materials and quiz management flows are fully available from admin screens.
3. Branding controls are available in admin flow and integrate with backend branding APIs.

## Story 7.3 Learner App Runtime with Catalog and Playback
As a learner,
I want a real learner-facing web application,
so that I can navigate catalog and consume lessons in a production-like flow.

### Acceptance Criteria
1. Learner app runs with framework runtime and consumes public catalog/access APIs.
2. Catalog and lesson playback flows reflect release/private access states correctly.
3. Navigation between lessons and access messaging is clear and consistent.

## Story 7.4 Learner Materials and Quiz Experience
As a learner,
I want to use lesson materials and complete quizzes in-app,
so that I can complete the full learning cycle without leaving the platform.

### Acceptance Criteria
1. Materials listing and download actions are accessible in released lessons.
2. Quiz execution and result screens integrate with submit/result APIs.
3. Learner UX handles loading/empty/error states for materials and quiz flows.
