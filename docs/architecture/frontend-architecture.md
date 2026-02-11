# Frontend Architecture

## Component Architecture
### Component Organization
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

### Component Template
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

## State Management Architecture
### State Structure
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

### State Management Patterns
- Server state with TanStack Query (API data, caching, invalidation).
- Minimal local UI/session state in Zustand stores.
- Derived release-status logic from server payloads, not client-only inference.

## Routing Architecture
### Route Organization
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

### Protected Route Pattern
```ts
export async function requireAdminSession(token: string | null) {
  if (!token) {
    throw new Error('UNAUTHORIZED');
  }
  return true;
}
```

## Frontend Services Layer
### API Client Setup
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

### Service Example
```ts
export async function fetchPublicEvent(slug: string) {
  return api.get(`/api/public/events/${slug}`);
}
```
