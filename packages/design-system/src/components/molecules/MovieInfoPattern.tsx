import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import type { IconName } from '../../assets/icons';

type MovieInfoDetail = {
  label: string;
  value?: string;
};

type MovieInfoPatternProps = {
  statusLabel?: string;
  seasonsLabel?: string;
  yearLabel?: string;
  qualityIconName?: IconName;
  qualityIconAlt?: string;
  audioLabel?: string;
  ratingIconName?: IconName;
  ratingIconAlt?: string;
  presetIconName?: IconName;
  presetIconAlt?: string;
  details?: MovieInfoDetail[];
  style?: CSSProperties;
};

const layoutStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 'var(--fx-space-12)',
  flexWrap: 'wrap',
};

const leftColumnStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--fx-space-3)',
  minWidth: 'var(--fx-size-pattern-movie-info-left-min-width)',
};

const summaryRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--fx-space-3)',
  flexWrap: 'wrap',
};

const rightColumnStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--fx-space-8)',
  minWidth: 'var(--fx-size-pattern-movie-info-right-min-width)',
};

const detailRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 'var(--fx-space-2)',
  flexWrap: 'wrap',
};

const defaultDetails: MovieInfoDetail[] = [{ label: 'Cast:' }, { label: 'Genres:' }, { label: 'This show is:' }];

export const MovieInfoPattern = ({
  statusLabel = 'New',
  seasonsLabel = '3 Seasons',
  yearLabel = '2024',
  qualityIconName = 'videoQualityHd',
  qualityIconAlt = 'HD',
  audioLabel = 'AD',
  ratingIconName = 'ratingTvMa',
  ratingIconAlt = 'TV-MA',
  presetIconName = 'presetTop10',
  presetIconAlt = 'Top 10',
  details = defaultDetails,
  style,
}: MovieInfoPatternProps): ReactNode => (
  <section style={{ ...layoutStyle, ...style }}>
    <div style={leftColumnStyle}>
      <div style={summaryRowStyle}>
        <Text variant="medium-headline2" style={{ color: 'var(--fx-color-success)' }}>
          {statusLabel}
        </Text>
        <Text variant="medium-headline2" tone="secondary">
          {seasonsLabel}
        </Text>
        <Text variant="medium-headline2" tone="secondary">
          {yearLabel}
        </Text>
        <Icon
          name={qualityIconName}
          alt={qualityIconAlt}
          size="var(--fx-size-pattern-movie-info-quality-icon-width)"
          style={{ height: 'var(--fx-size-pattern-movie-info-quality-icon-height)' }}
        />
        <Text variant="medium-headline2" tone="secondary">
          {audioLabel}
        </Text>
      </div>

      <Icon
        name={ratingIconName}
        alt={ratingIconAlt}
        size="var(--fx-size-pattern-movie-info-rating-icon-width)"
        style={{ height: 'var(--fx-size-pattern-movie-info-rating-icon-height)' }}
      />

      <Icon
        name={presetIconName}
        alt={presetIconAlt}
        size="var(--fx-size-pattern-movie-info-preset-icon-width)"
        style={{ height: 'var(--fx-size-pattern-movie-info-preset-icon-height)' }}
      />
    </div>

    <div style={rightColumnStyle}>
      {details.map((detail) => (
        <div key={detail.label} style={detailRowStyle}>
          <Text variant="medium-headline2" tone="secondary">
            {detail.label}
          </Text>
          {detail.value ? (
            <Text variant="regular-headline2" tone="secondary">
              {detail.value}
            </Text>
          ) : null}
        </div>
      ))}
    </div>
  </section>
);
