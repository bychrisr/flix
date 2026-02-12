import { z } from 'zod';
import { requireAdmin } from '../middleware/require-admin.js';
import { createLessonService } from '../services/lesson-service.js';

const isoDatetimeSchema = z.iso.datetime();

const createLessonSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  releaseAt: isoDatetimeSchema,
  expiresAt: isoDatetimeSchema.optional(),
});

const updateLessonSchema = z
  .object({
    title: z.string().min(3).optional(),
    slug: z.string().min(3).optional(),
    releaseAt: isoDatetimeSchema.optional(),
    expiresAt: isoDatetimeSchema.nullable().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field must be provided',
  });

const errorResponse = (reply, error) => {
  if (error.statusCode && error.error) {
    return reply.code(error.statusCode).send({ error: error.error, message: error.message });
  }
  throw error;
};

export const registerLessonRoutes = async (
  app,
  { eventService, lessonService = createLessonService({ eventService }) },
) => {

  app.get('/api/events/:eventId/lessons', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      const items = lessonService.listLessonsByEvent(request.params.eventId);
      return reply.send({ items });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });

  app.post('/api/events/:eventId/lessons', { preHandler: [requireAdmin] }, async (request, reply) => {
    const parsed = createLessonSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid lesson payload',
        details: parsed.error.flatten(),
      });
    }

    try {
      const item = lessonService.createLesson(request.params.eventId, parsed.data);
      return reply.code(201).send({ item });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });

  app.put(
    '/api/events/:eventId/lessons/:lessonId',
    { preHandler: [requireAdmin] },
    async (request, reply) => {
      const parsed = updateLessonSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: 'VALIDATION_ERROR',
          message: 'Invalid lesson update payload',
          details: parsed.error.flatten(),
        });
      }

      try {
        const item = lessonService.updateLesson(
          request.params.eventId,
          request.params.lessonId,
          parsed.data,
        );
        return reply.send({ item });
      } catch (error) {
        return errorResponse(reply, error);
      }
    },
  );

  app.delete(
    '/api/events/:eventId/lessons/:lessonId',
    { preHandler: [requireAdmin] },
    async (request, reply) => {
      try {
        lessonService.deleteLesson(request.params.eventId, request.params.lessonId);
        return reply.code(204).send();
      } catch (error) {
        return errorResponse(reply, error);
      }
    },
  );
};
