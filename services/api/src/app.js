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

export const createApp = async () => {
  const app = Fastify({ logger: true });

  registerErrorHandler(app);
  await registerSecurityPlugins(app);
  const eventService = createEventService();
  const lessonService = createLessonService({ eventService });
  const materialService = createMaterialService({ eventService, lessonService });
  const quizService = createQuizService({ eventService, lessonService });
  const learnerAccessService = createLearnerAccessService({ eventService, lessonService });

  await registerHealthRoutes(app);
  await registerAdminAuthRoutes(app);
  await registerEventRoutes(app, { eventService });
  await registerLessonRoutes(app, { eventService, lessonService });
  await registerMaterialRoutes(app, { eventService, lessonService, materialService });
  await registerQuizRoutes(app, { eventService, lessonService, quizService });
  await registerAdminDashboardRoutes(app, { eventService, lessonService });
  await registerPublicAccessRoutes(app, {
    learnerAccessService,
    eventService,
    lessonService,
    materialService,
    quizService,
  });

  return app;
};
