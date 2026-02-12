import type { CSSProperties } from 'react';

type FaqToggleIconProps = {
  expanded: boolean;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
};

export const FaqToggleIcon = ({
  expanded,
  size = 'var(--fx-size-pattern-faq-icon-size)',
  color = 'var(--fx-color-text-primary)',
  strokeWidth = 2,
  style,
}: FaqToggleIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 30 30"
    fill="none"
    aria-hidden="true"
    style={{ display: 'block', ...style }}
  >
    {expanded ? (
      <>
        <path d="M7 7L23 23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d="M23 7L7 23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M4 15H26" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d="M15 4V26" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </>
    )}
  </svg>
);
