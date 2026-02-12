const createError = (statusCode, error, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.error = error;
  return err;
};

export const createLessonService = ({ eventService }) => {
  const lessonsById = new Map();
  const normalizeLessonSlug = (slug) => slug.trim().toLowerCase();
  const normalizeVideoProvider = (provider) => provider.trim().toLowerCase();

  const assertEventExists = (eventId) => {
    const event = eventService.getEventById(eventId);
    if (!event) {
      throw createError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }
  };

  const assertValidWindow = ({ releaseAt, expiresAt }) => {
    if (!expiresAt) {
      return;
    }
    if (new Date(expiresAt).getTime() <= new Date(releaseAt).getTime()) {
      throw createError(
        400,
        'LESSON_INVALID_WINDOW',
        'Lesson expiration must be later than release datetime',
      );
    }
  };

  const listLessonsByEvent = (eventId) => {
    assertEventExists(eventId);
    return Array.from(lessonsById.values())
      .filter((lesson) => lesson.eventId === eventId)
      .sort((a, b) => a.releaseAt.localeCompare(b.releaseAt))
      .map((lesson) => ({ ...lesson }));
  };

  const createLesson = (eventId, payload) => {
    assertEventExists(eventId);
    assertValidWindow(payload);

    const now = new Date().toISOString();
    const lesson = {
      id: crypto.randomUUID(),
      eventId,
      title: payload.title.trim(),
      slug: normalizeLessonSlug(payload.slug),
      videoProvider: payload.videoProvider ? normalizeVideoProvider(payload.videoProvider) : 'youtube',
      videoId: payload.videoId?.trim() ?? normalizeLessonSlug(payload.slug),
      releaseAt: payload.releaseAt,
      expiresAt: payload.expiresAt ?? null,
      createdAt: now,
      updatedAt: now,
    };

    lessonsById.set(lesson.id, lesson);
    return { ...lesson };
  };

  const updateLesson = (eventId, lessonId, payload) => {
    assertEventExists(eventId);
    const lesson = lessonsById.get(lessonId);
    if (!lesson || lesson.eventId !== eventId) {
      throw createError(404, 'LESSON_NOT_FOUND', 'Lesson not found');
    }

    const next = {
      ...lesson,
      title: payload.title?.trim() ?? lesson.title,
      slug: payload.slug ? normalizeLessonSlug(payload.slug) : lesson.slug,
      videoProvider: payload.videoProvider
        ? normalizeVideoProvider(payload.videoProvider)
        : lesson.videoProvider,
      videoId: payload.videoId?.trim() ?? lesson.videoId,
      releaseAt: payload.releaseAt ?? lesson.releaseAt,
      expiresAt: payload.expiresAt === undefined ? lesson.expiresAt : payload.expiresAt,
      updatedAt: new Date().toISOString(),
    };

    assertValidWindow(next);
    lessonsById.set(lesson.id, next);
    return { ...next };
  };

  const deleteLesson = (eventId, lessonId) => {
    assertEventExists(eventId);
    const lesson = lessonsById.get(lessonId);
    if (!lesson || lesson.eventId !== eventId) {
      throw createError(404, 'LESSON_NOT_FOUND', 'Lesson not found');
    }
    lessonsById.delete(lessonId);
  };

  return {
    getLessonById: (lessonId) => {
      const lesson = lessonsById.get(lessonId);
      return lesson ? { ...lesson } : null;
    },
    listLessonsByEvent,
    listLessonsByEventSlug: (eventSlug) => {
      const event = eventService.getEventBySlug(eventSlug);
      if (!event) {
        throw createError(404, 'EVENT_NOT_FOUND', 'Event not found');
      }
      return listLessonsByEvent(event.id);
    },
    getLessonBySlug: (eventId, lessonSlug) => {
      const normalizedSlug = normalizeLessonSlug(lessonSlug);
      for (const lesson of lessonsById.values()) {
        if (lesson.eventId === eventId && lesson.slug === normalizedSlug) {
          return { ...lesson };
        }
      }
      return null;
    },
    getAdjacentLessonsBySlug: (eventId, lessonSlug) => {
      const lessons = listLessonsByEvent(eventId);
      const idx = lessons.findIndex((lesson) => lesson.slug === normalizeLessonSlug(lessonSlug));
      if (idx === -1) {
        return { previous: null, next: null };
      }
      const previous = idx > 0 ? lessons[idx - 1] : null;
      const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;
      return { previous, next };
    },
    resolveLessonStatus: (lesson, referenceDate = new Date()) => {
      const now = referenceDate.getTime();
      const releaseAt = new Date(lesson.releaseAt).getTime();
      const expiresAt = lesson.expiresAt ? new Date(lesson.expiresAt).getTime() : null;

      if (releaseAt > now) {
        return 'locked';
      }
      if (expiresAt !== null && expiresAt <= now) {
        return 'expired';
      }
      return 'released';
    },
    getCountdownData: (lesson, referenceDate = new Date()) => {
      const now = referenceDate.getTime();
      const releaseAt = new Date(lesson.releaseAt).getTime();
      const remainingMs = Math.max(0, releaseAt - now);
      return {
        releaseAt: lesson.releaseAt,
        expiresAt: lesson.expiresAt,
        unlocksInSeconds: Math.ceil(remainingMs / 1000),
      };
    },
    countLessons: () => lessonsById.size,
    getReleaseStatusDistribution: (referenceDate = new Date()) => {
      const now = referenceDate.getTime();
      const distribution = { upcoming: 0, available: 0, expired: 0 };

      for (const lesson of lessonsById.values()) {
        const releaseTime = new Date(lesson.releaseAt).getTime();
        const expiresTime = lesson.expiresAt ? new Date(lesson.expiresAt).getTime() : null;

        if (releaseTime > now) {
          distribution.upcoming += 1;
          continue;
        }

        if (expiresTime !== null && expiresTime <= now) {
          distribution.expired += 1;
          continue;
        }

        distribution.available += 1;
      }

      return distribution;
    },
    createLesson,
    updateLesson,
    deleteLesson,
  };
};
