import type { CSSProperties, ReactNode } from 'react';
import { getVideoPlayerIconSetAsset, type VideoPlayerIconSetName } from '../../assets/icons';

type VideoPlayerIconButtonProps = {
  icon: VideoPlayerIconSetName;
  state?: 'default' | 'hover';
  size?: number | string;
  ariaLabel: string;
  onClick?: () => void;
  style?: CSSProperties;
};

const buttonStyle: CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  margin: 0,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
};

export const VideoPlayerIconButton = ({
  icon,
  state = 'default',
  size = 'var(--fx-size-pattern-video-icon-control)',
  ariaLabel,
  onClick,
  style,
}: VideoPlayerIconButtonProps): ReactNode => (
  <button type="button" aria-label={ariaLabel} onClick={onClick} style={{ ...buttonStyle, ...style }}>
    <img
      src={getVideoPlayerIconSetAsset(icon, state)}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  </button>
);
