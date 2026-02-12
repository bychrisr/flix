import { createInMemoryEventRepository } from '../repositories/in-memory/event-repository.js';

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

export const createEventService = ({ eventRepository = createInMemoryEventRepository() } = {}) => {
  const hasSlugConflict = (slug, excludedId = null) => {
    const existing = eventRepository.findBySlug(normalizeSlug(slug));
    return Boolean(existing && existing.id !== excludedId);
  };

  const listEvents = () => eventRepository.list();

  const getEventById = (id) => eventRepository.findById(id);

  const getEventBySlug = (slug) => eventRepository.findBySlug(normalizeSlug(slug));

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
      logoUrl: payload.logoUrl?.trim() || null,
      brandingProvider: payload.brandingProvider?.trim() || null,
      brandingPromptVersion: payload.brandingPromptVersion?.trim() || null,
      brandingGeneratedAt: payload.brandingGeneratedAt ?? null,
      createdAt: now,
      updatedAt: now,
    };

    if (!allowedVisibility.includes(event.visibility)) {
      throw createError(400, 'VALIDATION_ERROR', 'Invalid event visibility');
    }

    return eventRepository.insert(event);
  };

  const updateEvent = (id, payload) => {
    const existing = eventRepository.findById(id);
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
      logoUrl: payload.logoUrl === undefined ? existing.logoUrl : payload.logoUrl?.trim() || null,
      brandingProvider:
        payload.brandingProvider === undefined
          ? existing.brandingProvider
          : payload.brandingProvider?.trim() || null,
      brandingPromptVersion:
        payload.brandingPromptVersion === undefined
          ? existing.brandingPromptVersion
          : payload.brandingPromptVersion?.trim() || null,
      brandingGeneratedAt:
        payload.brandingGeneratedAt === undefined
          ? existing.brandingGeneratedAt
          : payload.brandingGeneratedAt ?? null,
      updatedAt: new Date().toISOString(),
    };

    return eventRepository.update(existing.id, updated);
  };

  const deleteEvent = (id) => {
    const deleted = eventRepository.deleteById(id);
    if (!deleted) {
      throw createError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }
  };

  return {
    listEvents,
    getEventById,
    getEventBySlug,
    countEvents: () => eventRepository.count(),
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
