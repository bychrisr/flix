# Architecture Decision Notes
- Keep schema design simple and normalized for MVP; optimize with selective denormalization only after measured bottlenecks.
- Defer external logo-generation integration to post-MVP adapter to avoid coupling core publishing flow to third-party availability.
- Treat `design-system/` root folder as migration input only; canonical design artifacts must live in `packages/design-system`.
