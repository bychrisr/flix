const splitCsv = (value, fallback) => {
  const raw = value ?? fallback;
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toInt(process.env.API_PORT, 3001),
  databaseUrl: process.env.DATABASE_URL ?? 'file:.data/flix.sqlite',
  databaseProfile: process.env.DATABASE_PROFILE ?? 'local',
  persistenceAdapter:
    process.env.PERSISTENCE_ADAPTER ?? (process.env.NODE_ENV === 'test' ? 'memory' : 'sqlite'),
  corsOrigins: splitCsv(
    process.env.CORS_ORIGIN,
    'http://localhost:5173,http://localhost:5174,http://localhost:3000,http://localhost:3002',
  ),
  rateLimitMax: toInt(process.env.RATE_LIMIT_MAX, 100),
  rateLimitWindowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-me',
  jwtAccessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
  adminUsername: process.env.ADMIN_USERNAME ?? 'admin',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'admin123',
  brandingProvider: process.env.BRANDING_PROVIDER ?? 'gemini',
  brandingPromptVersion: process.env.BRANDING_PROMPT_VERSION ?? 'v1',
  brandingTimeoutMs: toInt(process.env.BRANDING_TIMEOUT_MS, 9000),
  brandingMaxRetries: toInt(process.env.BRANDING_MAX_RETRIES, 2),
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
};
