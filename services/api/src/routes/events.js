import { requireAdmin } from '../middleware/require-admin.js';
import { z } from 'zod';
import { createEventService } from '../services/event-service.js';

const visibilitySchema = z.enum(['public', 'private']);
const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Expected 6-digit hex color');
const heroSchema = z
  .object({
    title: z.string().min(1).max(120),
    subtitle: z.string().min(1).max(220),
    ctaText: z.string().min(1).max(40),
  })
  .strict();
const visualStyleSchema = z
  .object({
    backgroundColor: hexColorSchema,
    textColor: hexColorSchema,
    accentColor: hexColorSchema,
  })
  .strict();
const logoUrlSchema = z.string().url().max(400);

const createEventSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
  visibility: visibilitySchema.optional(),
  accessKey: z.string().min(6).max(64).optional(),
  hero: heroSchema.optional(),
  visualStyle: visualStyleSchema.optional(),
  logoUrl: logoUrlSchema.optional(),
});

const updateEventSchema = z
  .object({
    title: z.string().min(3).optional(),
    slug: z.string().min(3).optional(),
    description: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
    visibility: visibilitySchema.optional(),
    accessKey: z.string().min(6).max(64).nullable().optional(),
    hero: heroSchema.optional(),
    visualStyle: visualStyleSchema.optional(),
    logoUrl: logoUrlSchema.nullable().optional(),
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

export const registerEventRoutes = async (app, { eventService = createEventService() } = {}) => {
  app.get('/api/events', { preHandler: [requireAdmin] }, async () => ({
    items: eventService.listEvents(),
  }));

  app.post('/api/events', { preHandler: [requireAdmin] }, async (request, reply) => {
    const parsed = createEventSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid event payload',
        details: parsed.error.flatten(),
      });
    }

    try {
      const item = eventService.createEvent(parsed.data);
      return reply.code(201).send({ item });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });

  app.put('/api/events/:eventId', { preHandler: [requireAdmin] }, async (request, reply) => {
    const parsed = updateEventSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid event update payload',
        details: parsed.error.flatten(),
      });
    }

    try {
      const item = eventService.updateEvent(request.params.eventId, parsed.data);
      return reply.send({ item });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });

  app.delete('/api/events/:eventId', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      eventService.deleteEvent(request.params.eventId);
      return reply.code(204).send();
    } catch (error) {
      return errorResponse(reply, error);
    }
  });
};
