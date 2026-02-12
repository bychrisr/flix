import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { useState } from 'react';
import { getHeroBannerPreviewIconSetAsset, type HeroBannerPreviewIconSetName } from '../../assets/icons';

type HeroBannerControlButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  iconSet: HeroBannerPreviewIconSetName;
  label: string;
  size?: number | string;
};

const buttonStyle: CSSProperties = {
  border: 'var(--fx-size-border-default) solid var(--fx-color-hero-control-border)',
  background: 'var(--fx-color-hero-control-background)',
  color: 'var(--fx-color-text-primary)',
  padding: 0,
  width: 'var(--fx-size-pattern-hero-control-size)',
  height: 'var(--fx-size-pattern-hero-control-size)',
  borderRadius: '9999px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
  flexShrink: 0,
};

const iconStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-header-action-icon-size)',
  height: 'var(--fx-size-pattern-header-action-icon-size)',
  objectFit: 'contain',
};

export const HeroBannerControlButton = ({ iconSet, label, size, style, ...props }: HeroBannerControlButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const iconSrc = getHeroBannerPreviewIconSetAsset(iconSet, hovered ? 'hover' : 'default');

  return (
    <button
      type="button"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...buttonStyle, ...(size ? { width: size, height: size } : null), ...style }}
      {...props}
    >
      <img src={iconSrc} alt="" aria-hidden="true" style={iconStyle} />
    </button>
  );
};
