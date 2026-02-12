const mapRowToMaterial = (row) => ({
  id: row.id,
  eventId: row.event_id,
  lessonId: row.lesson_id,
  fileName: row.file_name,
  mimeType: row.mime_type,
  sizeBytes: row.size_bytes,
  downloadUrl: row.download_url,
  createdAt: row.created_at,
});

export const createSqliteMaterialRepository = ({ db }) => {
  const listByLessonStmt = db.prepare(
    'SELECT * FROM materials WHERE lesson_id = ? ORDER BY created_at ASC',
  );
  const insertStmt = db.prepare(`
    INSERT INTO materials (
      id, event_id, lesson_id, file_name, mime_type, size_bytes, download_url, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return {
    listByLesson: (lessonId) => listByLessonStmt.all(lessonId).map(mapRowToMaterial),

    insertMany: (materials) => {
      for (const material of materials) {
        insertStmt.run(
          material.id,
          material.eventId,
          material.lessonId,
          material.fileName,
          material.mimeType,
          material.sizeBytes,
          material.downloadUrl,
          material.createdAt,
        );
      }

      return materials.map((item) => ({ ...item }));
    },
  };
};
