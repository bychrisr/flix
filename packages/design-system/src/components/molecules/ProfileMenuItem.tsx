import type { CSSProperties, ReactNode } from 'react';
import type { IconName } from '../../assets/icons';
import { Icon } from '../atoms/Icon';

type ProfileMenuItemProps = {
  label: ReactNode;
  iconName?: IconName;
  muted?: boolean;
  ariaLabel: string;
  onClick?: () => void;
  style?: CSSProperties;
};

const itemStyle: CSSProperties = {
  width: '100%',
  border: 0,
  background: 'transparent',
  color: 'var(--fx-color-text-primary)',
  display: 'grid',
  gridTemplateColumns: '20px auto',
  alignItems: 'center',
  gap: 'var(--fx-space-3)',
  textAlign: 'left',
  cursor: 'pointer',
  padding: 0,
  margin: 0,
  fontFamily: 'var(--fx-font-sans)',
  fontSize: 'var(--fx-typo-regular-small-body-normal-size)',
  lineHeight: 'var(--fx-typo-regular-small-body-normal-line)',
  letterSpacing: 'var(--fx-typo-regular-small-body-normal-spacing)',
};

export const ProfileMenuItem = ({ label, iconName, muted = false, ariaLabel, onClick, style }: ProfileMenuItemProps): ReactNode => (
  <button
    type="button"
    aria-label={ariaLabel}
    onClick={onClick}
    style={{ ...itemStyle, color: muted ? 'var(--fx-color-profile-menu-text-muted)' : itemStyle.color, ...style }}
  >
    {iconName ? <Icon name={iconName} size={20} /> : <span aria-hidden="true" />}
    <span>{label}</span>
  </button>
);
