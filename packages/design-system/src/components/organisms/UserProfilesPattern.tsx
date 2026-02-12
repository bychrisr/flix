import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../atoms/Text';
import { ProfileAvatar } from '../atoms/ProfileAvatar';

export type UserProfileEntry = {
  id: string;
  label: ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  selected?: boolean;
  ariaLabel: string;
  onClick?: () => void;
};

type UserProfilesPatternProps = {
  profiles: UserProfileEntry[];
  addProfile?: {
    label: ReactNode;
    ariaLabel: string;
    onClick?: () => void;
  };
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--fx-space-8)',
  alignItems: 'flex-start',
};

const cardButtonStyle: CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  margin: 0,
  display: 'grid',
  gap: 'var(--fx-space-4)',
  justifyItems: 'center',
  cursor: 'pointer',
};

export const UserProfilesPattern = ({ profiles, addProfile, style }: UserProfilesPatternProps): ReactNode => (
  <section style={{ ...rootStyle, ...style }}>
    {profiles.map((profile) => (
      <button key={profile.id} type="button" onClick={profile.onClick} aria-label={profile.ariaLabel} style={cardButtonStyle}>
        <ProfileAvatar
          imageUrl={profile.imageUrl}
          imageAlt={profile.imageAlt}
          size="lg"
          selected={profile.selected}
          interactive={false}
        />
        <Text as="span" variant="regular-headline2" tone={profile.selected ? 'primary' : 'tertiary'}>
          {profile.label}
        </Text>
      </button>
    ))}

    {addProfile ? (
      <button type="button" onClick={addProfile.onClick} aria-label={addProfile.ariaLabel} style={cardButtonStyle}>
        <ProfileAvatar size="lg" addState ariaLabel={addProfile.ariaLabel} interactive={false} />
        <Text as="span" variant="regular-headline2" tone="tertiary">
          {addProfile.label}
        </Text>
      </button>
    ) : null}
  </section>
);
