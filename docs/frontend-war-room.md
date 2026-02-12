# Frontend War Room (YOLO Execution)

Date: 2026-02-12
Mode: Execution-first (no more discovery-only cycles)

## Command Center

1. Visual source of truth: `design-system/netflix-design-system/Netflix Design System.pdf`
2. Navigation/usability source of truth: `design-system/netflix-course-workflow.md`
3. Code implementation source: `packages/design-system` + `apps/web` + `apps/admin`

## Parallel Lanes

1. Lane A - Design System Core (`@dev` as DS Engineer)
- Harden package scripts (build/test/typecheck).
- Expose stable primitives and tokens.
- Deliverable gate: apps consume DS tokens without hardcoded theme values.

2. Lane B - Learner UI Migration (`@dev` as Frontend Web)
- Catalog/playback/materials/quiz surfaces using Netflix layout language.
- Deliverable gate: all learner states from workflow (`loading`, `empty`, `error`, gated access).

3. Lane C - Admin UI Migration (`@dev` as Frontend Admin)
- Login + dashboard + CRUD forms + branding flows with unified components.
- Deliverable gate: consistent form/table/feedback patterns.

4. Lane D - Quality Gates (`@qa` / `@architect`)
- Token usage checks, unit/integration, smoke e2e, responsive checks.
- Deliverable gate: no release if any lane fails.

## Daily Gate (Blocking)

1. `npm run build --workspace @flix/web`
2. `npm run build --workspace @flix/admin`
3. `node scripts/verify-token-usage.mjs apps/web/src`
4. `node scripts/verify-token-usage.mjs apps/admin/src`
5. `npm run e2e:smoke:gate`

Any failure blocks merge.

## Current Sprint Cutline

1. P0: Remove all light-theme placeholder styling and switch to tokenized Netflix baseline.
2. P1: Map workflow screens to implemented routes and fill missing screens/states.
3. P2: Raise visual fidelity (spacing/typography/components) to PDF baseline.

## Status Snapshot

1. P0 in progress.
2. P1 pending.
3. P2 pending.
