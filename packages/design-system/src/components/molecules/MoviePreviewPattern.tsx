import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';

type MoviePreviewPatternProps = {
  onPlayClick?: () => void;
  onAddClick?: () => void;
  onThumbUpClick?: () => void;
  onExpandClick?: () => void;
  style?: CSSProperties;
};

const wrapperStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-video-movie-preview-width)',
  maxWidth: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'var(--fx-space-4)',
};

const controlsStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--fx-space-1)',
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

export const MoviePreviewPattern = ({
  onPlayClick,
  onAddClick,
  onThumbUpClick,
  onExpandClick,
  style,
}: MoviePreviewPatternProps): ReactNode => (
  <div style={{ ...wrapperStyle, ...style }}>
    <div style={controlsStyle}>
      <button type="button" onClick={onPlayClick} style={iconButtonStyle} aria-label="Play">
        <Icon name="moviePreviewPlayDefault" size="var(--fx-size-pattern-video-icon-control)" />
      </button>
      <button type="button" onClick={onAddClick} style={iconButtonStyle} aria-label="Add">
        <Icon name="moviePreviewAddDefault" size="var(--fx-size-pattern-video-icon-control)" />
      </button>
      <button type="button" onClick={onThumbUpClick} style={iconButtonStyle} aria-label="Thumb up">
        <Icon name="moviePreviewThumbUpDefault" size="var(--fx-size-pattern-video-icon-control)" />
      </button>
    </div>

    <button type="button" onClick={onExpandClick} style={iconButtonStyle} aria-label="Expand preview">
      <Icon name="moviePreviewArrowDownDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
  </div>
);
