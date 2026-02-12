import { useEffect, useState } from 'react';

type LoadingScreenProps = {
  isReady: boolean;
  brandLabel?: string;
  loadingLabel?: string;
};

export const LoadingScreen = ({
  isReady,
  brandLabel = 'FLIX',
  loadingLabel = 'Preparando sua experiencia',
}: LoadingScreenProps) => {
  const [shouldExit, setShouldExit] = useState(false);

  useEffect(() => {
    if (!isReady) {
      setShouldExit(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShouldExit(true);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isReady]);

  if (shouldExit) return null;

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 15% 12%, rgb(229 9 20 / 36%) 0%, transparent 44%), radial-gradient(circle at 78% 18%, rgb(18 63 124 / 22%) 0%, transparent 40%), radial-gradient(circle at 62% 78%, rgb(229 9 20 / 16%) 0%, transparent 38%), linear-gradient(180deg, #090909 0%, #111111 52%, #090909 100%)',
        animation: isReady ? 'fx-loader-fade-out 0.8s ease-in-out forwards' : undefined,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgb(0 0 0 / 56%) 0%, rgb(0 0 0 / 28%) 46%, rgb(0 0 0 / 58%) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 'min(42vw, 560px)',
          height: 'min(42vw, 560px)',
          left: '-12%',
          top: '-14%',
          borderRadius: '999px',
          background:
            'radial-gradient(circle at 35% 35%, rgb(229 9 20 / 40%) 0%, rgb(229 9 20 / 6%) 55%, transparent 75%)',
          filter: 'blur(4px)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 'min(36vw, 460px)',
          height: 'min(36vw, 460px)',
          right: '-10%',
          bottom: '-20%',
          borderRadius: '999px',
          background:
            'radial-gradient(circle at 55% 40%, rgb(229 9 20 / 28%) 0%, rgb(229 9 20 / 4%) 58%, transparent 78%)',
          filter: 'blur(6px)',
          pointerEvents: 'none',
        }}
      />

      <style>
        {`
          @keyframes fx-loader-fade-out {
            from { opacity: 1; }
            to { opacity: 0; }
          }

          @keyframes fx-loader-logo-pulse {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes fx-loader-bar-run {
            from { left: -100%; }
            to { left: 100%; }
          }

          @keyframes fx-loader-label-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          marginBottom: '32px',
          color: 'var(--fx-color-brand-primary, #e50914)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          fontSize: 'clamp(3rem, 7vw, 5rem)',
          animation: 'fx-loader-logo-pulse 1s ease-out infinite alternate',
        }}
      >
        {brandLabel}
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '4px',
          width: 'min(80vw, 320px)',
          overflow: 'hidden',
          borderRadius: '999px',
          backgroundColor: '#27272a',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '50%',
            background:
              'linear-gradient(90deg, transparent 0%, var(--fx-color-brand-primary, #e50914) 50%, transparent 100%)',
            animation: 'fx-loader-bar-run 1.5s linear infinite',
          }}
        />
      </div>

      <p
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: '16px',
          color: '#71717a',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          fontSize: '12px',
          fontWeight: 500,
          animation: 'fx-loader-label-fade 0.4s ease 0.5s forwards',
          opacity: 0,
        }}
      >
        {loadingLabel}
      </p>
    </div>
  );
};
