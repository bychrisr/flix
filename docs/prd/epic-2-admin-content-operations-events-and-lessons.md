# Epic 2 Admin Content Operations (Events and Lessons)
Epic goal: Enable complete administrative control over event and lesson lifecycle, including release scheduling logic as core business capability. This epic creates the content operations backbone of the product.

## Story 2.1 Event CRUD and Listing
As an admin,
I want to create and manage events,
so that I can define distinct course launches and their metadata.

### Acceptance Criteria
1. Admin can create, update, list, and delete events.
2. Event uniqueness constraints (e.g., slug) are enforced.
3. Event activation state is represented and editable.
4. Event visibility (`public` or `private`) is represented and editable.

## Story 2.2 Event Visual and Hero Configuration
As an admin,
I want to configure visual metadata for event presentation,
so that each launch can be branded and differentiated.

### Acceptance Criteria
1. Event form supports hero text and visual style configuration fields.
2. Stored visual configuration is retrievable through event APIs.
3. Validation prevents malformed style payloads.

## Story 2.3 Lesson CRUD with Release Window Rules
As an admin,
I want to schedule lesson release and optional expiration dates,
so that content availability follows launch strategy.

### Acceptance Criteria
1. Admin can create, update, list, and delete lessons linked to an event.
2. Release datetime is required and expiration datetime is optional.
3. Business validation rejects invalid date windows.

## Story 2.4 Admin Dashboard Operational Snapshot
As an admin,
I want dashboard-level operational metrics,
so that I can quickly understand platform publishing status.

### Acceptance Criteria
1. Dashboard exposes counts for events and lessons.
2. Dashboard shows lesson release status distribution baseline.
3. Data is sourced from API endpoints with auth protection.
