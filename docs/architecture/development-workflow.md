# Development Workflow

## Local Development Setup
### Prerequisites
```bash
node -v   # >= 22 recommended
npm -v    # >= 11
docker -v # optional for local postgres/redis
```

### Initial Setup
```bash
npm install
cp .env.example .env
npm run dev
```

### Development Commands
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

## Environment Configuration
### Required Environment Variables
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
