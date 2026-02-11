# Security and Performance

## Security Requirements
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

## Performance Optimization
**Frontend Performance:**
- Bundle Size Target: < 250KB gz initial route where possible.
- Loading Strategy: route-level splitting + prioritized media loading.
- Caching Strategy: static assets long-cache, API query caching via TanStack Query.

**Backend Performance:**
- Response Time Target: p95 < 300ms for core read endpoints.
- Database Optimization: indexed lookup paths for slug, event_id, lesson windows.
- Caching Strategy: optional Redis for hot reads and rate-limit storage.
