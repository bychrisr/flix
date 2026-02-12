const createError = (statusCode, error, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.error = error;
  return err;
};

export const createLessonService = ({ eventService }) => {
  const lessonsById = new Map();

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
      slug: payload.slug.trim().toLowerCase(),
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
      slug: payload.slug?.trim().toLowerCase() ?? lesson.slug,
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
    listLessonsByEvent,
    createLesson,
    updateLesson,
    deleteLesson,
  };
};
