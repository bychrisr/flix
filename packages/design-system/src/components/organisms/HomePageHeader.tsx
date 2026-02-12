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
  gap: 'var(--fx-space-6)',
  padding: 'var(--fx-space-6) var(--fx-space-8)',
  flexWrap: 'wrap',
};

const leftStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--fx-space-8)',
  flexWrap: 'wrap',
};

const brandStyle: CSSProperties = {
  margin: 0,
  color: 'var(--fx-color-brand-primary)',
  fontFamily: 'var(--fx-font-display)',
  fontSize: '32px',
  lineHeight: '1',
  fontWeight: 'var(--fx-font-weight-regular)',
  letterSpacing: 'var(--fx-size-pattern-header-logo-letter-spacing)',
  textTransform: 'uppercase',
};

const navStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--fx-space-5)',
  flexWrap: 'wrap',
};

const rightStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--fx-space-4)',
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
  <header style={{ ...headerStyle, ...style }}>
    <style>
      {`
        .fx-home-nav-link {
          --fx-home-nav-link-color: var(--fx-color-text-secondary);
          transition: color 140ms ease, opacity 140ms ease;
          color: var(--fx-home-nav-link-color);
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
          transition: opacity 140ms ease, transform 140ms ease;
        }

        .fx-home-icon-button:hover {
          opacity: 0.86;
          transform: translateY(-1px);
        }
      `}
    </style>
    <div style={leftStyle}>
      <h2 style={brandStyle}>{brandLabel}</h2>
      <nav style={navStyle} aria-label="Primary">
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
              fontSize: 'var(--fx-typo-regular-headline2-size)',
              lineHeight: '24px',
              fontWeight: 'var(--fx-font-weight-regular)',
              letterSpacing: 'var(--fx-typo-regular-headline2-spacing)',
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
