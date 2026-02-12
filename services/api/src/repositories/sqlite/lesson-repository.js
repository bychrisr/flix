const mapRowToLesson = (row) => ({
  id: row.id,
  eventId: row.event_id,
  title: row.title,
  slug: row.slug,
  videoProvider: row.video_provider,
  videoId: row.video_id,
  releaseAt: row.release_at,
  expiresAt: row.expires_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const createSqliteLessonRepository = ({ db }) => {
  const listByEventStmt = db.prepare('SELECT * FROM lessons WHERE event_id = ? ORDER BY release_at ASC');
  const listAllStmt = db.prepare('SELECT * FROM lessons');
  const findByIdStmt = db.prepare('SELECT * FROM lessons WHERE id = ? LIMIT 1');
  const findByEventAndSlugStmt = db.prepare(
    'SELECT * FROM lessons WHERE event_id = ? AND slug = ? LIMIT 1',
  );
  const insertStmt = db.prepare(`
    INSERT INTO lessons (
      id, event_id, title, slug, video_provider, video_id,
      release_at, expires_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const updateStmt = db.prepare(`
    UPDATE lessons SET
      title = ?, slug = ?, video_provider = ?, video_id = ?,
      release_at = ?, expires_at = ?, updated_at = ?
    WHERE id = ?
  `);
  const deleteStmt = db.prepare('DELETE FROM lessons WHERE id = ?');
  const countStmt = db.prepare('SELECT COUNT(*) AS value FROM lessons');

  return {
    listByEvent: (eventId) => listByEventStmt.all(eventId).map(mapRowToLesson),

    listAll: () => listAllStmt.all().map(mapRowToLesson),

    findById: (id) => {
      const row = findByIdStmt.get(id);
      return row ? mapRowToLesson(row) : null;
    },

    findByEventAndSlug: (eventId, slug) => {
      const row = findByEventAndSlugStmt.get(eventId, slug);
      return row ? mapRowToLesson(row) : null;
    },

    insert: (lesson) => {
      insertStmt.run(
        lesson.id,
        lesson.eventId,
        lesson.title,
        lesson.slug,
        lesson.videoProvider,
        lesson.videoId,
        lesson.releaseAt,
        lesson.expiresAt,
        lesson.createdAt,
        lesson.updatedAt,
      );
      return { ...lesson };
    },

    update: (id, lesson) => {
      updateStmt.run(
        lesson.title,
        lesson.slug,
        lesson.videoProvider,
        lesson.videoId,
        lesson.releaseAt,
        lesson.expiresAt,
        lesson.updatedAt,
        id,
      );
      return { ...lesson };
    },

    deleteById: (id) => deleteStmt.run(id).changes > 0,

    count: () => countStmt.get().value,
  };
};
