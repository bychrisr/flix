import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { checkAccess, fetchMaterials, fetchPlayback, fetchQuiz, submitQuiz } from '../services/api.js';

const eventKey = (eventSlug) => `flix.web.eventKey.${eventSlug}`;

const statusInfo = {
  blocked_private: 'Private event access key required.',
  locked: 'This lesson is not released yet.',
  expired: 'This lesson has expired.',
};

export const PlaybackPage = () => {
  const { eventSlug, lessonSlug } = useParams();
  const [accessKey, setAccessKey] = useState(() =>
    eventSlug ? window.localStorage.getItem(eventKey(eventSlug)) ?? '' : '',
  );
  const [access, setAccess] = useState(null);
  const [playback, setPlayback] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [materialsError, setMaterialsError] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [quizError, setQuizError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusText = useMemo(() => {
    if (!access?.status) return '';
    return statusInfo[access.status] ?? access.message ?? access.status;
  }, [access]);

  const loadPlayback = async () => {
    setLoading(true);
    setError('');
    setMaterialsError('');
    setQuizError('');
    setSubmitError('');
    setQuizResult(null);

    try {
      const accessResult = await checkAccess(eventSlug, lessonSlug, accessKey || undefined);
      setAccess(accessResult);

      if (!accessResult.authorized) {
        setPlayback(null);
        setMaterials(null);
        setQuiz(null);
        return;
      }

      const [playbackOutcome, materialsOutcome, quizOutcome] = await Promise.allSettled([
        fetchPlayback(eventSlug, lessonSlug, accessKey || undefined),
        fetchMaterials(eventSlug, lessonSlug, accessKey || undefined),
        fetchQuiz(eventSlug, lessonSlug, accessKey || undefined),
      ]);

      if (playbackOutcome.status !== 'fulfilled') {
        throw playbackOutcome.reason;
      }

      const playbackResult = playbackOutcome.value;
      setPlayback(playbackResult);

      if (materialsOutcome.status === 'fulfilled') {
        setMaterials(materialsOutcome.value.items ?? []);
      } else {
        setMaterials([]);
        setMaterialsError(materialsOutcome.reason?.message ?? 'Failed to load materials');
      }

      if (quizOutcome.status === 'fulfilled') {
        setQuiz(quizOutcome.value.item ?? null);
      } else {
        if (quizOutcome.reason?.status === 404 && quizOutcome.reason?.code === 'QUIZ_NOT_FOUND') {
          setQuiz(null);
        } else {
          setQuizError(quizOutcome.reason?.message ?? 'Failed to load quiz');
        }
      }

      if (accessKey) {
        window.localStorage.setItem(eventKey(eventSlug), accessKey);
      }
    } catch (caughtError) {
      setPlayback(null);
      setMaterials(null);
      setQuiz(null);
      setAccess(null);
      setError(caughtError?.message ?? 'Playback request failed');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId, optionId) => {
    setSelectedAnswers((current) => ({ ...current, [questionId]: optionId }));
    setSubmitError('');
  };

  const submitQuizAttempt = async () => {
    if (!quiz) return;
    const answers = quiz.questions
      .map((question) => ({
        questionId: question.id,
        optionId: selectedAnswers[question.id] ?? null,
      }))
      .filter((item) => item.optionId !== null);

    setSubmittingQuiz(true);
    setSubmitError('');

    try {
      const result = await submitQuiz({
        eventSlug,
        lessonSlug,
        eventAccessKey: accessKey || undefined,
        answers,
      });
      setQuizResult(result.result);
    } catch (caughtError) {
      setSubmitError(caughtError?.message ?? 'Failed to submit quiz');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  useEffect(() => {
    if (!eventSlug || !lessonSlug) return;
    setSelectedAnswers({});
    loadPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSlug, lessonSlug]);

  const answeredQuestions = quiz
    ? quiz.questions.filter((question) => Boolean(selectedAnswers[question.id])).length
    : 0;

  return (
    <main className="web-layout">
      <header className="web-header">
        <h1>Lesson Playback</h1>
        <p>
          <Link to={`/events/${eventSlug}`}>Back to catalog</Link>
        </p>
      </header>

      <section className="panel">
        <div className="inline-fields">
          <input
            placeholder="Event access key (optional)"
            value={accessKey}
            onChange={(event) => setAccessKey(event.target.value)}
          />
          <button type="button" onClick={loadPlayback} disabled={loading}>
            {loading ? 'Checking...' : 'Refresh access'}
          </button>
        </div>

        {error ? <p className="status-error">{error}</p> : null}
        {statusText ? <p className="status-warn">{statusText}</p> : null}

        {access?.timing ? (
          <p>
            Release at: <code>{access.timing.releaseAt}</code>
          </p>
        ) : null}
      </section>

      {playback ? (
        <>
          <section className="panel">
            <h2>{playback.lesson.title}</h2>
            <div className="player-shell">
              <div className="player-frame">
                <iframe
                  title={`${playback.lesson.title} player`}
                  src={playback.player.embedUrl}
                  allowFullScreen
                />
              </div>
              <div>
                <p>
                  Provider: <code>{playback.player.provider}</code>
                </p>
                <p>
                  Embed URL: <a href={playback.player.embedUrl}>{playback.player.embedUrl}</a>
                </p>
              </div>
            </div>

            <div className="inline-actions">
              {playback.navigation.previous ? (
                <Link to={`/events/${eventSlug}/lessons/${playback.navigation.previous.slug}`}>Previous</Link>
              ) : (
                <span className="muted">No previous lesson</span>
              )}

              {playback.navigation.next ? (
                <Link to={`/events/${eventSlug}/lessons/${playback.navigation.next.slug}`}>Next</Link>
              ) : (
                <span className="muted">No next lesson</span>
              )}
            </div>
          </section>

          <section className="panel">
            <h3>Lesson Materials</h3>
            {loading ? <p className="muted">Loading materials...</p> : null}
            {materialsError ? <p className="status-error">{materialsError}</p> : null}
            {!loading && !materialsError && Array.isArray(materials) && materials.length === 0 ? (
              <p className="muted">No materials available for this lesson.</p>
            ) : null}

            {!loading && Array.isArray(materials) && materials.length > 0 ? (
              <ul className="card-list">
                {materials.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.fileName}</strong>
                      <p className="muted">
                        {item.mimeType} • {Math.round(item.sizeBytes / 1024)} KB
                      </p>
                    </div>
                    <a href={item.downloadUrl} target="_blank" rel="noreferrer">
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <section className="panel">
            <h3>Lesson Quiz</h3>
            {loading ? <p className="muted">Loading quiz...</p> : null}
            {quizError ? <p className="status-error">{quizError}</p> : null}
            {!loading && !quizError && !quiz ? <p className="muted">No quiz available for this lesson.</p> : null}

            {!loading && quiz && !quizResult ? (
              <div className="quiz-shell">
                <p>
                  <strong>{quiz.title}</strong>
                </p>
                <p className="muted">
                  Answered {answeredQuestions}/{quiz.questions.length}
                </p>

                {quiz.questions.map((question) => (
                  <fieldset key={question.id} className="quiz-question">
                    <legend>{question.prompt}</legend>
                    {question.options.map((option) => (
                      <label key={option.id} className="quiz-option">
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={selectedAnswers[question.id] === option.id}
                          onChange={() => selectAnswer(question.id, option.id)}
                        />
                        {option.text}
                      </label>
                    ))}
                  </fieldset>
                ))}

                {submitError ? <p className="status-error">{submitError}</p> : null}
                <button type="button" disabled={submittingQuiz} onClick={submitQuizAttempt}>
                  {submittingQuiz ? 'Submitting...' : 'Submit quiz'}
                </button>
              </div>
            ) : null}

            {quizResult ? (
              <div className="quiz-result">
                <p>
                  Result: <strong>{quizResult.status === 'passed' ? 'Passed' : 'Failed'}</strong>
                </p>
                <p>
                  Score: <strong>{quizResult.scorePercentage}%</strong> ({quizResult.correctAnswers}/
                  {quizResult.totalQuestions} correct)
                </p>
                <p className="muted">
                  Required pass score: {quizResult.passPercentage}% • Submitted at {quizResult.submittedAt}
                </p>
                <button type="button" onClick={() => setQuizResult(null)}>
                  Retake quiz
                </button>
              </div>
            ) : null}
          </section>
        </>
      ) : null}
    </main>
  );
};
