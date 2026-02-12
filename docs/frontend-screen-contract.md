# Frontend Screen Contract (Workflow vs Current Apps)

Date: 2026-02-12
Sources:
- Visual design: `design-system/netflix-design-system/Netflix Design System.pdf`
- Navigation/usability: `design-system/netflix-course-workflow.md`

## Admin App

1. `/admin/login` - Must - Implemented (needs Netflix visual fidelity uplift)
2. `/admin/dashboard` - Must - Implemented (needs information architecture split by workflow menu)
3. `/admin/eventos` - Must - Implemented (phase 1 routing with dedicated section)
4. `/admin/eventos/novo` - Must - Implemented (dedicated create mode and reset form behavior)
5. `/admin/eventos/:id/editar` - Must - Implemented (dedicated edit mode with route-id selection)
6. `/admin/aulas` - Must - Implemented (phase 1 routing with dedicated section)
7. `/admin/quizzes` - Should - Implemented (phase 1 routing with dedicated section)
8. `/admin/usuarios` - Later - Not planned for MVP

## Learner App

1. `/events/:eventSlug` - Must - Implemented (catalog)
2. `/events/:eventSlug/lessons/:lessonSlug` - Must - Implemented (playback + materials + quiz)
3. Private access key gating state - Must - Implemented
4. Locked lesson state - Must - Implemented
5. Expired lesson state - Must - Implemented
6. Hero/featured cinematic landing composition - Must - Implemented (phase 1 visual rebuild)
7. Netflix row/card browsing pattern - Must - Implemented (phase 1 rails/tile pattern)

## Execution Priorities

1. P0: route split for admin workflow screens to match markdown navigation contract. (Done 2026-02-12)
2. P1: learner catalog/playback visual rebuild to Netflix card/hero patterns. (Done 2026-02-12 phase 1)
3. P2: admin visual system and component consistency uplift (split section component into dedicated page files). (Done 2026-02-12 phase 1)
