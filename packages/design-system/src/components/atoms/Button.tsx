import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--fx-color-brand-primary)',
    color: 'var(--fx-color-text-primary)',
    border: '1px solid var(--fx-color-brand-primary)',
  },
  secondary: {
    background: 'var(--fx-color-bg-card)',
    color: 'var(--fx-color-text-primary)',
    border: '1px solid var(--fx-color-border-default)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--fx-color-text-secondary)',
    border: '1px solid var(--fx-color-border-default)',
  },
  danger: {
    background: 'var(--fx-color-error)',
    color: 'var(--fx-color-text-primary)',
    border: '1px solid var(--fx-color-error)',
  },
};

const base: CSSProperties = {
  borderRadius: 'var(--fx-radius-lg)',
  padding: 'var(--fx-space-3) var(--fx-space-4)',
  fontFamily: 'var(--fx-font-sans)',
  fontSize: 'var(--fx-text-body)',
  fontWeight: 500,
  cursor: 'pointer',
};

export const Button = ({ children, variant = 'primary', style, ...props }: ButtonProps) => (
  <button style={{ ...base, ...variants[variant], ...style }} {...props}>
    {children}
  </button>
);
