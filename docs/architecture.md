# Flix Fullstack Architecture Document

## Introduction
This document defines the unified fullstack architecture for Flix, covering frontend apps, backend services, shared packages, and operational infrastructure. It is based on `docs/prd.md` and the current monorepo scaffold. No `docs/front-end-spec.md` was found at this stage, so frontend details are derived from PRD UI goals and current constraints.

### Starter Template or Existing Project
N/A - Greenfield project (custom monorepo scaffold already initialized).

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-02-11 | 0.1 | Initial fullstack architecture draft from PRD | Architect (@architect flow) |

## High Level Architecture

### Technical Summary
Flix uses a monorepo architecture with separate apps for learner-facing web and admin portal, plus a single backend API service and a shared design-system package. The backend follows a modular monolith pattern for MVP speed, with domain modules for auth, events, lessons, materials, and quizzes. Frontend apps consume the same API contracts and shared UI tokens/components to keep UX consistency while allowing product-specific views. Deployment targets prioritize fast iteration and low operational overhead, with edge delivery for frontend and managed runtime for API/database/storage. The architecture enforces server-authoritative checks for both journey visibility (`public`/`private`) and lesson release-window access to protect gated content. This design directly supports PRD goals for end-to-end publishing operations, learner playback flow, and responsive UX.

### Platform and Infrastructure Choice
- Option 1: Vercel + Railway + Postgres + S3-compatible storage  
  Pros: fast DX, simple rollout, good fit for JS monorepo; Cons: multi-provider ops.
- Option 2: Full AWS (CloudFront, ECS/Lambda, RDS, S3, Cognito)  
  Pros: enterprise-grade scale/security; Cons: higher setup/ops overhead for MVP.
- Option 3: Supabase + Vercel  
  Pros: accelerated backend primitives; Cons: less control if custom auth/domain rules grow quickly.

**Recommendation:** Option 1 (Vercel + Railway + Postgres + object storage).  
It balances MVP speed, cost, and control while preserving a clean migration path to more advanced infrastructure.

**Platform:** Hybrid (Vercel + Railway + Managed Postgres + Object Storage)
**Key Services:** Vercel hosting, Railway API runtime, PostgreSQL, S3-compatible bucket, CDN/edge cache, centralized logs
**Deployment Host and Regions:** Primary region `us-east-1` (or closest to target audience), CDN global edge

### Repository Structure
**Structure:** Monorepo  
**Monorepo Tool:** npm workspaces (already active)  
**Package Organization:**
- `apps/web` - learner experience
- `apps/admin` - operational/admin experience
- `services/api` - backend API
- `packages/design-system` - canonical UI tokens/components
- `packages/config` (planned) - shared lint/tsconfig/test config
- `packages/shared` (planned) - shared types/contracts

### High Level Architecture Diagram
```mermaid
graph TD
  U[Learner User] --> WEB[apps/web]
  A[Admin User] --> ADM[apps/admin]

  WEB --> CDN[Edge CDN]
  ADM --> CDN
  CDN --> API[services/api]

  API --> DB[(PostgreSQL)]
  API --> OBJ[(Object Storage)]
  API --> LOG[Log/Monitoring Stack]

  DS[packages/design-system] --> WEB
  DS --> ADM

  SHARED[packages/shared - planned] --> WEB
  SHARED --> ADM
  SHARED --> API
```

### Architectural Patterns
- **Monorepo with bounded apps/services/packages:** Shared contracts and faster cross-stack delivery - _Rationale:_ aligns with FR17 and reduces integration drift.
- **Modular Monolith Backend:** Domain modules under one deployable API - _Rationale:_ MVP speed with clear future extraction paths.
- **Server-authoritative access control:** Release/expiry checks in backend - _Rationale:_ enforce FR5-FR7 reliably.
- **Journey visibility gating:** Event-level `public/private` access policy - _Rationale:_ enforce FR20/FR21 and prevent private catalog leakage.
- **Design-system-first UI foundation:** Token/component reuse across apps - _Rationale:_ supports NFR5 and UX consistency goals.
- **API-first integration contract:** OpenAPI-driven endpoints and DTOs - _Rationale:_ predictable FE/BE collaboration and testability.
- **Defense in depth security:** validation, auth middleware, rate limiting, secure headers - _Rationale:_ satisfy NFR1/NFR2/NFR10.

## Tech Stack

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

## Data Models

### Admin
**Purpose:** Platform operator identity for admin portal access.

**Key Attributes:**
- `id`: uuid - unique admin identifier
- `username`: string - unique login identifier
- `password_hash`: string - bcrypt/argon hash
- `email`: string - contact/recovery
- `created_at`: timestamptz - audit timestamp

#### TypeScript Interface
```ts
export interface Admin {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
  createdAt: string;
}
```

#### Relationships
- Admin performs CRUD actions across event/lesson/quiz/material entities.

### Event
**Purpose:** Top-level course launch container.

**Key Attributes:**
- `id`: uuid - event identifier
- `name`: string - event display title
- `slug`: string - URL-safe unique path
- `hero_short`: string - short hero description
- `hero_full`: string - long event description
- `cover_video_url`: string - hero media source
- `logo_url`: string nullable - optional generated logo
- `style_config`: jsonb - typography/color settings
- `is_active`: boolean - publish flag
- `visibility`: enum(`public`,`private`) - journey access mode

#### TypeScript Interface
```ts
export interface Event {
  id: string;
  name: string;
  slug: string;
  heroShort: string;
  heroFull: string;
  coverVideoUrl: string;
  logoUrl?: string;
  styleConfig: Record<string, string | number | boolean>;
  isActive: boolean;
  visibility: 'public' | 'private';
  createdAt: string;
}
```

#### Relationships
- One event has many lessons.

### Lesson
**Purpose:** Time-gated content unit under an event.

**Key Attributes:**
- `id`: uuid - lesson identifier
- `event_id`: uuid - parent event
- `order`: integer - display sequence
- `name`: string - lesson title
- `description`: text - lesson context
- `release_at`: timestamptz - unlock time
- `access_expires_at`: timestamptz nullable - optional expiry
- `video_url`: string - playback source
- `thumbnail_url`: string nullable - card image
- `duration_minutes`: integer nullable - metadata

#### TypeScript Interface
```ts
export interface Lesson {
  id: string;
  eventId: string;
  order: number;
  name: string;
  description?: string;
  releaseAt: string;
  accessExpiresAt?: string | null;
  videoUrl: string;
  thumbnailUrl?: string | null;
  durationMinutes?: number | null;
  viewCount: number;
  createdAt: string;
}
```

#### Relationships
- Lesson belongs to one event.
- Lesson has many materials.
- Lesson has zero or one quiz.

### Material
**Purpose:** Support files attached to lesson.

**Key Attributes:**
- `id`: uuid
- `lesson_id`: uuid
- `file_name`: string
- `mime_type`: string
- `file_url`: string
- `size_bytes`: bigint

#### TypeScript Interface
```ts
export interface Material {
  id: string;
  lessonId: string;
  fileName: string;
  mimeType: string;
  fileUrl: string;
  sizeBytes: number;
  createdAt: string;
}
```

#### Relationships
- Material belongs to one lesson.

### Quiz, QuizQuestion, QuizOption
**Purpose:** Assessment structure for lesson verification.

#### TypeScript Interface
```ts
export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  minScore: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  order: number;
  prompt: string;
  type: 'multiple_choice' | 'true_false';
}

export interface QuizOption {
  id: string;
  questionId: string;
  order: number;
  text: string;
  isCorrect: boolean;
}
```

#### Relationships
- Quiz belongs to one lesson.
- Quiz has many questions.
- Question has many options.

## API Specification

### REST API Specification
```yaml
openapi: 3.1.0
info:
  title: Flix API
  version: 1.0.0
  description: API for admin operations and learner content consumption
servers:
  - url: https://api.flix.example.com
    description: Production
  - url: http://localhost:3001
    description: Local
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: []
paths:
  /health:
    get:
      summary: Service health
      responses:
        '200':
          description: OK
  /api/admin/login:
    post:
      summary: Admin authentication
  /api/events:
    get:
      summary: List events
    post:
      summary: Create event
  /api/events/{id}:
    get:
      summary: Get event
    put:
      summary: Update event
    delete:
      summary: Delete event
  /api/events/{eventId}/lessons:
    get:
      summary: List lessons for event
    post:
      summary: Create lesson for event
  /api/lessons/{id}:
    get:
      summary: Get lesson details
    put:
      summary: Update lesson
    delete:
      summary: Delete lesson
  /api/lessons/{id}/materials:
    get:
      summary: List lesson materials
    post:
      summary: Upload material
  /api/quizzes:
    post:
      summary: Create quiz
  /api/quizzes/{id}:
    get:
      summary: Get quiz
    put:
      summary: Update quiz
    delete:
      summary: Delete quiz
  /api/quizzes/{id}/submit:
    post:
      summary: Submit quiz responses and return score
  /api/public/events/{slug}:
    get:
      summary: Event payload (returns 403 when event is private and access is not validated)
  /api/events/{slug}/access:
    post:
      summary: Validate private event access credentials and create access session
  /api/public/lessons/{id}/access:
    get:
      summary: Evaluate event visibility access + release/expiry access for lesson
```

## Components

### apps/web (Learner App)
**Responsibility:** Event discovery, lesson playback, materials and quiz UX.

**Key Interfaces:**
- GET `/api/public/events/{slug}`
- POST `/api/events/{slug}/access`
- GET `/api/public/lessons/{id}/access`
- GET `/api/lessons/{id}/materials`
- POST `/api/quizzes/{id}/submit`

**Dependencies:** `@flix/design-system`, API client, shared types  
**Technology Stack:** Next.js + TanStack Query + Tailwind

### apps/admin (Admin App)
**Responsibility:** Authenticated operational panel for content lifecycle.

**Key Interfaces:**
- POST `/api/admin/login`
- CRUD `/api/events`, `/api/lessons`, `/api/quizzes`
- upload `/api/lessons/{id}/materials`

**Dependencies:** `@flix/design-system`, API client, shared types  
**Technology Stack:** Next.js + TanStack Query + Tailwind

### services/api
**Responsibility:** Domain services, validation, security, persistence orchestration.

**Key Interfaces:**
- REST endpoints for auth/events/lessons/materials/quizzes
- health/readiness endpoints

**Dependencies:** PostgreSQL, storage adapter, auth adapter, logging layer  
**Technology Stack:** Fastify + TypeScript + query layer (Prisma/Drizzle)

### packages/design-system
**Responsibility:** Canonical visual tokens/foundations/components for both apps.

**Key Interfaces:**
- token exports
- primitive/shared UI components

**Dependencies:** Tailwind config, React primitives  
**Technology Stack:** TypeScript package with token/component exports

### Component Diagram
```mermaid
graph LR
  WEB[apps/web] --> BFF[API Routes Client Layer]
  ADM[apps/admin] --> BFF
  BFF --> API[services/api]
  API --> AUTH[Auth Module]
  API --> EVT[Event Module]
  API --> LES[Lesson Module]
  API --> MAT[Material Module]
  API --> QUIZ[Quiz Module]
  API --> DB[(PostgreSQL)]
  API --> STORE[(Object Storage)]
  DS[packages/design-system] --> WEB
  DS --> ADM
```

## External APIs
- Initial mandatory external API: Gemini API for AI-assisted event logo generation.
- Integration must be isolated behind an internal `branding` service adapter in `services/api` to avoid coupling domain flows directly to provider SDK details.
- Baseline controls for this integration:
  - timeout, retry with backoff, and explicit failure surface to admin UI;
  - prompt template versioning for reproducible outputs;
  - cost/usage logging per request for operational visibility.

## Core Workflows
```mermaid
sequenceDiagram
  participant Admin
  participant AdminApp as apps/admin
  participant API as services/api
  participant DB as PostgreSQL
  participant Store as Object Storage

  Admin->>AdminApp: Create lesson (release_at, video, materials)
  AdminApp->>API: POST /api/events/{id}/lessons
  API->>API: Validate auth + payload + release rules
  API->>DB: Insert lesson
  AdminApp->>API: POST /api/lessons/{id}/materials
  API->>Store: Upload file
  API->>DB: Insert material metadata
  API-->>AdminApp: 201 Created
```

```mermaid
sequenceDiagram
  participant Learner
  participant WebApp as apps/web
  participant API as services/api
  participant DB as PostgreSQL

  Learner->>WebApp: Open event page
  WebApp->>API: GET /api/public/events/{slug}
  API->>DB: Fetch event + lessons
  API-->>WebApp: Event payload with lesson statuses

  Learner->>WebApp: Open lesson
  WebApp->>API: GET /api/public/lessons/{id}/access
  API->>DB: Evaluate release_at/access_expires_at
  alt Access granted
    API-->>WebApp: allowed
    WebApp-->>Learner: Render player
  else Blocked
    API-->>WebApp: denied (locked/expired)
    WebApp-->>Learner: Show status message
  end
```

## Database Schema
```sql
create table admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  hero_short text,
  hero_full text,
  cover_video_url text,
  logo_url text,
  style_config jsonb not null default '{}'::jsonb,
  is_active boolean not null default false,
  visibility text not null default 'public' check (visibility in ('public','private')),
  created_at timestamptz not null default now()
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  "order" int not null,
  name text not null,
  description text,
  release_at timestamptz not null,
  access_expires_at timestamptz,
  video_url text not null,
  thumbnail_url text,
  duration_minutes int,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  constraint lessons_release_window_chk
    check (access_expires_at is null or access_expires_at > release_at),
  unique(event_id, "order")
);

create table materials (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  file_name text not null,
  mime_type text not null,
  file_url text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default now()
);

create table quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references lessons(id) on delete cascade,
  title text not null,
  description text,
  min_score int not null default 70,
  created_at timestamptz not null default now()
);

create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  "order" int not null,
  prompt text not null,
  question_type text not null check (question_type in ('multiple_choice','true_false')),
  unique(quiz_id, "order")
);

create table quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references quiz_questions(id) on delete cascade,
  "order" int not null,
  text text not null,
  is_correct boolean not null default false,
  unique(question_id, "order")
);

create index idx_lessons_event_id on lessons(event_id);
create index idx_lessons_release_at on lessons(release_at);
create index idx_materials_lesson_id on materials(lesson_id);
create index idx_quiz_questions_quiz_id on quiz_questions(quiz_id);
create index idx_quiz_options_question_id on quiz_options(question_id);
```

## Frontend Architecture

### Component Architecture
#### Component Organization
```text
apps/web/src/
  app/
  features/
    catalog/
    lesson/
    materials/
    quiz/
  components/
  services/
  stores/
  hooks/
  utils/

apps/admin/src/
  app/
  features/
    auth/
    dashboard/
    events/
    lessons/
    quizzes/
    materials/
  components/
  services/
  stores/
  hooks/
  utils/
```

#### Component Template
```ts
type Props = {
  title: string;
  onAction?: () => void;
};

export function FeatureCard({ title, onAction }: Props) {
  return (
    <section className="rounded-lg border p-4">
      <h3 className="text-title-3">{title}</h3>
      <button onClick={onAction}>Action</button>
    </section>
  );
}
```

### State Management Architecture
#### State Structure
```ts
export type SessionState = {
  adminToken: string | null;
  adminUser: { id: string; username: string } | null;
};

export type CatalogState = {
  selectedEventSlug: string | null;
  selectedLessonId: string | null;
};
```

#### State Management Patterns
- Server state with TanStack Query (API data, caching, invalidation).
- Minimal local UI/session state in Zustand stores.
- Derived release-status logic from server payloads, not client-only inference.

### Routing Architecture
#### Route Organization
```text
apps/web/src/app/
  (public)/
    page.tsx
    eventos/[slug]/page.tsx
    aulas/[id]/page.tsx

apps/admin/src/app/
  login/page.tsx
  dashboard/page.tsx
  eventos/page.tsx
  aulas/page.tsx
  quizzes/page.tsx
```

#### Protected Route Pattern
```ts
export async function requireAdminSession(token: string | null) {
  if (!token) {
    throw new Error('UNAUTHORIZED');
  }
  return true;
}
```

### Frontend Services Layer
#### API Client Setup
```ts
export const api = {
  get: async <T>(path: string): Promise<T> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`);
    if (!res.ok) throw new Error(`API_ERROR_${res.status}`);
    return res.json() as Promise<T>;
  },
  post: async <T>(path: string, body: unknown, token?: string): Promise<T> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API_ERROR_${res.status}`);
    return res.json() as Promise<T>;
  },
};
```

#### Service Example
```ts
export async function fetchPublicEvent(slug: string) {
  return api.get(`/api/public/events/${slug}`);
}
```

## Backend Architecture

### Service Architecture
#### Controller/Route Organization
```text
services/api/src/
  modules/
    auth/
    events/
    lessons/
    materials/
    quizzes/
    public/
  plugins/
  middleware/
  lib/
  app.ts
  server.ts
```

#### Controller Template
```ts
import type { FastifyInstance } from 'fastify';

export async function registerEventRoutes(app: FastifyInstance) {
  app.get('/api/events', async (_req, reply) => {
    return reply.send({ items: [] });
  });
}
```

### Database Architecture
#### Schema Design
(See complete SQL DDL in Database Schema section.)

#### Data Access Layer
```ts
export interface EventRepository {
  list(): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  create(input: CreateEventInput): Promise<Event>;
  update(id: string, input: UpdateEventInput): Promise<Event>;
  remove(id: string): Promise<void>;
}
```

### Authentication and Authorization
#### Auth Flow
```mermaid
sequenceDiagram
  participant Admin
  participant AdminApp
  participant API
  participant DB

  Admin->>AdminApp: Submit credentials
  AdminApp->>API: POST /api/admin/login
  API->>DB: Verify admin by username
  API->>API: Compare password hash
  API-->>AdminApp: access + refresh token
  AdminApp->>API: Subsequent request with bearer token
  API->>API: Validate token and claims
  API-->>AdminApp: Authorized response
```

#### Middleware/Guards
```ts
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'UNAUTHORIZED' });
  }
  // token verification + claims checks here
}
```

## Unified Project Structure
```text
flix/
  apps/
    web/
      src/
        app/
        features/
        components/
        hooks/
        services/
        stores/
        utils/
      package.json
    admin/
      src/
        app/
        features/
        components/
        hooks/
        services/
        stores/
        utils/
      package.json
  services/
    api/
      src/
        modules/
        middleware/
        plugins/
        lib/
      package.json
  packages/
    design-system/
      src/
        tokens/
        foundations/
        components/
        patterns/
        lib/
      package.json
    shared/                 # planned
      src/
        contracts/
        types/
      package.json
    config/                 # planned
      eslint/
      tsconfig/
      vitest/
  docs/
    project-brief.md
    prd.md
    architecture.md
    design-system-extraction.md
  design-system/            # reference-only legacy input
  package.json
```

## Development Workflow

### Local Development Setup
#### Prerequisites
```bash
node -v   # >= 22 recommended
npm -v    # >= 11
docker -v # optional for local postgres/redis
```

#### Initial Setup
```bash
npm install
cp .env.example .env
npm run dev
```

#### Development Commands
```bash
# Start all workspaces
npm run dev

# Start web only
npm run dev:web

# Start admin only
npm run dev:admin

# Start api only
npm run dev:api

# Run tests (all workspaces)
npm run test
```

### Environment Configuration
#### Required Environment Variables
```bash
# Frontend apps (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend API (.env)
API_PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/flix
JWT_ACCESS_SECRET=replace_me
JWT_REFRESH_SECRET=replace_me
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
STORAGE_BUCKET=flix-assets
STORAGE_ENDPOINT=
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000

# Shared/observability
SENTRY_DSN=
LOG_LEVEL=info
NODE_ENV=development
```

## Deployment Architecture

### Deployment Strategy
**Frontend Deployment:**
- **Platform:** Vercel (separate projects for web/admin)
- **Build Command:** `npm run build --workspace @flix/web` and `npm run build --workspace @flix/admin`
- **Output Directory:** Next.js default output
- **CDN/Edge:** Vercel Edge + global CDN

**Backend Deployment:**
- **Platform:** Railway service (containerized Node runtime)
- **Build Command:** `npm run build --workspace @flix/api`
- **Deployment Method:** Git-based continuous deployment with environment promotion

### CI/CD Pipeline
```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
```

### Environments
| Environment | Frontend URL | Backend URL | Purpose |
|---|---|---|---|
| Development | http://localhost:3000 (web), http://localhost:3002 (admin) | http://localhost:3001 | Local development |
| Staging | https://staging-web.flix.app / https://staging-admin.flix.app | https://staging-api.flix.app | Pre-production validation |
| Production | https://flix.app / https://admin.flix.app | https://api.flix.app | Live environment |

## Security and Performance

### Security Requirements
**Frontend Security:**
- CSP Headers: strict policy with allowed media/embed origins.
- XSS Prevention: escaped rendering + no unsafe HTML without sanitization.
- Secure Storage: prefer httpOnly cookies for refresh token, in-memory access token.

**Backend Security:**
- Input Validation: schema validation at route boundaries.
- Rate Limiting: IP/token-based throttling on auth and public endpoints.
- CORS Policy: explicit allowlist per environment.

**Authentication Security:**
- Token Storage: short-lived access token + rotating refresh token.
- Session Management: refresh revocation on logout/password reset.
- Password Policy: minimum length + strong hash algorithm.

### Performance Optimization
**Frontend Performance:**
- Bundle Size Target: < 250KB gz initial route where possible.
- Loading Strategy: route-level splitting + prioritized media loading.
- Caching Strategy: static assets long-cache, API query caching via TanStack Query.

**Backend Performance:**
- Response Time Target: p95 < 300ms for core read endpoints.
- Database Optimization: indexed lookup paths for slug, event_id, lesson windows.
- Caching Strategy: optional Redis for hot reads and rate-limit storage.

## Testing Strategy

### Testing Pyramid
```text
          E2E Tests
         /        \
    Integration Tests
       /            \
  Frontend Unit  Backend Unit
```

### Test Organization
- `apps/web/src/**/*.test.tsx` for UI/unit tests.
- `apps/admin/src/**/*.test.tsx` for admin flow components.
- `services/api/src/**/*.test.ts` for unit tests.
- `services/api/tests/integration/**/*.test.ts` for API contracts.
- `tests/e2e/**/*.spec.ts` for cross-app journey smoke tests.

### Minimum MVP Coverage Targets
- Core domain services (release-window, quiz scoring): >= 80%.
- API integration tests for critical flows: auth, event/lesson lifecycle, access checks, quiz submission.
- At least one E2E path per critical journey:
  - Admin creates event + lesson
  - Learner accesses released lesson
  - Learner blocked on locked/expired lesson

## Architecture Decision Notes
- Keep schema design simple and normalized for MVP; optimize with selective denormalization only after measured bottlenecks.
- Defer external logo-generation integration to post-MVP adapter to avoid coupling core publishing flow to third-party availability.
- Treat `design-system/` root folder as migration input only; canonical design artifacts must live in `packages/design-system`.
