const mapRowToEvent = (row) => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  description: row.description,
  isActive: Boolean(row.is_active),
  visibility: row.visibility,
  accessKey: row.access_key,
  hero: {
    title: row.hero_title,
    subtitle: row.hero_subtitle,
    ctaText: row.hero_cta_text,
  },
  visualStyle: {
    backgroundColor: row.background_color,
    textColor: row.text_color,
    accentColor: row.accent_color,
  },
  logoUrl: row.logo_url,
  brandingProvider: row.branding_provider,
  brandingPromptVersion: row.branding_prompt_version,
  brandingGeneratedAt: row.branding_generated_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const createSqliteEventRepository = ({ db }) => {
  const listStmt = db.prepare('SELECT * FROM events ORDER BY created_at ASC');
  const findByIdStmt = db.prepare('SELECT * FROM events WHERE id = ? LIMIT 1');
  const findBySlugStmt = db.prepare('SELECT * FROM events WHERE slug = ? LIMIT 1');
  const insertStmt = db.prepare(`
    INSERT INTO events (
      id, title, slug, description, is_active, visibility, access_key,
      hero_title, hero_subtitle, hero_cta_text,
      background_color, text_color, accent_color,
      logo_url, branding_provider, branding_prompt_version, branding_generated_at,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const updateStmt = db.prepare(`
    UPDATE events SET
      title = ?, slug = ?, description = ?, is_active = ?, visibility = ?, access_key = ?,
      hero_title = ?, hero_subtitle = ?, hero_cta_text = ?,
      background_color = ?, text_color = ?, accent_color = ?,
      logo_url = ?, branding_provider = ?, branding_prompt_version = ?, branding_generated_at = ?,
      updated_at = ?
    WHERE id = ?
  `);
  const deleteStmt = db.prepare('DELETE FROM events WHERE id = ?');
  const countStmt = db.prepare('SELECT COUNT(*) AS value FROM events');

  return {
    list: () => listStmt.all().map(mapRowToEvent),

    findById: (id) => {
      const row = findByIdStmt.get(id);
      return row ? mapRowToEvent(row) : null;
    },

    findBySlug: (slug) => {
      const row = findBySlugStmt.get(slug);
      return row ? mapRowToEvent(row) : null;
    },

    insert: (event) => {
      insertStmt.run(
        event.id,
        event.title,
        event.slug,
        event.description,
        event.isActive ? 1 : 0,
        event.visibility,
        event.accessKey,
        event.hero.title,
        event.hero.subtitle,
        event.hero.ctaText,
        event.visualStyle.backgroundColor,
        event.visualStyle.textColor,
        event.visualStyle.accentColor,
        event.logoUrl,
        event.brandingProvider,
        event.brandingPromptVersion,
        event.brandingGeneratedAt,
        event.createdAt,
        event.updatedAt,
      );
      return { ...event };
    },

    update: (id, event) => {
      updateStmt.run(
        event.title,
        event.slug,
        event.description,
        event.isActive ? 1 : 0,
        event.visibility,
        event.accessKey,
        event.hero.title,
        event.hero.subtitle,
        event.hero.ctaText,
        event.visualStyle.backgroundColor,
        event.visualStyle.textColor,
        event.visualStyle.accentColor,
        event.logoUrl,
        event.brandingProvider,
        event.brandingPromptVersion,
        event.brandingGeneratedAt,
        event.updatedAt,
        id,
      );
      return { ...event };
    },

    deleteById: (id) => deleteStmt.run(id).changes > 0,

    count: () => countStmt.get().value,
  };
};
