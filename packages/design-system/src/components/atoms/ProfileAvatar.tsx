import type { CSSProperties, ReactNode } from 'react';
import type { IconName } from '../../assets/icons';
import { Icon } from './Icon';

export type ProfileAvatarSize = 'sm' | 'md' | 'lg';

type ProfileAvatarProps = {
  imageUrl?: string;
  imageAlt?: string;
  size?: ProfileAvatarSize;
  selected?: boolean;
  addState?: boolean;
  addIconName?: IconName;
  interactive?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  style?: CSSProperties;
};

const sizeMap: Record<ProfileAvatarSize, string> = {
  sm: 'var(--fx-size-pattern-profile-avatar-sm-size)',
  md: 'var(--fx-size-pattern-profile-avatar-md-size)',
  lg: 'var(--fx-size-pattern-profile-avatar-lg-size)',
};

const radiusMap: Record<ProfileAvatarSize, string> = {
  sm: 'var(--fx-size-pattern-profile-avatar-sm-radius)',
  md: 'var(--fx-size-pattern-profile-avatar-sm-radius)',
  lg: 'var(--fx-size-pattern-profile-avatar-lg-radius)',
};

const baseStyle: CSSProperties = {
  border: 0,
  padding: 0,
  margin: 0,
  cursor: 'pointer',
  background: 'transparent',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
  overflow: 'hidden',
};

export const ProfileAvatar = ({
  imageUrl,
  imageAlt = '',
  size = 'md',
  selected = false,
  addState = false,
  addIconName = 'plusWide',
  interactive = true,
  ariaLabel,
  onClick,
  style,
}: ProfileAvatarProps): ReactNode => {
  const dimension = sizeMap[size];

  const visual = imageUrl ? (
    <img
      src={imageUrl}
      alt={imageAlt}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  ) : (
    <span
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--fx-color-profile-avatar-add-background)',
        color: 'var(--fx-color-profile-avatar-add-foreground)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={addIconName} size={size === 'lg' ? 28 : 18} />
    </span>
  );

  const sharedStyle: CSSProperties = {
    ...baseStyle,
    width: dimension,
    height: dimension,
    borderRadius: radiusMap[size],
    outline: selected ? '3px solid var(--fx-color-profile-avatar-selection-border)' : 'none',
    outlineOffset: selected ? '-3px' : '0',
    background: addState ? 'var(--fx-color-profile-avatar-add-background)' : 'transparent',
    cursor: interactive ? 'pointer' : 'default',
    ...style,
  };

  if (!interactive) {
    return (
      <span aria-hidden="true" style={sharedStyle}>
        {visual}
      </span>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} style={sharedStyle}>
      {visual}
    </button>
  );
};
