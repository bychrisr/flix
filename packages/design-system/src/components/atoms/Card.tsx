import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const Card = ({ children, style, ...props }: CardProps) => (
  <div
    style={{
      borderRadius: 'var(--fx-radius-xl)',
      border: '1px solid var(--fx-color-border-default)',
      background: 'var(--fx-color-bg-elevated)',
      padding: 'var(--fx-space-4)',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);
