# Design System Extraction (Reference Only)

## Context
A pasta `design-system/` foi analisada como **documentação e referência**, não como fonte de verdade.
O objetivo é aproveitar o que está consistente e migrar para o modelo canônico de monorepo.

## What Exists Today

### 1. Documentation & guidance
- `design-system/QUICK-START.md`
- `design-system/docs/EXTRACTION-REPORT.md`
- `design-system/examples/usage-examples.tsx`
- `design-system/netflix-course-workflow.md` (cópia de contexto do produto)

### 2. Package draft (already structured)
- `design-system/packages/design-system/package.json`
- `design-system/packages/design-system/tailwind.config.ts`
- `design-system/packages/design-system/src/index.ts`
- Tokens:
  - `design-system/packages/design-system/src/tokens/colors.ts`
  - `design-system/packages/design-system/src/tokens/typography.ts`
  - `design-system/packages/design-system/src/tokens/index.ts`
- Components:
  - `design-system/packages/design-system/src/components/custom/Button.tsx`
  - `design-system/packages/design-system/src/components/custom/Input.tsx`
  - `design-system/packages/design-system/src/components/custom/Dropdown.tsx`
  - `design-system/packages/design-system/src/components/custom/MovieCard.tsx`
- Utils:
  - `design-system/packages/design-system/src/lib/utils.ts`

### 3. Assets
- Font files inside `design-system/fonts/netflix-sans-font-1770826857-0/`

## Extracted Tokens (usable baseline)

### Color system
- Brand: red `#E50914`, black `#000000`, white `#FFFFFF`
- Extended gray scale (multiple steps, Netflix-like hierarchy)
- Semantic groups already mapped:
  - `brand`, `background`, `text`, `border`, `interactive`, `status`, `player`

### Typography
- Families:
  - `Netflix Sans` (UI)
  - `Bebas Neue` (display)
- Scales already modeled:
  - base (`caption` to `largeTitle`)
  - medium variants
  - bold variants
  - display variants

### Foundations
- Spacing scale (4px base)
- Radius scale
- Shadows scale
- Motion durations + easing
- Breakpoints + z-index layers

## Extracted Components (reusable patterns)
- `Button` + variants (`primary`, `secondary`, `outline`, `ghost`, `play`, `info`)
- `Input` + specializations (`EmailInput`, `PasswordInput`, `PhoneOrEmailInput`)
- `Select`/`Dropdown`
- `MovieCard` + `MovieRow`
- Utility functions: class merge, duration format, debounce, progress helpers

## Fit for Monorepo (Target)
Use as seed for canonical structure:

- `packages/design-system/src/tokens`
- `packages/design-system/src/foundations`
- `packages/design-system/src/components`
- `packages/design-system/src/patterns`
- `packages/design-system/src/lib`
- `packages/design-system/tailwind`
- `packages/design-system/docs`

## Important Constraints Before Adoption
1. Font licensing must be validated before production usage.
2. Package metadata/exports are draft-level and should be normalized to workspace tooling.
3. Component coverage is partial for the course product (missing admin-specific patterns, player primitives, data-table/form-heavy blocks).
4. Treat current files as migration input, not final API contract.

## Migration Priority (recommended)
1. Keep tokens/foundations first (single source of truth)
2. Normalize Tailwind preset integration for `apps/web` and `apps/admin`
3. Promote base components (Button/Input/Dropdown/Card)
4. Add course-specific patterns (Hero, LessonCard, ReleaseBadge, Countdown, AdminForm sections)
5. Freeze public API of `@flix/design-system` only after app usage proves stability

