import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import { ProfileAvatar } from '../atoms/ProfileAvatar';

type ProfileAvatarTriggerProps = {
  avatarImageUrl?: string;
  avatarImageAlt?: string;
  avatarAriaLabel: string;
  showCaret?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-profile-compact-trigger-width)',
  minHeight: 'var(--fx-size-pattern-profile-compact-trigger-height)',
  borderRadius: 'var(--fx-radius-lg)',
  border: '1px dashed var(--fx-color-brand-primary-active)',
  background: 'var(--fx-color-bg-elevated)',
  padding: 'var(--fx-space-8)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--fx-space-6)',
};

const triggerStyle: CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  margin: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--fx-space-6)',
  cursor: 'pointer',
  color: 'var(--fx-color-text-primary)',
};

export const ProfileAvatarTrigger = ({
  avatarImageUrl,
  avatarImageAlt = '',
  avatarAriaLabel,
  showCaret = true,
  onClick,
  style,
}: ProfileAvatarTriggerProps): ReactNode => (
  <div style={{ ...rootStyle, ...style }}>
    <button type="button" onClick={onClick} aria-label={avatarAriaLabel} style={triggerStyle}>
      <ProfileAvatar
        imageUrl={avatarImageUrl}
        imageAlt={avatarImageAlt}
        size="sm"
        interactive={false}
      />
      {showCaret ? <Icon name="arrowDown" size={10} /> : null}
    </button>
  </div>
);
