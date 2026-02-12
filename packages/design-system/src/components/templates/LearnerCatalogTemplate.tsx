import { useMemo, useState, useEffect, useRef, type ReactNode } from 'react';
import ReactPlayer from 'react-player';
import { Text } from '../atoms/Text';
import { Icon } from '../atoms/Icon';
import { MovieBlockCard } from '../molecules/MovieBlockCard';
import { HeroBannerRatingPattern } from '../molecules/HeroBannerRatingPattern';
import { HeroBanner } from '../organisms/HeroBanner';
import { HomePageHeader } from '../organisms/HomePageHeader';
import { LoadingScreen } from '../organisms/LoadingScreen';

type LessonItem = {
  id: string;
  title: string;
  status: 'released' | 'locked' | 'expired';
  imageUrl?: string;
  imageAlt?: string;
  presetIconName?: 'presetTop10' | 'presetRecentlyAdded' | 'presetLeavingSoon' | 'presetNewSeason';
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

const isYouTubeUrl = (url: string) => /youtu\.be|youtube(?:-nocookie)?\.com/i.test(url);

const getYouTubeVideoId = (url: string) => {
  const patterns = [
    /youtu\.be\/([^?&#/]+)/i,
    /youtube\.com\/watch\?v=([^?&#/]+)/i,
    /youtube\.com\/embed\/([^?&#/]+)/i,
    /youtube-nocookie\.com\/embed\/([^?&#/]+)/i,
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
    return `https://www.youtube-nocookie.com/embed/${raw}`;
  }

  if (isYouTubeUrl(raw)) {
    const id = getYouTubeVideoId(raw);
    if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
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

const encodeSvg = (value: string) =>
  value
    .replace(/%/g, '%25')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/#/g, '%23')
    .replace(/"/g, '%22')
    .replace(/\s+/g, ' ')
    .trim();

const buildFallbackCardImage = (seed: string, title: string) => {
  const palette = [
    ['#2d0a10', '#0f1015'],
    ['#121e38', '#0c1018'],
    ['#37210a', '#101216'],
    ['#2a122f', '#0f1015'],
  ];
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const [start, end] = palette[hash % palette.length];
  const shortTitle = (title || 'Untitled').slice(0, 34);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='200' viewBox='0 0 360 200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${start}'/><stop offset='100%' stop-color='${end}'/></linearGradient></defs><rect width='360' height='200' fill='url(#g)'/><rect x='0' y='0' width='360' height='200' fill='rgba(0,0,0,.22)'/><text x='18' y='170' fill='white' font-family='Arial,sans-serif' font-size='22' font-weight='700'>${shortTitle}</text></svg>`;
  return `data:image/svg+xml,${encodeSvg(svg)}`;
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
  const railRef = useRef<HTMLDivElement | null>(null);
  const loopSeekLockRef = useRef(false);
  const activeVideoUrlRef = useRef('');
  const [isMounted, setIsMounted] = useState(false);
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [hasMinPreload, setHasMinPreload] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [canScrollRailPrev, setCanScrollRailPrev] = useState(false);
  const [canScrollRailNext, setCanScrollRailNext] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const candidateVideoUrls = useMemo(() => buildCandidateVideoUrls(highlightVideoUrl), [highlightVideoUrl]);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const currentVideoUrl = candidateVideoUrls[currentCandidateIndex] ?? '';
  const currentYouTubeVideoId = useMemo(() => getYouTubeVideoId(currentVideoUrl) ?? '', [currentVideoUrl]);
  const resolvedHeroTitle = heroTitle || eventTitle || 'Flix';
  const resolvedHeroDescription = heroDescription || eventDescription || undefined;
  const heroRailItems = useMemo(
    () =>
      [...releasedItems, ...gatedItems]
        .slice(0, 10)
        .map((item) => ({
          ...item,
          imageUrl: item.imageUrl || buildFallbackCardImage(item.id, item.title),
        })),
    [releasedItems, gatedItems],
  );
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

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || heroRailItems.length <= 4) {
      setCanScrollRailPrev(false);
      setCanScrollRailNext(false);
      return;
    }

    const updateRailControls = () => {
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
      const epsilon = 2;
      setCanScrollRailPrev(rail.scrollLeft > epsilon);
      setCanScrollRailNext(rail.scrollLeft < maxScrollLeft - epsilon);
    };

    updateRailControls();
    rail.addEventListener('scroll', updateRailControls, { passive: true });
    window.addEventListener('resize', updateRailControls);

    return () => {
      rail.removeEventListener('scroll', updateRailControls);
      window.removeEventListener('resize', updateRailControls);
    };
  }, [heroRailItems]);

  const scrollRail = (direction: 'prev' | 'next') => {
    const rail = railRef.current;
    if (!rail) return;

    const firstCard = rail.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.getBoundingClientRect().width + 10 : rail.clientWidth * 0.85;
    rail.scrollBy({
      left: direction === 'next' ? step : -step,
      behavior: 'smooth',
    });
  };

  return (
    <main style={{ width: '100%', display: 'grid', gap: 'var(--fx-space-6)' }}>
      <LoadingScreen isReady={isHeroReady} />

      <section
        className="fx-catalog-hero"
        style={{
          width: '100%',
          position: 'relative',
          minHeight: 'calc(56.25vw + 96px)',
          height: 'auto',
          overflow: 'visible',
          paddingBottom: 96,
          background: 'var(--fx-color-bg-primary)',
        }}
      >
        {isMounted && !hasVideoError && currentVideoUrl ? (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div
              className="fx-catalog-hero-video-frame"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: 'auto',
                aspectRatio: '16 / 9',
              }}
            >
              <ReactPlayer
                ref={playerRef}
                key={currentVideoUrl}
                src={currentVideoUrl}
                playing
                loop
                muted={isHeroMuted}
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
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    modestbranding: 1,
                    rel: 0,
                    playsinline: 1,
                    iv_load_policy: 3,
                    cc_load_policy: 0,
                    loop: 1,
                    playlist: currentYouTubeVideoId || undefined,
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
              'linear-gradient(180deg, rgb(0 0 0 / 68%) 0%, rgb(0 0 0 / 22%) 24%, rgb(20 20 20 / 90%) 100%), linear-gradient(90deg, rgb(0 0 0 / 76%) 0%, rgb(0 0 0 / 22%) 55%, rgb(0 0 0 / 52%) 100%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, opacity: isHeroReady ? 1 : 0, transition: 'opacity 220ms ease' }}>
          <style>
            {`
              .fx-catalog-hero-video-frame {
                overflow: hidden;
              }

              .fx-catalog-hero-video-frame > div {
                width: 100% !important;
                height: 100% !important;
              }

              .fx-catalog-hero-content {
                min-height: clamp(320px, calc(56.25vw - 188px), 560px) !important;
              }

              .fx-catalog-hero-banner {
                bottom: clamp(108px, 15vh, 176px) !important;
              }

              .fx-catalog-rating-dock {
                right: 0 !important;
                bottom: calc(clamp(108px, 15vh, 176px) + 150px) !important;
              }

              .fx-catalog-hero-rail {
                margin-top: 0 !important;
                transform: translateY(24px);
              }

              .fx-catalog-hero-rail-track {
                grid-auto-columns: calc((100% - 30px) / 4);
              }

              @media (max-width: 1200px) {
                .fx-catalog-hero-content {
                  min-height: clamp(280px, calc(56.25vw - 170px), 520px) !important;
                }

                .fx-catalog-hero-banner {
                  width: min(560px, calc(100% - 72px)) !important;
                }

              }

              @media (max-width: 900px) {
                .fx-catalog-hero {
                  min-height: calc(56.25vw + 64px) !important;
                  padding-bottom: 48px !important;
                }

                .fx-catalog-hero-content {
                  min-height: clamp(260px, calc(56.25vw - 128px), 430px) !important;
                  padding: 0 var(--fx-space-4) !important;
                }

                .fx-catalog-hero-banner {
                  left: var(--fx-space-4) !important;
                  width: calc(100% - 36px) !important;
                  bottom: clamp(92px, 13vh, 118px) !important;
                }

                .fx-catalog-hero-rail {
                  padding: 0 var(--fx-space-4) var(--fx-space-3) !important;
                  transform: translateY(12px);
                }

                .fx-catalog-hero-rail-track {
                  grid-auto-columns: calc((100% - 10px) / 2);
                }

                .fx-catalog-rating-dock {
                  display: none;
                }
              }

              @media (max-width: 768px) {
                .fx-catalog-hero-content {
                  min-height: clamp(260px, calc(56.25vw - 80px), 460px) !important;
                }

                .fx-catalog-hero-banner {
                  width: calc(100% - 30px) !important;
                }

                .fx-catalog-hero-rail {
                  padding-bottom: var(--fx-space-3) !important;
                }
              }

              @media (max-width: 560px) {
                .fx-catalog-hero-video-frame {
                  width: 100% !important;
                  height: auto !important;
                  aspect-ratio: 16 / 9 !important;
                }

                .fx-catalog-hero-content {
                  min-height: clamp(240px, calc(56.25vw - 12px), 420px) !important;
                  padding: 0 var(--fx-space-3) !important;
                }

                .fx-catalog-hero-banner {
                  left: var(--fx-space-3) !important;
                  width: calc(100% - 24px) !important;
                  bottom: clamp(84px, 12vh, 102px) !important;
                }

                .fx-catalog-hero-rail {
                  padding: 0 var(--fx-space-3) var(--fx-space-2) !important;
                  transform: none;
                }

                .fx-catalog-hero-rail-track {
                  grid-auto-columns: 82%;
                }

                .fx-catalog-rail-title {
                  font-size: 22px !important;
                  line-height: 1.2 !important;
                }
              }
            `}
          </style>
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
            className="fx-catalog-hero-content"
            style={{
              maxWidth: 1320,
              margin: '0 auto',
              padding: '0 var(--fx-space-6)',
              minHeight: 700,
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            <div
              className="fx-catalog-hero-banner"
              style={{
                position: 'absolute',
                left: 'var(--fx-space-6)',
                bottom: 162,
                width: 620,
                maxWidth: 'min(620px, calc(100% - 120px))',
              }}
            >
              <HeroBanner
                mode="overlay"
                size="large"
                badgeLabel={undefined}
                eyebrow={eventVisibility === 'private' ? 'Private event' : 'N SERIES'}
                title={resolvedHeroTitle}
                description={resolvedHeroDescription}
                titleStyle={{
                  fontSize: 'clamp(30px, 5.2vw, 68px)',
                  lineHeight: '0.92',
                  letterSpacing: '-0.03em',
                  maxWidth: 540,
                  textTransform: 'uppercase',
                  textShadow: '0 2px 18px rgb(0 0 0 / 45%)',
                }}
                descriptionStyle={{
                  fontSize: 'clamp(14px, 1.9vw, 28px)',
                  lineHeight: '1.2',
                  maxWidth: 650,
                  textShadow: '0 2px 10px rgb(0 0 0 / 45%)',
                }}
                actions={{
                  primaryLabel: heroCtaLabel || 'Play',
                  secondaryLabel: 'More Info',
                  onPrimaryClick: onLoad,
                }}
              />
            </div>

          </div>

          <div
            className="fx-catalog-rating-dock"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 300,
              background: 'var(--fx-color-home-hero-utility-background)',
              padding: 'var(--fx-space-2) 0 var(--fx-space-2) var(--fx-space-2)',
              zIndex: 2,
            }}
          >
            <HeroBannerRatingPattern
              ratingLabel="TV-14"
              leadingIconName={isHeroMuted ? 'heroBannerPreviewMuteDefault' : 'heroBannerPreviewSoundDefault'}
              leadingControlLabel={isHeroMuted ? 'Enable sound' : 'Mute sound'}
              onLeadingIconClick={() => setIsHeroMuted((prev) => !prev)}
            />
          </div>

          {heroRailItems.length ? (
            <div
              className="fx-catalog-hero-rail"
              style={{
                maxWidth: 1320,
                margin: '0 auto',
                padding: '0 var(--fx-space-6) var(--fx-space-4)',
                boxSizing: 'border-box',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--fx-space-2)',
                }}
              >
                <Text
                  as="h3"
                  variant="bold-title3"
                  className="fx-catalog-rail-title"
                  style={{ margin: 0, fontSize: '32px', lineHeight: '1.15' }}
                >
                  Próximas Aulas
                </Text>
                {heroRailItems.length > 4 ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--fx-space-2)' }}>
                    <button
                      type="button"
                      aria-label="Scroll previous lessons"
                      onClick={() => scrollRail('prev')}
                      disabled={!canScrollRailPrev}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '999px',
                        border: 'var(--fx-size-border-default) solid rgb(255 255 255 / 55%)',
                        background: 'rgb(0 0 0 / 45%)',
                        color: 'var(--fx-color-text-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: canScrollRailPrev ? 1 : 0.42,
                        cursor: canScrollRailPrev ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <Icon name="arrowLeft" size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Scroll next lessons"
                      onClick={() => scrollRail('next')}
                      disabled={!canScrollRailNext}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '999px',
                        border: 'var(--fx-size-border-default) solid rgb(255 255 255 / 55%)',
                        background: 'rgb(0 0 0 / 45%)',
                        color: 'var(--fx-color-text-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: canScrollRailNext ? 1 : 0.42,
                        cursor: canScrollRailNext ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <Icon name="arrowRight" size={16} />
                    </button>
                  </div>
                ) : null}
              </div>
              <div
                ref={railRef}
                className="fx-catalog-hero-rail-track"
                style={{
                  display: 'grid',
                  gridAutoFlow: 'column',
                  gridAutoColumns: 'calc((100% - 30px) / 4)',
                  gap: '10px',
                  overflowX: 'auto',
                  paddingBottom: 'var(--fx-space-2)',
                  scrollbarWidth: 'none',
                }}
              >
                {heroRailItems.map((item) => (
                  <MovieBlockCard
                    key={item.id}
                    imageUrl={item.imageUrl ?? buildFallbackCardImage(item.id, item.title)}
                    imageAlt={item.imageAlt ?? item.title}
                    presetIconName={item.presetIconName}
                    presetPosition="bottom-left"
                    titleOverlay={item.title}
                    titleLines={2}
                    style={{
                      width: '100%',
                      height: 'auto',
                      aspectRatio: '16 / 9',
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

    </main>
  );
};
