# Testing Strategy

## Testing Pyramid
```text
          E2E Tests
         /        \
    Integration Tests
       /            \
  Frontend Unit  Backend Unit
```

## Test Organization
- `apps/web/src/**/*.test.tsx` for UI/unit tests.
- `apps/admin/src/**/*.test.tsx` for admin flow components.
- `services/api/src/**/*.test.ts` for unit tests.
- `services/api/tests/integration/**/*.test.ts` for API contracts.
- `tests/e2e/**/*.spec.ts` for cross-app journey smoke tests.

## Minimum MVP Coverage Targets
- Core domain services (release-window, quiz scoring): >= 80%.
- API integration tests for critical flows: auth, event/lesson lifecycle, access checks, quiz submission.
- At least one E2E path per critical journey:
  - Admin creates event + lesson
  - Learner accesses released lesson
  - Learner blocked on locked/expired lesson
