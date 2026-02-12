import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import type { IconName } from '../../assets/icons';

export type HomeNavItem = {
  label: string;
  href: string;
  active?: boolean;
};

type HomePageHeaderProps = {
  items: HomeNavItem[];
  brandLabel: string;
  profileIconName?: IconName;
  searchControlLabel: string;
  notificationsControlLabel: string;
  profileControlLabel: string;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  style?: CSSProperties;
};

const headerStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--fx-space-4)',
  padding: '14px var(--fx-space-6)',
  flexWrap: 'nowrap',
};

const leftStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--fx-space-6)',
  flexWrap: 'nowrap',
  minWidth: 0,
};

const brandStyle: CSSProperties = {
  margin: 0,
  color: 'var(--fx-color-brand-primary)',
  fontFamily: 'var(--fx-font-display)',
  fontSize: '40px',
  lineHeight: '0.9',
  fontWeight: 'var(--fx-font-weight-regular)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  flexShrink: 0,
};

const navStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '18px',
  flexWrap: 'nowrap',
  minWidth: 0,
};

const rightStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '14px',
  flexShrink: 0,
};

const iconButtonStyle: CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
};

const profileButtonStyle: CSSProperties = {
  ...iconButtonStyle,
  gap: 'var(--fx-space-2)',
};

export const HomePageHeader = ({
  items,
  brandLabel,
  profileIconName = 'account',
  searchControlLabel,
  notificationsControlLabel,
  profileControlLabel,
  onSearchClick,
  onNotificationsClick,
  onProfileClick,
  style,
}: HomePageHeaderProps): ReactNode => (
  <header className="fx-home-header" style={{ ...headerStyle, ...style }}>
    <style>
      {`
        .fx-home-header {
          box-sizing: border-box;
        }

        .fx-home-header-left {
          overflow: hidden;
        }

        .fx-home-header-nav {
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .fx-home-header-nav::-webkit-scrollbar {
          display: none;
        }

        .fx-home-nav-link {
          --fx-home-nav-link-color: var(--fx-color-text-secondary);
          transition: color 140ms ease, opacity 140ms ease;
          color: var(--fx-home-nav-link-color);
          white-space: nowrap;
        }

        .fx-home-nav-link.is-active {
          --fx-home-nav-link-color: var(--fx-color-text-primary);
          font-weight: var(--fx-font-weight-medium);
        }

        .fx-home-nav-link:hover {
          color: var(--fx-color-text-primary);
          opacity: 0.92;
        }

        .fx-home-nav-link:focus-visible {
          outline: 2px solid var(--fx-color-text-primary);
          outline-offset: 4px;
          border-radius: 2px;
        }

        .fx-home-icon-button {
          transition: opacity 140ms ease;
        }

        .fx-home-icon-button:hover {
          opacity: 0.86;
        }

        .fx-home-icon-button:focus-visible {
          outline: 2px solid var(--fx-color-text-primary);
          outline-offset: 3px;
          border-radius: 3px;
        }

        @media (max-width: 1280px) {
          .fx-home-header {
            padding: 12px var(--fx-space-5);
          }

          .fx-home-header-brand {
            font-size: 34px;
          }
        }

        @media (max-width: 900px) {
          .fx-home-header {
            flex-wrap: nowrap;
            justify-content: space-between;
            padding: 10px var(--fx-space-4);
          }

          .fx-home-header-left {
            width: auto;
            flex: 1 1 auto;
            min-width: 0;
            gap: var(--fx-space-3);
          }

          .fx-home-header-nav {
            max-width: min(62vw, 420px);
            justify-content: flex-start;
          }
        }

        @media (max-width: 640px) {
          .fx-home-header-brand {
            font-size: 30px;
          }

          .fx-home-header-nav {
            max-width: min(56vw, 260px);
            gap: 14px;
          }

          .fx-home-nav-link {
            font-size: 12px;
            line-height: 18px;
          }
        }
      `}
    </style>
    <div className="fx-home-header-left" style={leftStyle}>
      <h2 className="fx-home-header-brand" style={brandStyle}>{brandLabel}</h2>
      <nav className="fx-home-header-nav" style={navStyle} aria-label="Primary">
        {items.map((item) => (
          <a
            className={`fx-home-nav-link${item.active ? ' is-active' : ''}`}
            key={item.href}
            href={item.href}
            style={{
              background: 'transparent',
              border: 0,
              borderRadius: 0,
              padding: 0,
              textDecoration: 'none',
              fontFamily: 'var(--fx-font-sans)',
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 'var(--fx-font-weight-regular)',
              letterSpacing: '0.01em',
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>

    <div style={rightStyle}>
      <button
        className="fx-home-icon-button"
        type="button"
        onClick={onSearchClick}
        style={iconButtonStyle}
        aria-label={searchControlLabel}
      >
        <Icon name="search" size="var(--fx-size-pattern-header-action-icon-size)" />
      </button>
      <button
        className="fx-home-icon-button"
        type="button"
        onClick={onNotificationsClick}
        style={iconButtonStyle}
        aria-label={notificationsControlLabel}
      >
        <Icon name="notification" size="var(--fx-size-pattern-header-action-icon-size)" />
      </button>
      <button
        className="fx-home-icon-button"
        type="button"
        onClick={onProfileClick}
        style={profileButtonStyle}
        aria-label={profileControlLabel}
      >
        <Icon name={profileIconName} size="var(--fx-size-pattern-header-avatar-size)" />
        <Icon name="arrowDown" size="var(--fx-size-pattern-header-caret-size)" />
      </button>
    </div>
  </header>
);
