# Frontend Netflix Recovery Plan

Date: 2026-02-12
Owner: Product + Architecture + Frontend Guild
Status: Proposed

## Source of Truth

1. Design System (visual identity, typography, color, component style): `design-system/netflix-design-system/Netflix Design System.pdf`
2. Navigation and usability (flows, screens, UX behavior): `design-system/netflix-course-workflow.md`
3. `packages/design-system` is the implementation layer and must mirror the two sources above, never redefine them.

## 1) Diagnosis (Evidence)

1. Frontend flows exist, but visual implementation is not aligned with Netflix identity.
2. Learner and admin styles are currently custom light themes (`apps/web/src/styles.css`, `apps/admin/src/styles.css`), not token-driven Netflix UI.
3. Canonical design-system policy requires `packages/design-system` as source of truth (`docs/design-system-canonical-policy.md`), but app code is not consuming DS tokens/components.
4. Design-system package exists but is still scaffold-level for tooling (`packages/design-system/package.json` scripts are placeholders).
5. Product workflow/specification is detailed and must be treated as contract (`design-system/netflix-course-workflow.md`, `design-system/netflix-design-system/Netflix Design System.pdf`).

## 2) Mandatory Recovery Goal

Deliver both apps (`apps/web`, `apps/admin`) with atomic, reusable, Netflix-consistent UI by enforcing design-system-first implementation and blocking release on visual/runtime quality gates.

## 3) Agent Call Plan

1. `@sm` (Product/Scope Owner)
- Freeze MVP screen scope from workflow and define non-negotiable screens/states.
- Approve final acceptance checklist by flow.

2. `@ux-design-expert` (UX/Visual Authority)
- Convert PDF + workflow into implementable UI spec (desktop/mobile, component states, spacing, typography, interactions).
- Approve fidelity before QA closes stories.

3. `@architect` (Technical Gate)
- Enforce DS consumption rule and component architecture.
- Block merges that bypass tokens/components.

4. `@dev` as `@design-system-engineer`
- Hardening `@flix/design-system` package (build/test/typecheck real scripts).
- Build atomic layer: tokens -> primitives -> composed components.

5. `@dev` as `@frontend-web`
- Migrate learner app pages to DS components and Netflix layout patterns.

6. `@dev` as `@frontend-admin`
- Migrate admin app pages to DS-driven form/table/layout system.

7. `@qa` / `@e2e`
- Add visual + functional gates (smoke, regression, key responsive breakpoints).

## 4) Execution Plan (Hard Timeline)

## Phase 0 - Contract Freeze (2026-02-12 to 2026-02-13)
1. Build a screen inventory from workflow and existing routes.
2. Mark each screen/state as `Must`, `Should`, `Later`.
3. Lock acceptance criteria per screen (including loading/empty/error states).

Deliverables
- `docs/frontend-screen-contract.md`
- Updated story checklist with explicit screen/state matrix.

## Phase 1 - Atomic Design System Foundation (2026-02-13 to 2026-02-16)
1. Normalize DS package scripts/build pipeline in `packages/design-system`.
2. Publish atomic primitives:
- Typography, color, spacing, radius, elevation, motion.
- Layout primitives (`Page`, `Section`, `Grid`, `Stack`).
- Form primitives (`Input`, `Select`, `Textarea`, `Checkbox`, `Button`).
- Content primitives (`Card`, `Badge`, `Tabs`, `Modal`, `Toast`, `Table`).
3. Add strict lint/test rule: app code cannot hardcode colors/fonts outside DS.

Deliverables
- DS package consumable by both apps.
- Token usage verifier integrated in CI.

## Phase 2 - Learner App Migration (2026-02-16 to 2026-02-19)
1. Rebuild catalog and playback pages with Netflix structure:
- Hero, rail/cards, release badges, access-state messaging, quiz/material sections.
2. Keep existing API integrations intact while replacing view layer.
3. Validate responsive behavior (mobile first + desktop cinematic layout).

Deliverables
- `apps/web` UI fully DS-based.
- No raw palette/typography leakage.

## Phase 3 - Admin App Migration (2026-02-19 to 2026-02-22)
1. Rebuild login and dashboard operation surfaces with DS components.
2. Recompose event/lesson/material/quiz flows as consistent admin patterns.
3. Integrate branding generation UX with clear preview/rollback and status feedback.

Deliverables
- `apps/admin` UI fully DS-based.
- Form validation and feedback visually standardized.

## Phase 4 - Closure Gates (2026-02-22 to 2026-02-24)
1. Run full quality gates:
- Unit/integration/e2e.
- Visual review checklist per contract.
- Responsive acceptance (mobile/tablet/desktop).
2. Promote stories only with evidence links.
3. Release decision with explicit GO/NO-GO minutes.

Deliverables
- `docs/frontend-visual-qa-checklist.md`
- Updated readiness report with frontend fidelity evidence.

## 5) Non-Negotiable Merge Gates

1. No merge if app CSS hardcodes brand colors/typography outside DS tokens.
2. No merge if required workflow screens/states are missing.
3. No merge if smoke e2e fails on admin or learner critical paths.
4. No merge if mobile layout breaks at small breakpoint.
5. No merge if UX authority (`@ux-design-expert`) and architecture gate (`@architect`) did not approve.

## 6) Definition of Done (Frontend)

1. All MVP screens from workflow implemented in web/admin with Netflix identity.
2. Both apps consume `@flix/design-system` tokens/components as default path.
3. Accessibility baseline respected (focus states, contrast, keyboard nav).
4. Functional tests and smoke e2e passing.
5. Documentation updated with exact evidence per story.

## 7) Immediate Next Action (Today)

1. Open a dedicated branch `feat/frontend-netflix-recovery`.
2. Execute Phase 0 and publish screen contract in docs.
3. Start Phase 1 by hardening `packages/design-system` scripts and CI gates.
