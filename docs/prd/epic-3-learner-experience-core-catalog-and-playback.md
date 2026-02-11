# Epic 3 Learner Experience Core (Catalog and Playback)
Epic goal: Deliver the primary learner-facing journey from event landing to lesson playback with strict release window enforcement. This epic is the core value delivery for student consumption.

## Story 3.1 Public Event Landing and Catalog
As a learner,
I want to browse an event and its lessons in a clear catalog,
so that I can understand available and upcoming content.

### Acceptance Criteria
1. Event landing displays hero content and lesson catalog.
2. Each lesson card displays status: released, locked, or expired.
3. Catalog rendering consumes API data and handles empty/error states.
4. Private events require successful access validation before catalog rendering.

## Story 3.2 Release-Window Access Enforcement
As a platform owner,
I want server-authoritative release checks for lesson access,
so that learners cannot bypass content gating rules.

### Acceptance Criteria
1. Access endpoint returns consistent authorization based on release/expiry windows.
2. Locked and expired lessons are blocked from playback route access.
3. User-facing status messaging is returned for blocked scenarios.
4. Private event access rules are validated together with release-window checks.

## Story 3.3 Lesson Playback Experience
As a learner,
I want a stable lesson page with embedded playback,
so that I can consume content smoothly.

### Acceptance Criteria
1. Lesson page renders video player for authorized lessons.
2. Adjacent lesson navigation (previous/next) is available when applicable.
3. Basic anti-abuse/embed constraints are applied in player integration.

## Story 3.4 Release Countdown and Status Clarity
As a learner,
I want clear countdown/status cues for upcoming lessons,
so that I know when content will unlock.

### Acceptance Criteria
1. Countdown UI appears when lesson is not yet released.
2. Countdown is derived from server timestamps to avoid client drift issues.
3. Status transitions are reflected correctly after release time.
