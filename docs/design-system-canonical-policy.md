# Design System Canonical Policy

## Rule
- Source of truth for visual design decisions is `design-system/netflix-design-system/Netflix Design System.pdf`.
- Source of truth for navigation/usability flows is `design-system/netflix-course-workflow.md`.
- Canonical implementation source for tokens and foundations in code is `packages/design-system`.
- Legacy folder `design-system/` is reference-only and must not be imported by app code.

## Current Canonical Files
- `packages/design-system/src/tokens/colors.ts`
- `packages/design-system/src/tokens/typography.ts`
- `packages/design-system/src/tokens/foundations.ts`
- `packages/design-system/src/tokens/theme.css`

## Enforcement
- `apps/web/src/styles.css` and `apps/admin/src/styles.css` import `packages/design-system/src/tokens/theme.css`.
- Automated check: `node scripts/verify-token-usage.mjs apps/web/src` and `node scripts/verify-token-usage.mjs apps/admin/src`.
