import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import type { IconName } from '../../assets/icons';

type HomeNavItem = {
  label: string;
  href: string;
  active?: boolean;
};

type HomePageHeaderProps = {
  items: HomeNavItem[];
  brandLabel?: string;
  profileIconName?: IconName;
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
  padding: 'var(--fx-space-4) var(--fx-space-8)',
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
  fontFamily: 'var(--fx-font-sans)',
  fontSize: 'var(--fx-size-pattern-header-home-logo-size)',
  lineHeight: '1',
  fontWeight: 'var(--fx-font-weight-bold)',
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
  brandLabel = 'NETFLIX',
  profileIconName = 'account',
  onSearchClick,
  onNotificationsClick,
  onProfileClick,
  style,
}: HomePageHeaderProps): ReactNode => (
  <header style={{ ...headerStyle, ...style }}>
    <div style={leftStyle}>
      <h2 style={brandStyle}>{brandLabel}</h2>
      <nav style={navStyle} aria-label="Primary">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              color: item.active ? 'var(--fx-color-text-primary)' : 'var(--fx-color-text-secondary)',
              textDecoration: 'none',
              fontFamily: 'var(--fx-font-sans)',
              fontSize: 'var(--fx-typo-medium-headline2-size)',
              lineHeight: 'var(--fx-typo-medium-headline2-line)',
              fontWeight: item.active ? 'var(--fx-font-weight-medium)' : 'var(--fx-font-weight-regular)',
              letterSpacing: 'var(--fx-typo-medium-headline2-spacing)',
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>

    <div style={rightStyle}>
      <button type="button" onClick={onSearchClick} style={iconButtonStyle} aria-label="Search">
        <Icon name="search" size="var(--fx-size-pattern-header-action-icon-size)" />
      </button>
      <button type="button" onClick={onNotificationsClick} style={iconButtonStyle} aria-label="Notifications">
        <Icon name="notification" size="var(--fx-size-pattern-header-action-icon-size)" />
      </button>
      <button type="button" onClick={onProfileClick} style={profileButtonStyle} aria-label="Profile menu">
        <Icon name={profileIconName} size="var(--fx-size-pattern-header-avatar-size)" />
        <Icon name="arrowDown" size="var(--fx-size-pattern-header-caret-size)" />
      </button>
    </div>
  </header>
);
