import Fastify from 'fastify';
import { registerSecurityPlugins } from './plugins/security.js';
import { registerErrorHandler } from './plugins/error-handler.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerAdminAuthRoutes } from './routes/admin-auth.js';
import { registerEventRoutes } from './routes/events.js';

export const createApp = async () => {
  const app = Fastify({ logger: true });

  registerErrorHandler(app);
  await registerSecurityPlugins(app);

  await registerHealthRoutes(app);
  await registerAdminAuthRoutes(app);
  await registerEventRoutes(app);

  return app;
};
