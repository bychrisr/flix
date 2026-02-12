import type { ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';

type HeroBannerProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

export const HeroBanner = ({ eyebrow, title, description, ctaLabel, onCtaClick }: HeroBannerProps): ReactNode => (
  <section
    style={{
      borderRadius: 'var(--fx-radius-xl)',
      border: '1px solid var(--fx-color-border-default)',
      padding: 'var(--fx-space-8) var(--fx-space-6)',
      background:
        'linear-gradient(110deg, rgb(0 0 0 / 70%) 0%, rgb(0 0 0 / 40%) 60%), radial-gradient(circle at 80% 20%, rgb(229 9 20 / 35%) 0%, transparent 55%), var(--fx-color-bg-elevated)',
    }}
  >
    {eyebrow ? (
      <Text tone="secondary" size="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.7px' }}>
        {eyebrow}
      </Text>
    ) : null}
    <h2 style={{ margin: 'var(--fx-space-2) 0', fontSize: 'var(--fx-text-title)' }}>{title}</h2>
    {description ? <Text tone="secondary">{description}</Text> : null}
    {ctaLabel ? (
      <div style={{ marginTop: 'var(--fx-space-4)' }}>
        <Button onClick={onCtaClick}>{ctaLabel}</Button>
      </div>
    ) : null}
  </section>
);
