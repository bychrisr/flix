import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../atoms/Text';
import { EpisodeListItem } from '../molecules/EpisodeListItem';
import { MoviePreviewPattern } from '../molecules/MoviePreviewPattern';
import { MoviePreviewDetailsPattern } from '../molecules/MoviePreviewDetailsPattern';

type EpisodeListEntry = {
  id: string;
  itemAriaLabel?: string;
  episodeNumber: number;
  title: string;
  durationLabel: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  active?: boolean;
  onClick?: () => void;
};

type MoviePreviewDesktopPatternProps = {
  heroImageUrl: string;
  heroImageAlt?: string;
  title: ReactNode;
  description: ReactNode;
  yearLabel: string;
  ratingIconName?: 'ratingTvMa' | 'ratingTv14' | 'ratingTvPg' | 'ratingTvG';
  sideTitle: string;
  sideItem: EpisodeListEntry;
  onPlayClick?: () => void;
  onAddClick?: () => void;
  onThumbUpClick?: () => void;
  onExpandClick?: () => void;
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-movie-preview-desktop-width)',
  maxWidth: '100%',
  minHeight: 'var(--fx-size-pattern-movie-preview-desktop-height)',
  borderRadius: 'var(--fx-radius-lg)',
  background: 'var(--fx-color-bg-elevated)',
  padding: 'var(--fx-space-6)',
  display: 'grid',
  gridTemplateColumns: 'var(--fx-size-pattern-movie-preview-left-width) var(--fx-size-pattern-movie-preview-right-width)',
  gap: 'var(--fx-space-10)',
};

const mediaStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-movie-preview-left-width)',
  height: 'var(--fx-size-pattern-movie-preview-left-media-height)',
  objectFit: 'cover',
  display: 'block',
  borderTopLeftRadius: 'var(--fx-radius-sm)',
  borderTopRightRadius: 'var(--fx-radius-sm)',
};

export const MoviePreviewDesktopPattern = ({
  heroImageUrl,
  heroImageAlt = '',
  title,
  description,
  yearLabel,
  ratingIconName = 'ratingTv14',
  sideTitle,
  sideItem,
  onPlayClick,
  onAddClick,
  onThumbUpClick,
  onExpandClick,
  style,
}: MoviePreviewDesktopPatternProps): ReactNode => (
  <section style={{ ...rootStyle, ...style }}>
    <div style={{ borderRadius: 'var(--fx-radius-sm)', overflow: 'hidden', background: 'var(--fx-color-bg-secondary)' }}>
      <img src={heroImageUrl} alt={heroImageAlt} style={mediaStyle} />
      <div style={{ padding: 'var(--fx-space-4)', display: 'grid', gap: 'var(--fx-space-4)' }}>
        <Text as="h3" variant="medium-title3">{title}</Text>
        <Text as="p" variant="regular-body" tone="secondary">{description}</Text>
        <MoviePreviewPattern
          onPlayClick={onPlayClick}
          onAddClick={onAddClick}
          onThumbUpClick={onThumbUpClick}
          onExpandClick={onExpandClick}
          style={{ width: '100%' }}
        />
        <MoviePreviewDetailsPattern ratingIconName={ratingIconName} yearLabel={yearLabel} onAddClick={onAddClick} />
      </div>
    </div>

    <div
      style={{
        borderRadius: 'var(--fx-radius-input)',
        background: 'var(--fx-color-movie-card-secondary-surface)',
        padding: 'var(--fx-space-4)',
        display: 'grid',
        alignContent: 'start',
        gap: 'var(--fx-space-3)',
      }}
    >
      <Text as="h4" variant="medium-headline2">{sideTitle}</Text>
      <EpisodeListItem
        itemAriaLabel={sideItem.itemAriaLabel}
        episodeNumber={sideItem.episodeNumber}
        title={sideItem.title}
        durationLabel={sideItem.durationLabel}
        description={sideItem.description}
        imageUrl={sideItem.imageUrl}
        imageAlt={sideItem.imageAlt}
        active={sideItem.active}
        onClick={sideItem.onClick}
        style={{ padding: 0, gridTemplateColumns: 'var(--fx-size-pattern-movie-preview-side-thumb-width) auto' }}
      />
    </div>
  </section>
);
