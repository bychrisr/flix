const accessMessages = {
  released: 'Lesson is available',
  locked: 'Lesson is not released yet',
  expired: 'Lesson access has expired',
  blocked_private: 'Private event access is required',
};

const createError = (statusCode, error, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.error = error;
  return err;
};

export const createLearnerAccessService = ({ eventService, lessonService }) => {
  const evaluateAccess = ({ eventSlug, lessonSlug, eventAccessKey }) => {
    const event = eventService.getEventBySlug(eventSlug);
    if (!event) {
      throw createError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    const lesson = lessonService.getLessonBySlug(event.id, lessonSlug);
    if (!lesson) {
      throw createError(404, 'LESSON_NOT_FOUND', 'Lesson not found');
    }

    if (event.visibility === 'private') {
      const isValidKey = Boolean(event.accessKey) && eventAccessKey === event.accessKey;
      if (!isValidKey) {
        return {
          authorized: false,
          status: 'blocked_private',
          message: accessMessages.blocked_private,
          event,
          lesson,
        };
      }
    }

    const status = lessonService.resolveLessonStatus(lesson);
    return {
      authorized: status === 'released',
      status,
      message: accessMessages[status],
      event,
      lesson,
    };
  };

  return {
    evaluateAccess,
  };
};
