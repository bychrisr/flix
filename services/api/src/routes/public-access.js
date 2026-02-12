import { z } from 'zod';

const accessPayloadSchema = z
  .object({
    eventAccessKey: z.string().min(6).max(64).optional(),
  })
  .optional();

const errorResponse = (reply, error) => {
  if (error.statusCode && error.error) {
    return reply.code(error.statusCode).send({ error: error.error, message: error.message });
  }
  throw error;
};

export const registerPublicAccessRoutes = async (app, { learnerAccessService }) => {
  app.post(
    '/api/public/events/:eventSlug/lessons/:lessonSlug/access-check',
    async (request, reply) => {
      const parsed = accessPayloadSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: 'VALIDATION_ERROR',
          message: 'Invalid access-check payload',
          details: parsed.error.flatten(),
        });
      }

      try {
        const access = learnerAccessService.evaluateAccess({
          eventSlug: request.params.eventSlug,
          lessonSlug: request.params.lessonSlug,
          eventAccessKey: parsed.data?.eventAccessKey,
        });

        return reply.send({
          authorized: access.authorized,
          status: access.status,
          message: access.message,
          serverTime: new Date().toISOString(),
        });
      } catch (error) {
        return errorResponse(reply, error);
      }
    },
  );

  app.post('/api/public/events/:eventSlug/lessons/:lessonSlug/playback', async (request, reply) => {
    const parsed = accessPayloadSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid playback payload',
        details: parsed.error.flatten(),
      });
    }

    try {
      const access = learnerAccessService.evaluateAccess({
        eventSlug: request.params.eventSlug,
        lessonSlug: request.params.lessonSlug,
        eventAccessKey: parsed.data?.eventAccessKey,
      });

      if (!access.authorized) {
        return reply.code(403).send({
          error: 'LESSON_ACCESS_DENIED',
          status: access.status,
          message: access.message,
        });
      }

      return reply.send({
        lesson: {
          id: access.lesson.id,
          slug: access.lesson.slug,
          title: access.lesson.title,
          releaseAt: access.lesson.releaseAt,
          expiresAt: access.lesson.expiresAt,
        },
      });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });
};
