const createError = (statusCode, error, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.error = error;
  return err;
};

export const MAX_MATERIAL_SIZE_BYTES = 25 * 1024 * 1024;
export const allowedMaterialTypes = new Set([
  'application/pdf',
  'application/zip',
  'image/png',
  'image/jpeg',
  'text/plain',
]);

export const createMaterialService = ({ eventService, lessonService }) => {
  const materialsById = new Map();

  const assertLessonContext = (eventId, lessonId) => {
    const event = eventService.getEventById(eventId);
    if (!event) {
      throw createError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    const lesson = lessonService.getLessonById(lessonId);
    if (!lesson || lesson.eventId !== eventId) {
      throw createError(404, 'LESSON_NOT_FOUND', 'Lesson not found');
    }

    return { event, lesson };
  };

  const validateMaterialInput = (payload) => {
    if (!allowedMaterialTypes.has(payload.mimeType)) {
      throw createError(400, 'MATERIAL_INVALID_TYPE', 'Material file type is not allowed');
    }

    if (payload.sizeBytes > MAX_MATERIAL_SIZE_BYTES) {
      throw createError(400, 'MATERIAL_TOO_LARGE', 'Material file exceeds maximum size limit');
    }

    try {
      const url = new URL(payload.downloadUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('invalid protocol');
      }
    } catch {
      throw createError(400, 'MATERIAL_INVALID_URL', 'Material download URL is invalid');
    }
  };

  const listByLesson = (eventId, lessonId) => {
    assertLessonContext(eventId, lessonId);

    return Array.from(materialsById.values())
      .filter((item) => item.lessonId === lessonId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((item) => ({ ...item }));
  };

  const createMany = (eventId, lessonId, files) => {
    assertLessonContext(eventId, lessonId);

    const now = new Date().toISOString();
    const created = files.map((file) => {
      validateMaterialInput(file);
      const material = {
        id: crypto.randomUUID(),
        eventId,
        lessonId,
        fileName: file.fileName.trim(),
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        downloadUrl: file.downloadUrl,
        createdAt: now,
      };
      materialsById.set(material.id, material);
      return material;
    });

    return created.map((item) => ({ ...item }));
  };

  return {
    listByLesson,
    createMany,
  };
};
