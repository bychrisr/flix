import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../atoms/Text';

type EpisodeListItemProps = {
  itemAriaLabel?: string;
  episodeNumber: number;
  title: string;
  durationLabel: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  active?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

const itemStyle: CSSProperties = {
  width: '100%',
  border: 0,
  padding: 'var(--fx-space-4)',
  margin: 0,
  display: 'grid',
  gridTemplateColumns: 'var(--fx-size-pattern-episode-thumb-width) auto',
  gap: 'var(--fx-space-4)',
  background: 'transparent',
  textAlign: 'left',
  cursor: 'pointer',
  borderRadius: 'var(--fx-radius-sm)',
};

const thumbStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-episode-thumb-width)',
  height: 'var(--fx-size-pattern-episode-thumb-height)',
  borderRadius: 'var(--fx-radius-sm)',
  objectFit: 'cover',
  display: 'block',
  background: 'var(--fx-color-bg-hover)',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 'var(--fx-space-3)',
};

export const EpisodeListItem = ({
  itemAriaLabel,
  episodeNumber,
  title,
  durationLabel,
  description,
  imageUrl,
  imageAlt = '',
  active = false,
  onClick,
  style,
}: EpisodeListItemProps): ReactNode => (
  <button
    type="button"
    style={{
      ...itemStyle,
      ...(active
        ? {
            background: 'var(--fx-color-movie-card-active-background)',
            outline: 'var(--fx-size-border-default) solid var(--fx-color-border-default)',
          }
        : null),
      ...style,
    }}
    onClick={onClick}
    aria-label={itemAriaLabel ?? title}
  >
    <img src={imageUrl} alt={imageAlt} style={thumbStyle} />

    <div style={{ display: 'grid', gap: 'var(--fx-space-2)' }}>
      <div style={headerStyle}>
        <Text as="span" variant="medium-body">{`${episodeNumber}. ${title}`}</Text>
        <Text as="span" variant="regular-caption1" tone="secondary">{durationLabel}</Text>
      </div>
      <Text as="p" variant="regular-caption1" tone="secondary" style={{ margin: 0 }}>
        {description}
      </Text>
    </div>
  </button>
);
