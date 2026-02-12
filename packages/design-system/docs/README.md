# @flix/design-system docs

This package is the canonical design-system location for the monorepo.

Source of truth
- Visual design source: `../../../design-system/netflix-design-system/Netflix Design System.pdf`
- Navigation/usability source: `../../../design-system/netflix-course-workflow.md`

Component architecture (Atomic Design)
- Atoms
  - `Button`, `Input`, `Text`, `Badge`, `Card`, `HeroBannerControlButton`
- Molecules
  - `FormField`, `AccessKeyForm`, `LessonTile`, `StatTile`, `HeroBannerActionsPattern`, `HeroBannerUtilitiesPattern`
- Organisms
  - `AppTopNav`, `HeroBanner`, `LessonRail`, `PlaybackPanel`, `AdminHeader`, `FaqQuestionsPattern`
- Templates
  - `LearnerCatalogTemplate`, `LearnerPlaybackTemplate`, `AdminDashboardTemplate`, `AdminContentTemplate`
- Pages
  - `LearnerCatalogPage`, `LearnerPlaybackPage`, `AdminDashboardPage`, `AdminEventsPage`, `AdminLessonsPage`, `AdminQuizzesPage`

Public exports
- `@flix/design-system` -> tokens + all component layers
- `@flix/design-system/tokens` -> tokens only
- `@flix/design-system/tokens/theme.css` -> css variables
