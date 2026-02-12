import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import {
  createEvent,
  createLesson,
  createMaterials,
  createQuiz,
  deleteEvent,
  deleteLesson,
  deleteQuiz,
  getQuiz,
  listEvents,
  listLessons,
  listMaterials,
  updateEvent,
  updateLesson,
  updateQuiz,
} from '../services/admin-api.js';
import { getApiBaseUrl } from '../services/api.js';

const defaultEventForm = {
  title: '',
  slug: '',
  description: '',
  isActive: false,
  visibility: 'private',
  accessKey: '',
  heroTitle: '',
  heroSubtitle: '',
  heroCtaText: '',
  backgroundColor: '#111111',
  textColor: '#f5f5f5',
  accentColor: '#e50914',
};

const defaultLessonForm = {
  title: '',
  slug: '',
  videoProvider: 'youtube',
  videoId: '',
  releaseAt: '',
  expiresAt: '',
};

const defaultMaterialForm = {
  fileName: '',
  mimeType: 'application/pdf',
  sizeBytes: 1024,
  downloadUrl: '',
};

const defaultQuizForm = {
  quizId: '',
  title: '',
  passPercentage: 70,
  prompt: '',
  optionA: '',
  optionB: '',
  correctOption: 'A',
};

const formatError = (error) => {
  if (!error) {
    return 'Unexpected error';
  }
  return error.message || 'Unexpected error';
};

export const DashboardPage = () => {
  const { session, logout } = useAuth();
  const token = session?.accessToken;

  const [events, setEvents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [quizPayload, setQuizPayload] = useState(null);

  const [eventForm, setEventForm] = useState(defaultEventForm);
  const [lessonForm, setLessonForm] = useState(defaultLessonForm);
  const [materialForm, setMaterialForm] = useState(defaultMaterialForm);
  const [quizForm, setQuizForm] = useState(defaultQuizForm);

  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId],
  );

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === selectedLessonId) ?? null,
    [lessons, selectedLessonId],
  );

  const resetFeedback = () => {
    setError('');
    setStatus('');
  };

  const handleAuthError = (caughtError) => {
    if (caughtError?.status === 401) {
      logout();
      return true;
    }
    return false;
  };

  const fetchEvents = async () => {
    try {
      const body = await listEvents(token);
      setEvents(body.items ?? []);

      if (selectedEventId && !body.items.find((item) => item.id === selectedEventId)) {
        setSelectedEventId('');
        setLessons([]);
        setSelectedLessonId('');
        setMaterials([]);
      }
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Events load failed: ${formatError(caughtError)}`);
      }
    }
  };

  const fetchLessons = async (eventId) => {
    if (!eventId) {
      setLessons([]);
      setSelectedLessonId('');
      setMaterials([]);
      return;
    }

    try {
      const body = await listLessons(token, eventId);
      setLessons(body.items ?? []);

      if (selectedLessonId && !body.items.find((item) => item.id === selectedLessonId)) {
        setSelectedLessonId('');
        setMaterials([]);
      }
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Lessons load failed: ${formatError(caughtError)}`);
      }
    }
  };

  const fetchMaterials = async (eventId, lessonId) => {
    if (!eventId || !lessonId) {
      setMaterials([]);
      return;
    }

    try {
      const body = await listMaterials(token, eventId, lessonId);
      setMaterials(body.items ?? []);
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Materials load failed: ${formatError(caughtError)}`);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    fetchLessons(selectedEventId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId]);

  useEffect(() => {
    fetchMaterials(selectedEventId, selectedLessonId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId, selectedLessonId]);

  const handleCreateEvent = async (event) => {
    event.preventDefault();
    resetFeedback();

    try {
      await createEvent(token, {
        title: eventForm.title,
        slug: eventForm.slug,
        description: eventForm.description,
        isActive: eventForm.isActive,
        visibility: eventForm.visibility,
        accessKey: eventForm.accessKey || undefined,
        hero: {
          title: eventForm.heroTitle,
          subtitle: eventForm.heroSubtitle,
          ctaText: eventForm.heroCtaText,
        },
        visualStyle: {
          backgroundColor: eventForm.backgroundColor,
          textColor: eventForm.textColor,
          accentColor: eventForm.accentColor,
        },
      });
      setStatus('Event created successfully.');
      await fetchEvents();
      setEventForm(defaultEventForm);
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Event create failed: ${formatError(caughtError)}`);
      }
    }
  };

  const handleLoadEventForEdit = () => {
    if (!selectedEvent) {
      return;
    }

    setEventForm({
      title: selectedEvent.title ?? '',
      slug: selectedEvent.slug ?? '',
      description: selectedEvent.description ?? '',
      isActive: Boolean(selectedEvent.isActive),
      visibility: selectedEvent.visibility ?? 'private',
      accessKey: selectedEvent.accessKey ?? '',
      heroTitle: selectedEvent.hero?.title ?? '',
      heroSubtitle: selectedEvent.hero?.subtitle ?? '',
      heroCtaText: selectedEvent.hero?.ctaText ?? '',
      backgroundColor: selectedEvent.visualStyle?.backgroundColor ?? '#111111',
      textColor: selectedEvent.visualStyle?.textColor ?? '#f5f5f5',
      accentColor: selectedEvent.visualStyle?.accentColor ?? '#e50914',
    });

    setStatus('Event loaded into form. Update to apply branding/content changes.');
  };

  const handleUpdateEvent = async () => {
    if (!selectedEventId) {
      setError('Select an event before updating.');
      return;
    }

    resetFeedback();

    try {
      await updateEvent(token, selectedEventId, {
        title: eventForm.title,
        slug: eventForm.slug,
        description: eventForm.description,
        isActive: eventForm.isActive,
        visibility: eventForm.visibility,
        accessKey: eventForm.accessKey ? eventForm.accessKey : null,
        hero: {
          title: eventForm.heroTitle,
          subtitle: eventForm.heroSubtitle,
          ctaText: eventForm.heroCtaText,
        },
        visualStyle: {
          backgroundColor: eventForm.backgroundColor,
          textColor: eventForm.textColor,
          accentColor: eventForm.accentColor,
        },
      });

      setStatus('Event updated successfully.');
      await fetchEvents();
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Event update failed: ${formatError(caughtError)}`);
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEventId) {
      setError('Select an event before deleting.');
      return;
    }

    resetFeedback();

    try {
      await deleteEvent(token, selectedEventId);
      setStatus('Event deleted successfully.');
      setSelectedEventId('');
      setSelectedLessonId('');
      setLessons([]);
      setMaterials([]);
      await fetchEvents();
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Event delete failed: ${formatError(caughtError)}`);
      }
    }
  };

  const handleCreateLesson = async (event) => {
    event.preventDefault();
    if (!selectedEventId) {
      setError('Select an event before creating lessons.');
      return;
    }

    resetFeedback();

    try {
      await createLesson(token, selectedEventId, {
        title: lessonForm.title,
        slug: lessonForm.slug,
        videoProvider: lessonForm.videoProvider,
        videoId: lessonForm.videoId || undefined,
        releaseAt: new Date(lessonForm.releaseAt).toISOString(),
        expiresAt: lessonForm.expiresAt ? new Date(lessonForm.expiresAt).toISOString() : undefined,
      });
      setStatus('Lesson created successfully.');
      setLessonForm(defaultLessonForm);
      await fetchLessons(selectedEventId);
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Lesson create failed: ${formatError(caughtError)}`);
      }
    }
  };

  const handleLoadLessonForEdit = () => {
    if (!selectedLesson) {
      return;
    }

    const toDatetimeLocal = (value) => {
      if (!value) return '';
      const date = new Date(value);
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    };

    setLessonForm({
      title: selectedLesson.title ?? '',
      slug: selectedLesson.slug ?? '',
      videoProvider: selectedLesson.videoProvider ?? 'youtube',
      videoId: selectedLesson.videoId ?? '',
      releaseAt: toDatetimeLocal(selectedLesson.releaseAt),
      expiresAt: toDatetimeLocal(selectedLesson.expiresAt),
    });

    setStatus('Lesson loaded into form.');
  };

  const handleUpdateLesson = async () => {
    if (!selectedEventId || !selectedLessonId) {
      setError('Select a lesson before updating.');
      return;
    }

    resetFeedback();

    try {
      await updateLesson(token, selectedEventId, selectedLessonId, {
        title: lessonForm.title,
        slug: lessonForm.slug,
        videoProvider: lessonForm.videoProvider,
        videoId: lessonForm.videoId,
        releaseAt: lessonForm.releaseAt ? new Date(lessonForm.releaseAt).toISOString() : undefined,
        expiresAt: lessonForm.expiresAt ? new Date(lessonForm.expiresAt).toISOString() : null,
      });

      setStatus('Lesson updated successfully.');
      await fetchLessons(selectedEventId);
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Lesson update failed: ${formatError(caughtError)}`);
      }
    }
  };

  const handleDeleteLesson = async () => {
    if (!selectedEventId || !selectedLessonId) {
      setError('Select a lesson before deleting.');
      return;
    }

    resetFeedback();

    try {
      await deleteLesson(token, selectedEventId, selectedLessonId);
      setStatus('Lesson deleted successfully.');
      setSelectedLessonId('');
      setMaterials([]);
      await fetchLessons(selectedEventId);
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Lesson delete failed: ${formatError(caughtError)}`);
      }
    }
  };

  const handleCreateMaterial = async (event) => {
    event.preventDefault();
    if (!selectedEventId || !selectedLessonId) {
      setError('Select a lesson before adding materials.');
      return;
    }

    resetFeedback();

    try {
      await createMaterials(token, selectedEventId, selectedLessonId, [
        {
          fileName: materialForm.fileName,
          mimeType: materialForm.mimeType,
          sizeBytes: Number(materialForm.sizeBytes),
          downloadUrl: materialForm.downloadUrl,
        },
      ]);

      setStatus('Material added successfully.');
      setMaterialForm(defaultMaterialForm);
      await fetchMaterials(selectedEventId, selectedLessonId);
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Material create failed: ${formatError(caughtError)}`);
      }
    }
  };

  const handleCreateQuiz = async (event) => {
    event.preventDefault();
    if (!selectedEventId || !selectedLessonId) {
      setError('Select a lesson before creating quiz.');
      return;
    }

    resetFeedback();

    try {
      const body = await createQuiz(token, {
        eventId: selectedEventId,
        lessonId: selectedLessonId,
        title: quizForm.title,
        passPercentage: Number(quizForm.passPercentage),
        questions: [
          {
            prompt: quizForm.prompt,
            options: [
              { text: quizForm.optionA, isCorrect: quizForm.correctOption === 'A' },
              { text: quizForm.optionB, isCorrect: quizForm.correctOption === 'B' },
            ],
          },
        ],
      });

      setQuizPayload(body.item);
      setQuizForm((current) => ({ ...current, quizId: body.item.id }));
      setStatus('Quiz created successfully.');
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Quiz create failed: ${formatError(caughtError)}`);
      }
    }
  };

  const handleLoadQuiz = async () => {
    if (!quizForm.quizId) {
      setError('Provide quiz id to load.');
      return;
    }

    resetFeedback();

    try {
      const body = await getQuiz(token, quizForm.quizId);
      const firstQuestion = body.item.questions[0];

      setQuizPayload(body.item);
      setQuizForm({
        quizId: body.item.id,
        title: body.item.title,
        passPercentage: body.item.passPercentage,
        prompt: firstQuestion?.prompt ?? '',
        optionA: firstQuestion?.options[0]?.text ?? '',
        optionB: firstQuestion?.options[1]?.text ?? '',
        correctOption: firstQuestion?.options[0]?.isCorrect ? 'A' : 'B',
      });
      setStatus('Quiz loaded.');
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Quiz load failed: ${formatError(caughtError)}`);
      }
    }
  };

  const handleUpdateQuiz = async () => {
    if (!quizForm.quizId) {
      setError('Load or set a quiz id before updating.');
      return;
    }

    resetFeedback();

    try {
      const body = await updateQuiz(token, quizForm.quizId, {
        title: quizForm.title,
        passPercentage: Number(quizForm.passPercentage),
        questions: [
          {
            prompt: quizForm.prompt,
            options: [
              { text: quizForm.optionA, isCorrect: quizForm.correctOption === 'A' },
              { text: quizForm.optionB, isCorrect: quizForm.correctOption === 'B' },
            ],
          },
        ],
      });

      setQuizPayload(body.item);
      setStatus('Quiz updated successfully.');
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Quiz update failed: ${formatError(caughtError)}`);
      }
    }
  };

  const handleDeleteQuiz = async () => {
    if (!quizForm.quizId) {
      setError('Provide quiz id before deleting.');
      return;
    }

    resetFeedback();

    try {
      await deleteQuiz(token, quizForm.quizId);
      setQuizPayload(null);
      setQuizForm(defaultQuizForm);
      setStatus('Quiz deleted successfully.');
    } catch (caughtError) {
      if (!handleAuthError(caughtError)) {
        setError(`Quiz delete failed: ${formatError(caughtError)}`);
      }
    }
  };

  return (
    <main className="dashboard-layout">
      <header className="dashboard-header">
        <div>
          <h1>Admin Content Operations</h1>
          <p>Manage events, lessons, materials, quizzes, and branding from one place.</p>
        </div>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="dashboard-grid two-col">
        <article>
          <h2>Runtime</h2>
          <p>
            API base URL: <code>{getApiBaseUrl()}</code>
          </p>
          <p>
            Signed in as <strong>{session?.user?.username ?? 'admin'}</strong>
          </p>
        </article>

        <article>
          <h2>Feedback</h2>
          {status ? <p className="feedback-ok">{status}</p> : <p>No recent actions.</p>}
          {error ? <p className="feedback-error">{error}</p> : null}
        </article>
      </section>

      <section className="dashboard-grid two-col">
        <article>
          <h2>Events + Branding</h2>
          <form className="stack-form" onSubmit={handleCreateEvent}>
            <input
              placeholder="Event title"
              value={eventForm.title}
              onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })}
              required
            />
            <input
              placeholder="Slug"
              value={eventForm.slug}
              onChange={(event) => setEventForm({ ...eventForm, slug: event.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={eventForm.description}
              onChange={(event) => setEventForm({ ...eventForm, description: event.target.value })}
            />
            <div className="inline-fields">
              <select
                value={eventForm.visibility}
                onChange={(event) => setEventForm({ ...eventForm, visibility: event.target.value })}
              >
                <option value="private">private</option>
                <option value="public">public</option>
              </select>
              <label className="inline-check">
                <input
                  type="checkbox"
                  checked={eventForm.isActive}
                  onChange={(event) => setEventForm({ ...eventForm, isActive: event.target.checked })}
                />
                Active
              </label>
            </div>
            <input
              placeholder="Access key (private events)"
              value={eventForm.accessKey}
              onChange={(event) => setEventForm({ ...eventForm, accessKey: event.target.value })}
            />

            <h3>Branding controls</h3>
            <input
              placeholder="Hero title"
              value={eventForm.heroTitle}
              onChange={(event) => setEventForm({ ...eventForm, heroTitle: event.target.value })}
              required
            />
            <input
              placeholder="Hero subtitle"
              value={eventForm.heroSubtitle}
              onChange={(event) => setEventForm({ ...eventForm, heroSubtitle: event.target.value })}
              required
            />
            <input
              placeholder="Hero CTA text"
              value={eventForm.heroCtaText}
              onChange={(event) => setEventForm({ ...eventForm, heroCtaText: event.target.value })}
              required
            />
            <div className="inline-fields">
              <label>
                Background
                <input
                  type="color"
                  value={eventForm.backgroundColor}
                  onChange={(event) =>
                    setEventForm({ ...eventForm, backgroundColor: event.target.value })
                  }
                />
              </label>
              <label>
                Text
                <input
                  type="color"
                  value={eventForm.textColor}
                  onChange={(event) => setEventForm({ ...eventForm, textColor: event.target.value })}
                />
              </label>
              <label>
                Accent
                <input
                  type="color"
                  value={eventForm.accentColor}
                  onChange={(event) => setEventForm({ ...eventForm, accentColor: event.target.value })}
                />
              </label>
            </div>

            <div className="inline-actions">
              <button type="submit">Create event</button>
              <button type="button" onClick={handleLoadEventForEdit}>
                Load selected
              </button>
              <button type="button" onClick={handleUpdateEvent}>
                Update selected
              </button>
              <button type="button" className="danger" onClick={handleDeleteEvent}>
                Delete selected
              </button>
            </div>
          </form>

          <ul className="select-list">
            {events.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={selectedEventId === item.id ? 'active' : ''}
                  onClick={() => setSelectedEventId(item.id)}
                >
                  {item.title} ({item.visibility})
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article>
          <h2>Lessons</h2>
          <form className="stack-form" onSubmit={handleCreateLesson}>
            <input
              placeholder="Lesson title"
              value={lessonForm.title}
              onChange={(event) => setLessonForm({ ...lessonForm, title: event.target.value })}
              required
            />
            <input
              placeholder="Lesson slug"
              value={lessonForm.slug}
              onChange={(event) => setLessonForm({ ...lessonForm, slug: event.target.value })}
              required
            />
            <div className="inline-fields">
              <select
                value={lessonForm.videoProvider}
                onChange={(event) =>
                  setLessonForm({ ...lessonForm, videoProvider: event.target.value })
                }
              >
                <option value="youtube">youtube</option>
                <option value="vimeo">vimeo</option>
                <option value="gemini_stream">gemini_stream</option>
              </select>
              <input
                placeholder="Video id"
                value={lessonForm.videoId}
                onChange={(event) => setLessonForm({ ...lessonForm, videoId: event.target.value })}
              />
            </div>
            <label>
              Release at
              <input
                type="datetime-local"
                value={lessonForm.releaseAt}
                onChange={(event) => setLessonForm({ ...lessonForm, releaseAt: event.target.value })}
                required
              />
            </label>
            <label>
              Expires at
              <input
                type="datetime-local"
                value={lessonForm.expiresAt}
                onChange={(event) => setLessonForm({ ...lessonForm, expiresAt: event.target.value })}
              />
            </label>

            <div className="inline-actions">
              <button type="submit">Create lesson</button>
              <button type="button" onClick={handleLoadLessonForEdit}>
                Load selected
              </button>
              <button type="button" onClick={handleUpdateLesson}>
                Update selected
              </button>
              <button type="button" className="danger" onClick={handleDeleteLesson}>
                Delete selected
              </button>
            </div>
          </form>

          <ul className="select-list">
            {lessons.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={selectedLessonId === item.id ? 'active' : ''}
                  onClick={() => setSelectedLessonId(item.id)}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="dashboard-grid two-col">
        <article>
          <h2>Materials</h2>
          <form className="stack-form" onSubmit={handleCreateMaterial}>
            <input
              placeholder="File name"
              value={materialForm.fileName}
              onChange={(event) => setMaterialForm({ ...materialForm, fileName: event.target.value })}
              required
            />
            <div className="inline-fields">
              <select
                value={materialForm.mimeType}
                onChange={(event) => setMaterialForm({ ...materialForm, mimeType: event.target.value })}
              >
                <option value="application/pdf">application/pdf</option>
                <option value="application/zip">application/zip</option>
                <option value="image/png">image/png</option>
                <option value="image/jpeg">image/jpeg</option>
                <option value="text/plain">text/plain</option>
              </select>
              <input
                type="number"
                min={1}
                max={26214400}
                value={materialForm.sizeBytes}
                onChange={(event) => setMaterialForm({ ...materialForm, sizeBytes: event.target.value })}
              />
            </div>
            <input
              placeholder="Download URL"
              value={materialForm.downloadUrl}
              onChange={(event) =>
                setMaterialForm({ ...materialForm, downloadUrl: event.target.value })
              }
              required
            />
            <button type="submit">Add material</button>
          </form>

          <ul className="flat-list">
            {materials.map((item) => (
              <li key={item.id}>
                <strong>{item.fileName}</strong>
                <span>{item.mimeType}</span>
              </li>
            ))}
          </ul>
        </article>

        <article>
          <h2>Quizzes</h2>
          <form className="stack-form" onSubmit={handleCreateQuiz}>
            <input
              placeholder="Quiz id (for load/update/delete)"
              value={quizForm.quizId}
              onChange={(event) => setQuizForm({ ...quizForm, quizId: event.target.value })}
            />
            <input
              placeholder="Quiz title"
              value={quizForm.title}
              onChange={(event) => setQuizForm({ ...quizForm, title: event.target.value })}
              required
            />
            <input
              type="number"
              min={0}
              max={100}
              value={quizForm.passPercentage}
              onChange={(event) =>
                setQuizForm({ ...quizForm, passPercentage: Number(event.target.value) })
              }
            />
            <input
              placeholder="Question"
              value={quizForm.prompt}
              onChange={(event) => setQuizForm({ ...quizForm, prompt: event.target.value })}
              required
            />
            <input
              placeholder="Option A"
              value={quizForm.optionA}
              onChange={(event) => setQuizForm({ ...quizForm, optionA: event.target.value })}
              required
            />
            <input
              placeholder="Option B"
              value={quizForm.optionB}
              onChange={(event) => setQuizForm({ ...quizForm, optionB: event.target.value })}
              required
            />
            <select
              value={quizForm.correctOption}
              onChange={(event) => setQuizForm({ ...quizForm, correctOption: event.target.value })}
            >
              <option value="A">Correct: A</option>
              <option value="B">Correct: B</option>
            </select>

            <div className="inline-actions">
              <button type="submit">Create quiz</button>
              <button type="button" onClick={handleLoadQuiz}>
                Load quiz
              </button>
              <button type="button" onClick={handleUpdateQuiz}>
                Update quiz
              </button>
              <button type="button" className="danger" onClick={handleDeleteQuiz}>
                Delete quiz
              </button>
            </div>
          </form>

          {quizPayload ? (
            <div className="payload-preview">
              <strong>Loaded quiz:</strong> {quizPayload.title} ({quizPayload.id})
            </div>
          ) : null}
        </article>
      </section>
    </main>
  );
};
