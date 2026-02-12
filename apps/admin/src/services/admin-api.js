import { requestJson } from './api.js';

export const listEvents = (token) => requestJson({ method: 'GET', path: '/api/events', token });

export const createEvent = (token, payload) =>
  requestJson({ method: 'POST', path: '/api/events', token, payload });

export const updateEvent = (token, eventId, payload) =>
  requestJson({ method: 'PUT', path: `/api/events/${eventId}`, token, payload });

export const deleteEvent = (token, eventId) =>
  requestJson({ method: 'DELETE', path: `/api/events/${eventId}`, token });

export const listLessons = (token, eventId) =>
  requestJson({ method: 'GET', path: `/api/events/${eventId}/lessons`, token });

export const createLesson = (token, eventId, payload) =>
  requestJson({ method: 'POST', path: `/api/events/${eventId}/lessons`, token, payload });

export const updateLesson = (token, eventId, lessonId, payload) =>
  requestJson({ method: 'PUT', path: `/api/events/${eventId}/lessons/${lessonId}`, token, payload });

export const deleteLesson = (token, eventId, lessonId) =>
  requestJson({ method: 'DELETE', path: `/api/events/${eventId}/lessons/${lessonId}`, token });

export const listMaterials = (token, eventId, lessonId) =>
  requestJson({ method: 'GET', path: `/api/events/${eventId}/lessons/${lessonId}/materials`, token });

export const createMaterials = (token, eventId, lessonId, files) =>
  requestJson({
    method: 'POST',
    path: `/api/events/${eventId}/lessons/${lessonId}/materials`,
    token,
    payload: { files },
  });

export const createQuiz = (token, payload) =>
  requestJson({ method: 'POST', path: '/api/quizzes', token, payload });

export const getQuiz = (token, quizId) =>
  requestJson({ method: 'GET', path: `/api/quizzes/${quizId}`, token });

export const updateQuiz = (token, quizId, payload) =>
  requestJson({ method: 'PUT', path: `/api/quizzes/${quizId}`, token, payload });

export const deleteQuiz = (token, quizId) =>
  requestJson({ method: 'DELETE', path: `/api/quizzes/${quizId}`, token });
