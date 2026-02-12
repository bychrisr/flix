import { requireAdmin } from '../middleware/require-admin.js';

export const registerEventRoutes = async (app) => {
  app.get('/api/events', { preHandler: [requireAdmin] }, async () => ({ items: [] }));
};
