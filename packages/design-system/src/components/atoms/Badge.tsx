import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type BadgeVariant = 'released' | 'locked' | 'expired' | 'neutral';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, CSSProperties> = {
  released: { borderColor: 'var(--fx-color-success)', background: 'rgb(70 211 105 / 24%)' },
  locked: { borderColor: 'var(--fx-color-border-default)', background: 'rgb(68 142 244 / 20%)' },
  expired: { borderColor: 'var(--fx-color-error)', background: 'rgb(235 57 66 / 20%)' },
  neutral: { borderColor: 'var(--fx-color-border-default)', background: 'var(--fx-color-bg-card)' },
};

export const Badge = ({ children, variant = 'neutral', style, ...props }: BadgeProps) => (
  <span
    style={{
      display: 'inline-block',
      borderRadius: 999,
      border: '1px solid var(--fx-color-border-default)',
      padding: '2px var(--fx-space-3)',
      fontFamily: 'var(--fx-font-sans)',
      fontSize: 'var(--fx-typo-regular-caption1-size)',
      lineHeight: 'var(--fx-typo-regular-caption1-line)',
      fontWeight: 'var(--fx-typo-regular-caption1-weight)',
      letterSpacing: 'var(--fx-typo-regular-caption1-spacing)',
      color: 'var(--fx-color-text-primary)',
      ...variants[variant],
      ...style,
    }}
    {...props}
  >
    {children}
  </span>
);
