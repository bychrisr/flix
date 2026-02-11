# Deployment Architecture

## Deployment Strategy
**Frontend Deployment:**
- **Platform:** Vercel (separate projects for web/admin)
- **Build Command:** `npm run build --workspace @flix/web` and `npm run build --workspace @flix/admin`
- **Output Directory:** Next.js default output
- **CDN/Edge:** Vercel Edge + global CDN

**Backend Deployment:**
- **Platform:** Railway service (containerized Node runtime)
- **Build Command:** `npm run build --workspace @flix/api`
- **Deployment Method:** Git-based continuous deployment with environment promotion

## CI/CD Pipeline
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

## Environments
| Environment | Frontend URL | Backend URL | Purpose |
|---|---|---|---|
| Development | http://localhost:3000 (web), http://localhost:3002 (admin) | http://localhost:3001 | Local development |
| Staging | https://staging-web.flix.app / https://staging-admin.flix.app | https://staging-api.flix.app | Pre-production validation |
| Production | https://flix.app / https://admin.flix.app | https://api.flix.app | Live environment |
