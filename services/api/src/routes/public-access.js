import { z } from 'zod';

const accessPayloadSchema = z
  .object({
    eventAccessKey: z.string().min(6).max(64).optional(),
  })
  .optional();

const quizSubmitPayloadSchema = z.object({
  eventAccessKey: z.string().min(6).max(64).optional(),
  answers: z
    .array(
      z.object({
        questionId: z.uuid(),
        optionId: z.uuid(),
      }),
    )
    .max(100),
});

const errorResponse = (reply, error) => {
  if (error.statusCode && error.error) {
    return reply.code(error.statusCode).send({ error: error.error, message: error.message });
  }
  throw error;
};

const buildEmbedUrl = (provider, videoId) => {
  if (provider === 'vimeo') {
    return `https://player.vimeo.com/video/${videoId}`;
  }
  if (provider === 'gemini_stream') {
    return `https://stream.gemini.google/embed/${videoId}`;
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
};

const mapNavigationLesson = (lesson, lessonService) => {
  if (!lesson) {
    return null;
  }
  return {
    slug: lesson.slug,
    title: lesson.title,
    status: lessonService.resolveLessonStatus(lesson),
  };
};

export const registerPublicAccessRoutes = async (
  app,
  {
    learnerAccessService,
    eventService,
    lessonService,
    materialService,
    quizService,
    observabilityService,
  },
) => {
  app.post('/api/public/events/:eventSlug/catalog', async (request, reply) => {
    const parsed = accessPayloadSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid catalog payload',
        details: parsed.error.flatten(),
        requestId: request.id,
      });
    }

    const event = eventService.getEventBySlug(request.params.eventSlug);
    if (!event) {
      return reply.code(404).send({ error: 'EVENT_NOT_FOUND', message: 'Event not found' });
    }

    if (event.visibility === 'private') {
      const isValidKey =
        Boolean(event.accessKey) && parsed.data?.eventAccessKey === event.accessKey;
      if (!isValidKey) {
        return reply.code(403).send({
          error: 'EVENT_ACCESS_DENIED',
          status: 'blocked_private',
          message: 'Private event access is required',
        });
      }
    }

    const items = lessonService.listLessonsByEvent(event.id).map((lesson) => ({
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      videoProvider: lesson.videoProvider,
      videoId: lesson.videoId,
      releaseAt: lesson.releaseAt,
      expiresAt: lesson.expiresAt,
      status: lessonService.resolveLessonStatus(lesson),
    }));

    return reply.send({
      event: {
        id: event.id,
        slug: event.slug,
        title: event.title,
        description: event.description,
        visibility: event.visibility,
        logoUrl: event.logoUrl,
        highlightVideoUrl: event.highlightVideoUrl ?? null,
        hero: event.hero,
      },
      catalog: {
        items,
        isEmpty: items.length === 0,
      },
      serverTime: new Date().toISOString(),
    });
  });
  app.post(
    '/api/public/events/:eventSlug/lessons/:lessonSlug/access-check',
    async (request, reply) => {
      const parsed = accessPayloadSchema.safeParse(request.body);
      if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid access-check payload',
        details: parsed.error.flatten(),
        requestId: request.id,
      });
      }

      try {
        const serverTime = new Date().toISOString();
        const access = learnerAccessService.evaluateAccess({
          eventSlug: request.params.eventSlug,
          lessonSlug: request.params.lessonSlug,
          eventAccessKey: parsed.data?.eventAccessKey,
        });
        observabilityService?.emitEvent(request, 'lesson_access_evaluated', {
          eventSlug: request.params.eventSlug,
          lessonSlug: request.params.lessonSlug,
          status: access.status,
          authorized: access.authorized,
        });
        observabilityService?.emitKpiHook(request, 'kpi_lesson_access_check', {
          status: access.status,
          authorized: access.authorized,
        });

        return reply.send({
          authorized: access.authorized,
          status: access.status,
          message: access.message,
          serverTime,
          timing: {
            ...lessonService.getCountdownData(access.lesson, new Date(serverTime)),
            serverTime,
          },
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
        requestId: request.id,
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
        player: {
          provider: access.lesson.videoProvider,
          videoId: access.lesson.videoId,
          embedUrl: buildEmbedUrl(access.lesson.videoProvider, access.lesson.videoId),
          constraints: {
            allowedDomains: ['flix.app', 'www.flix.app'],
            disableDownload: true,
            disablePictureInPicture: false,
            referrerPolicy: 'strict-origin-when-cross-origin',
          },
        },
        lesson: {
          id: access.lesson.id,
          slug: access.lesson.slug,
          title: access.lesson.title,
          videoProvider: access.lesson.videoProvider,
          videoId: access.lesson.videoId,
          releaseAt: access.lesson.releaseAt,
          expiresAt: access.lesson.expiresAt,
        },
        navigation: (() => {
          const adjacent = lessonService.getAdjacentLessonsBySlug(
            access.event.id,
            access.lesson.slug,
          );
          return {
            previous: mapNavigationLesson(adjacent.previous, lessonService),
            next: mapNavigationLesson(adjacent.next, lessonService),
          };
        })(),
      });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });

  app.post('/api/public/events/:eventSlug/lessons/:lessonSlug/materials', async (request, reply) => {
    const parsed = accessPayloadSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid materials payload',
        details: parsed.error.flatten(),
        requestId: request.id,
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

      const items = materialService.listByLesson(access.event.id, access.lesson.id);
      return reply.send({ items });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });

  app.post('/api/public/events/:eventSlug/lessons/:lessonSlug/quiz', async (request, reply) => {
    const parsed = accessPayloadSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid quiz payload',
        details: parsed.error.flatten(),
        requestId: request.id,
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

      const quiz = quizService.getQuizByLesson(access.lesson.id);
      if (!quiz) {
        return reply.code(404).send({ error: 'QUIZ_NOT_FOUND', message: 'Quiz not found' });
      }
      observabilityService?.emitEvent(request, 'quiz_loaded', {
        eventSlug: request.params.eventSlug,
        lessonSlug: request.params.lessonSlug,
        quizId: quiz.id,
      });
      observabilityService?.emitKpiHook(request, 'kpi_quiz_started', {
        quizId: quiz.id,
      });

      return reply.send({ item: quizService.getQuizForLearner(quiz.id) });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });

  app.post('/api/public/events/:eventSlug/lessons/:lessonSlug/quiz/submit', async (request, reply) => {
    const parsed = quizSubmitPayloadSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid quiz submit payload',
        details: parsed.error.flatten(),
        requestId: request.id,
      });
    }

    try {
      const access = learnerAccessService.evaluateAccess({
        eventSlug: request.params.eventSlug,
        lessonSlug: request.params.lessonSlug,
        eventAccessKey: parsed.data.eventAccessKey,
      });

      if (!access.authorized) {
        return reply.code(403).send({
          error: 'LESSON_ACCESS_DENIED',
          status: access.status,
          message: access.message,
        });
      }

      const quiz = quizService.getQuizByLesson(access.lesson.id);
      if (!quiz) {
        return reply.code(404).send({ error: 'QUIZ_NOT_FOUND', message: 'Quiz not found' });
      }

      const result = quizService.submitAttempt(quiz.id, parsed.data.answers);
      observabilityService?.emitEvent(request, 'quiz_submitted', {
        eventSlug: request.params.eventSlug,
        lessonSlug: request.params.lessonSlug,
        quizId: quiz.id,
        scorePercentage: result.scorePercentage,
        passed: result.passed,
      });
      observabilityService?.emitKpiHook(request, 'kpi_quiz_completed', {
        quizId: quiz.id,
        scorePercentage: result.scorePercentage,
        passed: result.passed,
      });
      return reply.send({
        lesson: {
          id: access.lesson.id,
          slug: access.lesson.slug,
          title: access.lesson.title,
        },
        quiz: {
          id: quiz.id,
          title: quiz.title,
        },
        result,
      });
    } catch (error) {
      return errorResponse(reply, error);
    }
  });
};
