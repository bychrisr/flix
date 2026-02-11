# Tech Stack

| Category | Technology | Version | Purpose | Rationale |
|---|---|---:|---|---|
| Frontend Language | TypeScript | 5.x | Type-safe app development | Shared contracts and reduced runtime errors |
| Frontend Framework | Next.js | 15.x | Web/admin SSR+SPA hybrid | Strong DX, routing, performance primitives |
| UI Component Library | Custom `@flix/design-system` + shadcn primitives | Latest | Consistent UI foundations | Product-specific brand with reusable base |
| State Management | TanStack Query + Zustand | 5.x / 5.x | Server state + local state | Clear separation of concerns |
| Backend Language | TypeScript | 5.x | API and domain logic | Shared typing with frontend |
| Backend Framework | Fastify | 5.x | High-performance API runtime | Validation + plugin ecosystem |
| API Style | REST (OpenAPI 3.1) | 3.1 | Domain endpoints for web/admin | Simpler integration and governance |
| Database | PostgreSQL | 16 | Relational core data | Strong integrity for event/lesson/quiz model |
| Cache | Redis (optional for MVP) | 7.x | Hot path caching/rate limit store | Performance headroom |
| File Storage | S3-compatible bucket | N/A | Materials/thumbnails/logos | Durable object storage |
| Authentication | JWT access + refresh tokens | N/A | Admin/session auth | Stateless API + secure rotation |
| Frontend Testing | Vitest + Testing Library | latest | Unit/component tests | Fast feedback loop |
| Backend Testing | Vitest + Supertest | latest | Unit/integration API tests | Contract and behavior coverage |
| E2E Testing | Playwright | latest | Critical journey smoke tests | Release confidence |
| Build Tool | npm workspaces | 11.x | Workspace orchestration | Already in place |
| Bundler | Turbopack (Next default) | latest | App bundling | Fast builds/dev |
| IaC Tool | Terraform (phase 2) | 1.x | Infra codification | Repeatable environments |
| CI/CD | GitHub Actions | N/A | Build/test/deploy pipeline | Native integration with repo |
| Monitoring | Sentry + provider metrics | latest | Error/perf observability | Fast incident triage |
| Logging | Pino (API) + JSON logs | latest | Structured logs | Queryable operational telemetry |
| CSS Framework | Tailwind CSS | 3.4+ | Utility-first styling | Rapid UI and token mapping |
