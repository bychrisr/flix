# Data Models

## Admin
**Purpose:** Platform operator identity for admin portal access.

**Key Attributes:**
- `id`: uuid - unique admin identifier
- `username`: string - unique login identifier
- `password_hash`: string - bcrypt/argon hash
- `email`: string - contact/recovery
- `created_at`: timestamptz - audit timestamp

### TypeScript Interface
```ts
export interface Admin {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
  createdAt: string;
}
```

### Relationships
- Admin performs CRUD actions across event/lesson/quiz/material entities.

## Event
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

### TypeScript Interface
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

### Relationships
- One event has many lessons.

## Lesson
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

### TypeScript Interface
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

### Relationships
- Lesson belongs to one event.
- Lesson has many materials.
- Lesson has zero or one quiz.

## Material
**Purpose:** Support files attached to lesson.

**Key Attributes:**
- `id`: uuid
- `lesson_id`: uuid
- `file_name`: string
- `mime_type`: string
- `file_url`: string
- `size_bytes`: bigint

### TypeScript Interface
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

### Relationships
- Material belongs to one lesson.

## Quiz, QuizQuestion, QuizOption
**Purpose:** Assessment structure for lesson verification.

### TypeScript Interface
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

### Relationships
- Quiz belongs to one lesson.
- Quiz has many questions.
- Question has many options.
