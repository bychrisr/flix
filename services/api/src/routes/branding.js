import { z } from 'zod';
import { requireAdmin } from '../middleware/require-admin.js';

const generateBrandingPayloadSchema = z.object({
  prompt: z.string().min(8).max(600),
  styleHint: z.string().min(3).max(120).optional(),
  provider: z.string().min(2).max(40).optional(),
  fallbackOnError: z.boolean().optional(),
});

const errorResponse = (reply, error) => {
  if (error.statusCode && error.error) {
    return reply.code(error.statusCode).send({
      error: error.error,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }
  throw error;
};

export const registerBrandingRoutes = async (app, { brandingService }) => {
  app.post(
    '/api/events/:eventId/branding/generate',
    { preHandler: [requireAdmin] },
    async (request, reply) => {
      const parsed = generateBrandingPayloadSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: 'VALIDATION_ERROR',
          message: 'Invalid branding generation payload',
          details: parsed.error.flatten(),
        });
      }

      try {
        const item = await brandingService.generateForEvent({
          eventId: request.params.eventId,
          requestId: request.id,
          ...parsed.data,
        });
        return reply.send({ item });
      } catch (error) {
        return errorResponse(reply, error);
      }
    },
  );
};

