import bcrypt from 'bcryptjs';
import { openSqliteDatabase } from './client.js';

const seedTimestamp = '2026-02-12T12:00:00.000Z';

const defaultSeedData = {
  admins: [
    {
      id: 'admin-1',
      username: 'admin',
      password: 'admin123',
    },
  ],
  events: [
    {
      id: 'event-public-1',
      title: 'Flix MVP Launch Event',
      slug: 'flix-mvp-launch-event',
      description: 'Public event used as baseline for learner catalog/playback flow.',
      isActive: 1,
      visibility: 'public',
      accessKey: null,
      heroTitle: 'Bem-vindo ao Flix',
      heroSubtitle: 'Aprenda em trilhas curtas com checkpoints práticos.',
      heroCtaText: 'Comecar',
      highlightVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      accentColor: '#22d3ee',
    },
    {
      id: 'event-private-1',
      title: 'Flix Growth Intensive',
      slug: 'flix-growth-intensive',
      description: 'Private event baseline with access key protected lessons.',
      isActive: 1,
      visibility: 'private',
      accessKey: 'growth2026',
      heroTitle: 'Acesso exclusivo',
      heroSubtitle: 'Conteudo privado para alunos convidados.',
      heroCtaText: 'Entrar com chave',
      highlightVideoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
      backgroundColor: '#111111',
      textColor: '#f5f5f5',
      accentColor: '#e50914',
    },
  ],
  lessons: [
    {
      id: 'lesson-public-1',
      eventId: 'event-public-1',
      title: 'Kickoff do MVP',
      slug: 'kickoff-do-mvp',
      videoProvider: 'youtube',
      videoId: 'dQw4w9WgXcQ',
      releaseAt: '2026-01-01T10:00:00.000Z',
      expiresAt: null,
    },
    {
      id: 'lesson-private-1',
      eventId: 'event-private-1',
      title: 'Growth Playbook',
      slug: 'growth-playbook',
      videoProvider: 'youtube',
      videoId: 'M7lc1UVf-VE',
      releaseAt: '2026-01-10T10:00:00.000Z',
      expiresAt: null,
    },
  ],
  materials: [
    {
      id: 'material-public-1',
      eventId: 'event-public-1',
      lessonId: 'lesson-public-1',
      fileName: 'mvp-kickoff-slides.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 420000,
      downloadUrl: 'https://cdn.flix.local/materials/mvp-kickoff-slides.pdf',
    },
  ],
  quizzes: [
    {
      id: 'quiz-public-1',
      eventId: 'event-public-1',
      lessonId: 'lesson-public-1',
      title: 'Quiz de Validacao do MVP',
      passPercentage: 70,
      questions: [
        {
          id: 'question-public-1',
          prompt: 'Qual objetivo principal do MVP?',
          order: 1,
          options: [
            { id: 'option-public-1a', text: 'Validar usabilidade e valor rapido', isCorrect: 1 },
            { id: 'option-public-1b', text: 'Cobrir todos os recursos finais', isCorrect: 0 },
          ],
        },
        {
          id: 'question-public-2',
          prompt: 'Qual fluxo deve estar completo no MVP?',
          order: 2,
          options: [
            { id: 'option-public-2a', text: 'Apenas cadastro', isCorrect: 0 },
            { id: 'option-public-2b', text: 'Admin e learner ponta a ponta', isCorrect: 1 },
          ],
        },
      ],
    },
  ],
};

const seedDatabase = async ({ databaseUrl, seedData }) => {
  const { db, dbPath } = openSqliteDatabase(databaseUrl);

  db.exec('BEGIN');
  try {
    db.exec(`
      DELETE FROM quiz_options;
      DELETE FROM quiz_questions;
      DELETE FROM quizzes;
      DELETE FROM materials;
      DELETE FROM lessons;
      DELETE FROM events;
      DELETE FROM admins;
    `);

    const insertAdmin = db.prepare(
      `INSERT INTO admins (id, username, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`
    );

    for (const admin of seedData.admins) {
      const hash = await bcrypt.hash(admin.password, 10);
      insertAdmin.run(admin.id, admin.username, hash, seedTimestamp, seedTimestamp);
    }

    const insertEvent = db.prepare(
      `INSERT INTO events (
        id, title, slug, description, is_active, visibility, access_key,
        hero_title, hero_subtitle, hero_cta_text,
        background_color, text_color, accent_color, highlight_video_url,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    for (const event of seedData.events) {
      insertEvent.run(
        event.id,
        event.title,
        event.slug,
        event.description,
        event.isActive,
        event.visibility,
        event.accessKey,
        event.heroTitle,
        event.heroSubtitle,
        event.heroCtaText,
        event.backgroundColor,
        event.textColor,
        event.accentColor,
        event.highlightVideoUrl ?? null,
        seedTimestamp,
        seedTimestamp,
      );
    }

    const insertLesson = db.prepare(
      `INSERT INTO lessons (
        id, event_id, title, slug, video_provider, video_id,
        release_at, expires_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    for (const lesson of seedData.lessons) {
      insertLesson.run(
        lesson.id,
        lesson.eventId,
        lesson.title,
        lesson.slug,
        lesson.videoProvider,
        lesson.videoId,
        lesson.releaseAt,
        lesson.expiresAt,
        seedTimestamp,
        seedTimestamp,
      );
    }

    const insertMaterial = db.prepare(
      `INSERT INTO materials (
        id, event_id, lesson_id, file_name, mime_type, size_bytes, download_url, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    for (const material of seedData.materials) {
      insertMaterial.run(
        material.id,
        material.eventId,
        material.lessonId,
        material.fileName,
        material.mimeType,
        material.sizeBytes,
        material.downloadUrl,
        seedTimestamp,
      );
    }

    const insertQuiz = db.prepare(
      `INSERT INTO quizzes (
        id, event_id, lesson_id, title, pass_percentage, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    );

    const insertQuestion = db.prepare(
      `INSERT INTO quiz_questions (
        id, quiz_id, prompt, display_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)`
    );

    const insertOption = db.prepare(
      `INSERT INTO quiz_options (
        id, question_id, text, is_correct, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)`
    );

    for (const quiz of seedData.quizzes) {
      insertQuiz.run(
        quiz.id,
        quiz.eventId,
        quiz.lessonId,
        quiz.title,
        quiz.passPercentage,
        seedTimestamp,
        seedTimestamp,
      );

      for (const question of quiz.questions) {
        insertQuestion.run(
          question.id,
          quiz.id,
          question.prompt,
          question.order,
          seedTimestamp,
          seedTimestamp,
        );

        for (const option of question.options) {
          insertOption.run(
            option.id,
            question.id,
            option.text,
            option.isCorrect,
            seedTimestamp,
            seedTimestamp,
          );
        }
      }
    }

    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  } finally {
    db.close();
  }

  return {
    dbPath,
    counts: {
      admins: seedData.admins.length,
      events: seedData.events.length,
      lessons: seedData.lessons.length,
      materials: seedData.materials.length,
      quizzes: seedData.quizzes.length,
      questions: seedData.quizzes.flatMap((quiz) => quiz.questions).length,
      options: seedData.quizzes.flatMap((quiz) => quiz.questions).flatMap((question) => question.options)
        .length,
    },
  };
};

export const runSeed = async ({ databaseUrl = process.env.DATABASE_URL } = {}) =>
  seedDatabase({ databaseUrl, seedData: defaultSeedData });

export const runSeedWithData = async ({
  databaseUrl = process.env.DATABASE_URL,
  seedData,
} = {}) => {
  if (!seedData) {
    throw new Error('seedData is required');
  }
  return seedDatabase({ databaseUrl, seedData });
};
