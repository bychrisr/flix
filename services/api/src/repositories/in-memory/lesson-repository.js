export const createInMemoryLessonRepository = () => {
  const lessonsById = new Map();

  return {
    listByEvent: (eventId) =>
      Array.from(lessonsById.values())
        .filter((lesson) => lesson.eventId === eventId)
        .sort((a, b) => a.releaseAt.localeCompare(b.releaseAt))
        .map((lesson) => ({ ...lesson })),

    listAll: () => Array.from(lessonsById.values()).map((lesson) => ({ ...lesson })),

    findById: (id) => {
      const lesson = lessonsById.get(id);
      return lesson ? { ...lesson } : null;
    },

    findByEventAndSlug: (eventId, slug) => {
      for (const lesson of lessonsById.values()) {
        if (lesson.eventId === eventId && lesson.slug === slug) {
          return { ...lesson };
        }
      }
      return null;
    },

    insert: (lesson) => {
      lessonsById.set(lesson.id, { ...lesson });
      return { ...lesson };
    },

    update: (id, lesson) => {
      lessonsById.set(id, { ...lesson });
      return { ...lesson };
    },

    deleteById: (id) => lessonsById.delete(id),

    count: () => lessonsById.size,
  };
};
