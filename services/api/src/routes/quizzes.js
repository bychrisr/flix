import { z } from 'zod';
import { requireAdmin } from '../middleware/require-admin.js';
import { createQuizService } from '../services/quiz-service.js';

const quizOptionSchema = z.object({
  text: z.string().min(1).max(300),
  isCorrect: z.boolean(),
});

const quizQuestionSchema = z.object({
  prompt: z.string().min(3).max(500),
  order: z.number().int().positive().optional(),
  options: z.array(quizOptionSchema).min(2).max(10),
});

const quizPayloadSchema = z.object({
  eventId: z.uuid(),
  lessonId: z.uuid(),
  title: z.string().min(3).max(160),
  passPercentage: z.number().int().min(0).max(100).optional(),
  questions: z.array(quizQuestionSchema).min(1).max(30),
});

const quizUpdatePayloadSchema = z.object({
  title: z.string().min(3).max(160),
  passPercentage: z.number().int().min(0).max(100).optional(),
  questions: z.array(quizQuestionSchema).min(1).max(30),
});

const errorResponse = (reply, error) => {
  if (error.statusCode && error.error) {
    return reply.code(error.statusCode).send({ error: error.error, message: error.message });
  }
  throw error;
};

export const registerQuizRoutes = async (
  app,
  {
    eventService,
    lessonService,
    quizService = createQuizService({ eventService, lessonService }),
  },
) => {
  app.post('/api/quizzes', { preHandler: [requireAdmin] }, async (request, reply) => {
    const parsed = quizPayloadSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid quiz payload',
        details: parsed.error.flatten(),
      });
    }

    try {
      const item = quizService.createQuiz(parsed.data);
      return reply.code(201).send({ item });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });

  app.get('/api/quizzes/:quizId', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      const item = quizService.getQuizForAdmin(request.params.quizId);
      return reply.send({ item });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });

  app.put('/api/quizzes/:quizId', { preHandler: [requireAdmin] }, async (request, reply) => {
    const parsed = quizUpdatePayloadSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid quiz update payload',
        details: parsed.error.flatten(),
      });
    }

    try {
      const item = quizService.updateQuiz(request.params.quizId, parsed.data);
      return reply.send({ item });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });

  app.delete('/api/quizzes/:quizId', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      quizService.deleteQuiz(request.params.quizId);
      return reply.code(204).send();
    } catch (error) {
      return errorResponse(reply, error);
    }
  });
};
