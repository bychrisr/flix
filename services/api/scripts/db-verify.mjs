import { openSqliteDatabase } from '../src/db/client.js';

const { db, dbPath } = openSqliteDatabase(process.env.DATABASE_URL);

const count = (table) => db.prepare(`SELECT COUNT(*) AS value FROM ${table}`).get().value;

const snapshot = {
  admins: count('admins'),
  events: count('events'),
  lessons: count('lessons'),
  materials: count('materials'),
  quizzes: count('quizzes'),
  quizQuestions: count('quiz_questions'),
  quizOptions: count('quiz_options'),
};

db.close();

console.log('Database:', dbPath);
console.log('Snapshot:', snapshot);
