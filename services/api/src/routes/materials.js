import { z } from 'zod';
import { requireAdmin } from '../middleware/require-admin.js';
import {
  MAX_MATERIAL_SIZE_BYTES,
  allowedMaterialTypes,
  createMaterialService,
} from '../services/material-service.js';

const materialInputSchema = z.object({
  fileName: z.string().min(1).max(200),
  mimeType: z
    .string()
    .refine((value) => allowedMaterialTypes.has(value), 'Unsupported file type'),
  sizeBytes: z
    .number()
    .int()
    .positive()
    .max(MAX_MATERIAL_SIZE_BYTES),
  downloadUrl: z.url(),
});

const uploadPayloadSchema = z.object({
  files: z.array(materialInputSchema).min(1).max(20),
});

const errorResponse = (reply, error) => {
  if (error.statusCode && error.error) {
    return reply.code(error.statusCode).send({ error: error.error, message: error.message });
  }
  throw error;
};

export const registerMaterialRoutes = async (
  app,
  {
    eventService,
    lessonService,
    materialService = createMaterialService({ eventService, lessonService }),
  },
) => {
  app.get(
    '/api/events/:eventId/lessons/:lessonId/materials',
    { preHandler: [requireAdmin] },
    async (request, reply) => {
      try {
        const items = materialService.listByLesson(request.params.eventId, request.params.lessonId);
        return reply.send({ items });
      } catch (error) {
        return errorResponse(reply, error);
      }
    },
  );

  app.post(
    '/api/events/:eventId/lessons/:lessonId/materials',
    { preHandler: [requireAdmin] },
    async (request, reply) => {
      const parsed = uploadPayloadSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: 'VALIDATION_ERROR',
          message: 'Invalid material upload payload',
          details: parsed.error.flatten(),
        });
      }

      try {
        const items = materialService.createMany(
          request.params.eventId,
          request.params.lessonId,
          parsed.data.files,
        );
        return reply.code(201).send({ items });
      } catch (error) {
        return errorResponse(reply, error);
      }
    },
  );
};
