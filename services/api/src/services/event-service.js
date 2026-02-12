const allowedVisibility = ['public', 'private'];
const defaultHero = {
  title: '',
  subtitle: '',
  ctaText: '',
};
const defaultVisualStyle = {
  backgroundColor: '#111111',
  textColor: '#f5f5f5',
  accentColor: '#e50914',
};

const normalizeSlug = (slug) =>
  slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');

const createError = (statusCode, error, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.error = error;
  return err;
};

export const createEventService = () => {
  const eventsById = new Map();

  const hasSlugConflict = (slug, excludedId = null) => {
    const normalizedSlug = normalizeSlug(slug);
    for (const event of eventsById.values()) {
      if (event.id !== excludedId && event.slug === normalizedSlug) {
        return true;
      }
    }
    return false;
  };

  const listEvents = () =>
    Array.from(eventsById.values())
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((event) => ({ ...event }));

  const getEventById = (id) => {
    const event = eventsById.get(id);
    return event ? { ...event } : null;
  };

  const getEventBySlug = (slug) => {
    const normalizedSlug = normalizeSlug(slug);
    for (const event of eventsById.values()) {
      if (event.slug === normalizedSlug) {
        return { ...event };
      }
    }
    return null;
  };

  const createEvent = (payload) => {
    const slug = normalizeSlug(payload.slug);
    if (hasSlugConflict(slug)) {
      throw createError(409, 'EVENT_SLUG_CONFLICT', 'Event slug is already in use');
    }

    const now = new Date().toISOString();
    const event = {
      id: crypto.randomUUID(),
      title: payload.title.trim(),
      slug,
      description: payload.description?.trim() ?? '',
      isActive: payload.isActive ?? false,
      visibility: payload.visibility ?? 'private',
      accessKey: payload.accessKey?.trim() || null,
      hero: payload.hero ?? defaultHero,
      visualStyle: payload.visualStyle ?? defaultVisualStyle,
      createdAt: now,
      updatedAt: now,
    };

    if (!allowedVisibility.includes(event.visibility)) {
      throw createError(400, 'VALIDATION_ERROR', 'Invalid event visibility');
    }

    eventsById.set(event.id, event);
    return { ...event };
  };

  const updateEvent = (id, payload) => {
    const existing = eventsById.get(id);
    if (!existing) {
      throw createError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    const nextSlug =
      typeof payload.slug === 'string' ? normalizeSlug(payload.slug) : existing.slug;
    if (hasSlugConflict(nextSlug, existing.id)) {
      throw createError(409, 'EVENT_SLUG_CONFLICT', 'Event slug is already in use');
    }

    const visibility = payload.visibility ?? existing.visibility;
    if (!allowedVisibility.includes(visibility)) {
      throw createError(400, 'VALIDATION_ERROR', 'Invalid event visibility');
    }

    const updated = {
      ...existing,
      title: payload.title?.trim() ?? existing.title,
      slug: nextSlug,
      description: payload.description?.trim() ?? existing.description,
      isActive: payload.isActive ?? existing.isActive,
      visibility,
      accessKey: payload.accessKey === undefined ? existing.accessKey : payload.accessKey?.trim() || null,
      hero: payload.hero ?? existing.hero,
      visualStyle: payload.visualStyle ?? existing.visualStyle,
      updatedAt: new Date().toISOString(),
    };

    eventsById.set(existing.id, updated);
    return { ...updated };
  };

  const deleteEvent = (id) => {
    const deleted = eventsById.delete(id);
    if (!deleted) {
      throw createError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }
  };

  return {
    listEvents,
    getEventById,
    getEventBySlug,
    countEvents: () => eventsById.size,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
