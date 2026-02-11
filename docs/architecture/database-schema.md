# Database Schema
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
