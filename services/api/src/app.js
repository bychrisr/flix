import Fastify from 'fastify';
import { registerSecurityPlugins } from './plugins/security.js';
import { registerErrorHandler } from './plugins/error-handler.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerAdminAuthRoutes } from './routes/admin-auth.js';
import { registerEventRoutes } from './routes/events.js';
import { registerLessonRoutes } from './routes/lessons.js';
import { registerMaterialRoutes } from './routes/materials.js';
import { registerAdminDashboardRoutes } from './routes/admin-dashboard.js';
import { registerPublicAccessRoutes } from './routes/public-access.js';
import { createEventService } from './services/event-service.js';
import { createLessonService } from './services/lesson-service.js';
import { createMaterialService } from './services/material-service.js';
import { createLearnerAccessService } from './services/learner-access-service.js';
import { createQuizService } from './services/quiz-service.js';
import { registerQuizRoutes } from './routes/quizzes.js';
import { createObservabilityService } from './services/observability-service.js';
import { createRepositories } from './repositories/index.js';
import { env } from './config/env.js';
import { createBrandingService } from './services/branding-service.js';
import { createGeminiBrandingAdapter } from './services/branding-adapters/gemini-branding-adapter.js';
import { registerBrandingRoutes } from './routes/branding.js';

export const createApp = async ({
  logger = true,
  observabilityOverrides,
  persistenceAdapter = env.persistenceAdapter,
  databaseUrl = env.databaseUrl,
  databaseProfile = env.databaseProfile,
  brandingService: brandingServiceOverride,
  brandingProviderAdapters,
} = {}) => {
  const app = Fastify({ logger });

  registerErrorHandler(app);
  await registerSecurityPlugins(app);
  const repositories = createRepositories({
    adapter: persistenceAdapter,
    databaseUrl,
    databaseProfile,
  });

  if (typeof repositories.close === 'function') {
    app.addHook('onClose', async () => {
      repositories.close();
    });
  }

  const eventService = createEventService({ eventRepository: repositories.eventRepository });
  const lessonService = createLessonService({
    eventService,
    lessonRepository: repositories.lessonRepository,
  });
  const materialService = createMaterialService({
    eventService,
    lessonService,
    materialRepository: repositories.materialRepository,
  });
  const quizService = createQuizService({
    eventService,
    lessonService,
    quizRepository: repositories.quizRepository,
  });
  const learnerAccessService = createLearnerAccessService({ eventService, lessonService });
  const observabilityService = createObservabilityService(observabilityOverrides);
  const brandingService =
    brandingServiceOverride ??
    createBrandingService({
      eventService,
      providers: {
        gemini: createGeminiBrandingAdapter({
          apiKey: env.geminiApiKey,
          model: env.geminiModel,
        }),
        ...(brandingProviderAdapters ?? {}),
      },
      defaultProvider: env.brandingProvider,
      promptVersion: env.brandingPromptVersion,
      timeoutMs: env.brandingTimeoutMs,
      maxRetries: env.brandingMaxRetries,
    });

  await registerHealthRoutes(app);
  await registerAdminAuthRoutes(app, { observabilityService });
  await registerEventRoutes(app, { eventService });
  await registerLessonRoutes(app, { eventService, lessonService });
  await registerMaterialRoutes(app, { eventService, lessonService, materialService });
  await registerQuizRoutes(app, { eventService, lessonService, quizService });
  await registerBrandingRoutes(app, { brandingService });
  await registerAdminDashboardRoutes(app, { eventService, lessonService });
  await registerPublicAccessRoutes(app, {
    learnerAccessService,
    eventService,
    lessonService,
    materialService,
    quizService,
    observabilityService,
  });

  return app;
};
