import { requireAdmin } from '../middleware/require-admin.js';

export const registerAdminDashboardRoutes = async (app, { eventService, lessonService }) => {
  app.get(
    '/api/admin/dashboard/operational-snapshot',
    { preHandler: [requireAdmin] },
    async (_, reply) => {
      const eventsCount = eventService.countEvents();
      const lessonsCount = lessonService.countLessons();
      const lessonReleaseStatus = lessonService.getReleaseStatusDistribution();

      return reply.send({
        totals: {
          events: eventsCount,
          lessons: lessonsCount,
        },
        lessonReleaseStatus,
      });
    },
  );
};
