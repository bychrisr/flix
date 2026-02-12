import { useMemo, useState, useEffect, useRef, type ReactNode } from 'react';
import ReactPlayer from 'react-player';
import { AccessKeyForm } from '../molecules/AccessKeyForm';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { HeroBanner } from '../organisms/HeroBanner';
import { HomePageHeader } from '../organisms/HomePageHeader';
import { LessonRail } from '../organisms/LessonRail';
import { LoadingScreen } from '../organisms/LoadingScreen';

type LessonItem = {
  id: string;
  title: string;
  status: 'released' | 'locked' | 'expired';
  action?: ReactNode;
};

type LearnerCatalogTemplateProps = {
  eventSlug: string;
  accessKey: string;
  onAccessKeyChange: (next: string) => void;
  onLoad: () => void;
  loading?: boolean;
  eventVisibility?: 'public' | 'private';
  eventTitle?: string;
  eventDescription?: string;
  highlightVideoUrl?: string;
  heroTitle: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  releasedItems: LessonItem[];
  gatedItems: LessonItem[];
};

const defaultHeroBackground =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23131313'/%3E%3Cstop offset='55%25' stop-color='%230f1e2f'/%3E%3Cstop offset='100%25' stop-color='%23131313'/%3E%3C/linearGradient%3E%3CradialGradient id='glow' cx='0.2' cy='0.15' r='0.6'%3E%3Cstop offset='0%25' stop-color='%23e50914' stop-opacity='0.45'/%3E%3Cstop offset='100%25' stop-color='%23e50914' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='url(%23bg)'/%3E%3Crect width='1600' height='900' fill='url(%23glow)'/%3E%3C/svg%3E";
const defaultHeroVideoUrl = 'https://www.youtube.com/watch?v=M7lc1UVf-VE';

const isYouTubeUrl = (url: string) => /youtu\.be|youtube\.com/i.test(url);

const getYouTubeVideoId = (url: string) => {
  const patterns = [
    /youtu\.be\/([^?&#/]+)/i,
    /youtube\.com\/watch\?v=([^?&#/]+)/i,
    /youtube\.com\/embed\/([^?&#/]+)/i,
    /youtube\.com\/shorts\/([^?&#/]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
};

const getVimeoVideoId = (url: string) => {
  const patterns = [/vimeo\.com\/(\d+)/i, /player\.vimeo\.com\/video\/(\d+)/i, /^(\d{6,12})$/];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
};

const normalizeVideoUrl = (input: string) => {
  const raw = input.trim();
  if (!raw) return '';

  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) {
    return `https://www.youtube.com/watch?v=${raw}`;
  }

  if (isYouTubeUrl(raw)) {
    const id = getYouTubeVideoId(raw);
    if (id) return `https://www.youtube.com/watch?v=${id}`;
  }

  const vimeoId = getVimeoVideoId(raw);
  if (vimeoId) {
    return `https://vimeo.com/${vimeoId}`;
  }

  if (!/^https?:\/\//i.test(raw) && !raw.startsWith('/')) {
    return `https://${raw}`;
  }

  return raw.trim();
};

const isAbortLikePlayerError = (error: unknown) => {
  if (!error) return false;
  const message =
    typeof error === 'string'
      ? error
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: unknown }).message ?? '')
        : String(error);
  const normalized = message.toLowerCase();
  return normalized.includes('aborterror') || normalized.includes('play() request was interrupted');
};

const buildCandidateVideoUrls = (highlightVideoUrl: string) => {
  const candidates = [
    normalizeVideoUrl(highlightVideoUrl),
    defaultHeroVideoUrl,
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  ]
    .filter(Boolean)
    .filter((url, index, list) => list.indexOf(url) === index);

  return candidates.filter((url) => ReactPlayer.canPlay(url));
};

export const LearnerCatalogTemplate = ({
  eventSlug,
  accessKey,
  onAccessKeyChange,
  onLoad,
  loading,
  eventVisibility = 'public',
  eventTitle = '',
  eventDescription = '',
  highlightVideoUrl = '',
  heroTitle,
  heroDescription,
  heroCtaLabel = 'Load catalog',
  releasedItems,
  gatedItems,
}: LearnerCatalogTemplateProps) => {
  const playerRef = useRef<ReactPlayer | null>(null);
  const loopSeekLockRef = useRef(false);
  const activeVideoUrlRef = useRef('');
  const [isMounted, setIsMounted] = useState(false);
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [hasMinPreload, setHasMinPreload] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const candidateVideoUrls = useMemo(() => buildCandidateVideoUrls(highlightVideoUrl), [highlightVideoUrl]);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const currentVideoUrl = candidateVideoUrls[currentCandidateIndex] ?? '';
  const currentYouTubeVideoId = useMemo(() => getYouTubeVideoId(currentVideoUrl) ?? '', [currentVideoUrl]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setCurrentCandidateIndex(0);
    setHasVideoError(false);
    setHasMinPreload(false);
    setIsPlayerReady(false);
    setIsHeroReady(false);
    setVideoDuration(0);
    loopSeekLockRef.current = false;
  }, [candidateVideoUrls]);

  useEffect(() => {
    if (candidateVideoUrls.length > 0) return;
    setHasVideoError(true);
    setHasMinPreload(true);
    setIsPlayerReady(true);
  }, [candidateVideoUrls]);

  useEffect(() => {
    activeVideoUrlRef.current = currentVideoUrl;
  }, [currentVideoUrl]);

  useEffect(() => {
    if (isPlayerReady && hasMinPreload) {
      setIsHeroReady(true);
    }
  }, [isPlayerReady, hasMinPreload]);

  useEffect(() => {
    if (!isPlayerReady || hasMinPreload) return undefined;

    // Fallback de segurança: se o provider não reportar progresso corretamente,
    // libera após curto delay desde o ready do player para evitar tela travada.
    const timer = window.setTimeout(() => {
      setHasMinPreload(true);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [isPlayerReady, hasMinPreload]);

  return (
    <main style={{ width: '100%', display: 'grid', gap: 'var(--fx-space-6)' }}>
      <LoadingScreen isReady={isHeroReady} />

      <section
        style={{
          width: '100%',
          position: 'relative',
          minHeight: 680,
          overflow: 'hidden',
          background: 'var(--fx-color-bg-primary)',
        }}
      >
        {isMounted && !hasVideoError && currentVideoUrl ? (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ width: '100%', height: '100%', transform: 'scale(1.35)', transformOrigin: 'center' }}>
              <ReactPlayer
                ref={playerRef}
                key={currentVideoUrl}
                src={currentVideoUrl}
                playing
                loop
                muted
                controls={false}
                width="100%"
                height="100%"
                playsInline
                onReady={() => setIsPlayerReady(true)}
                onProgress={({ playedSeconds, loadedSeconds }) => {
                  if (activeVideoUrlRef.current !== currentVideoUrl) {
                    return;
                  }
                  const loaded = typeof loadedSeconds === 'number' ? loadedSeconds : 0;
                  const played = typeof playedSeconds === 'number' ? playedSeconds : 0;

                  if (loaded >= 5 || played >= 5) {
                    setHasMinPreload(true);
                  }

                  if (
                    currentYouTubeVideoId &&
                    videoDuration > 0 &&
                    played >= Math.max(videoDuration - 0.35, 0) &&
                    !loopSeekLockRef.current
                  ) {
                    loopSeekLockRef.current = true;
                    playerRef.current?.seekTo(0, 'seconds');
                  }

                  if (played < 1) {
                    loopSeekLockRef.current = false;
                  }
                }}
                onDurationChange={(duration) => {
                  if (activeVideoUrlRef.current !== currentVideoUrl) {
                    return;
                  }
                  if (typeof duration === 'number' && Number.isFinite(duration)) {
                    setVideoDuration(duration);
                  }
                }}
                onError={(error) => {
                  if (activeVideoUrlRef.current !== currentVideoUrl) {
                    return;
                  }
                  if (isAbortLikePlayerError(error)) {
                    return;
                  }

                  if (currentCandidateIndex < candidateVideoUrls.length - 1) {
                    setCurrentCandidateIndex((prev) => prev + 1);
                    setHasMinPreload(false);
                    setIsPlayerReady(false);
                    setVideoDuration(0);
                    loopSeekLockRef.current = false;
                    return;
                  }

                  setHasVideoError(true);
                  setHasMinPreload(true);
                  setIsPlayerReady(true);
                }}
                config={{
                  youtube: {
                    playerVars: {
                      autoplay: 1,
                      controls: 0,
                      disablekb: 1,
                      modestbranding: 1,
                      rel: 0,
                      playsinline: 1,
                      iv_load_policy: 3,
                      mute: 1,
                      loop: 1,
                      playlist: currentYouTubeVideoId || undefined,
                    },
                  },
                  html: {
                    poster: defaultHeroBackground,
                    playsInline: true,
                    controlsList: 'nodownload noplaybackrate noremoteplayback',
                    disablePictureInPicture: true,
                    preload: 'auto',
                  },
                }}
              />
            </div>
          </div>
        ) : null}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgb(0 0 0 / 40%) 0%, rgb(0 0 0 / 20%) 24%, rgb(0 0 0 / 75%) 100%), linear-gradient(90deg, rgb(0 0 0 / 70%) 0%, rgb(0 0 0 / 15%) 55%, rgb(0 0 0 / 60%) 100%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, opacity: isHeroReady ? 1 : 0, transition: 'opacity 220ms ease' }}>
          <HomePageHeader
            items={[
              { label: 'Início', href: `/events/${eventSlug}`, active: true },
              { label: 'Comentários', href: '#comentarios' },
              { label: 'Materiais de Apoio', href: '#materiais' },
              { label: 'Quiz', href: '#quiz' },
            ]}
            brandLabel="Netflix"
            searchControlLabel="Search"
            notificationsControlLabel="Notifications"
            profileControlLabel="Open profile menu"
            style={{ maxWidth: 1320, margin: '0 auto', width: '100%' }}
          />

          <div
            style={{
              maxWidth: 1320,
              margin: '0 auto',
              padding: 'var(--fx-space-8) var(--fx-space-6)',
              minHeight: 560,
              display: 'flex',
              alignItems: 'flex-end',
              boxSizing: 'border-box',
            }}
          >
            <HeroBanner
              mode="overlay"
              size="large"
              badgeLabel={eventVisibility === 'private' ? 'Private event' : 'Public event'}
              eyebrow={eventTitle || eventSlug}
              title={heroTitle}
              description={heroDescription}
              supportingText={eventDescription}
              actions={{
                primaryLabel: heroCtaLabel,
                secondaryLabel: 'More Info',
                onPrimaryClick: onLoad,
              }}
              utilities={{
                ratingLabel: 'TV-14',
                muteControlLabel: 'Mute',
                audioDescriptionControlLabel: 'Audio description',
                replayControlLabel: 'Replay',
              }}
              style={{ width: 620, maxWidth: '100%' }}
            />
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1320,
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gap: 'var(--fx-space-6)',
          padding: '0 var(--fx-space-6) var(--fx-space-8)',
          boxSizing: 'border-box',
          opacity: isHeroReady ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
      >
        <Card id="materiais">
          <Text as="h1" variant="display-large">Flix</Text>
          <Text variant="regular-body" style={{ marginTop: 'var(--fx-space-2)' }}>
            Event: <code>{eventSlug}</code>
          </Text>
          <Text as="h2" variant="medium-title2" style={{ marginTop: 'var(--fx-space-4)' }}>
            Catalog Access
          </Text>
          <AccessKeyForm
            value={accessKey}
            onChange={onAccessKeyChange}
            onSubmit={onLoad}
            loading={loading}
            submitLabel="Load catalog"
          />
        </Card>
        <section id="comentarios">
          <LessonRail title="Continue learning" items={releasedItems} />
        </section>
        <section id="quiz">
          <LessonRail title="Scheduled or restricted" items={gatedItems} />
        </section>
      </section>
    </main>
  );
};
