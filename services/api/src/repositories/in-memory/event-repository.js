export const createInMemoryEventRepository = () => {
  const eventsById = new Map();

  return {
    list: () =>
      Array.from(eventsById.values())
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .map((event) => ({ ...event })),

    findById: (id) => {
      const event = eventsById.get(id);
      return event ? { ...event } : null;
    },

    findBySlug: (slug) => {
      for (const event of eventsById.values()) {
        if (event.slug === slug) {
          return { ...event };
        }
      }
      return null;
    },

    insert: (event) => {
      eventsById.set(event.id, { ...event });
      return { ...event };
    },

    update: (id, event) => {
      eventsById.set(id, { ...event });
      return { ...event };
    },

    deleteById: (id) => eventsById.delete(id),

    count: () => eventsById.size,
  };
};
