import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type ButtonVariant =
  | 'primary'
  | 'primaryPressed'
  | 'secondary'
  | 'secondaryPressed'
  | 'ghost'
  | 'danger'
  | 'text'
  | 'textMuted'
  | 'play'
  | 'moreInfo';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
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
  secondaryPressed: {
    background: 'var(--fx-color-bg-hover)',
    color: 'var(--fx-color-text-primary)',
    border: '1px solid var(--fx-color-border-default)',
  },
  primaryPressed: {
    background: 'var(--fx-color-brand-hover)',
    color: 'var(--fx-color-text-primary)',
    border: '1px solid var(--fx-color-brand-hover)',
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
  text: {
    background: 'transparent',
    color: 'var(--fx-color-text-primary)',
    border: '1px solid transparent',
  },
  textMuted: {
    background: 'transparent',
    color: 'var(--fx-color-text-tertiary)',
    border: '1px solid transparent',
  },
  play: {
    background: 'var(--fx-color-text-primary)',
    color: 'var(--fx-color-bg-primary)',
    border: '1px solid var(--fx-color-text-primary)',
  },
  moreInfo: {
    background: 'var(--fx-color-bg-overlay-strong)',
    color: 'var(--fx-color-text-primary)',
    border: '1px solid transparent',
  },
};

const sizes: Record<ButtonSize, CSSProperties> = {
  sm: {
    minHeight: 'var(--fx-size-button-height-sm)',
    padding: '0 var(--fx-size-button-padding-x-sm)',
    fontSize: 'var(--fx-typo-medium-body-size)',
    lineHeight: 'var(--fx-typo-medium-body-line)',
  },
  md: {
    minHeight: 'var(--fx-size-button-height-md)',
    padding: '0 var(--fx-size-button-padding-x-md)',
    fontSize: 'var(--fx-typo-medium-body-size)',
    lineHeight: 'var(--fx-typo-medium-body-line)',
  },
  lg: {
    minHeight: 'var(--fx-size-button-height-lg)',
    padding: '0 var(--fx-size-button-padding-x-lg)',
    fontSize: 'var(--fx-typo-medium-headline2-size)',
    lineHeight: 'var(--fx-typo-medium-headline2-line)',
  },
};

const base: CSSProperties = {
  borderRadius: 'var(--fx-radius-button)',
  fontFamily: 'var(--fx-font-sans)',
  fontWeight: 'var(--fx-font-weight-medium)',
  letterSpacing: 'var(--fx-typo-medium-body-spacing)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--fx-space-2)',
  whiteSpace: 'nowrap',
};

const disabledStyle: CSSProperties = {
  opacity: 'var(--fx-opacity-disabled)',
  cursor: 'not-allowed',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  disabled,
  style,
  ...props
}: ButtonProps) => (
  <button
    style={{
      ...base,
      ...sizes[size],
      ...variants[variant],
      ...(fullWidth ? { width: '100%' } : null),
      ...(disabled ? disabledStyle : null),
      ...style,
    }}
    disabled={disabled}
    {...props}
  >
    {leadingIcon}
    {children}
    {trailingIcon}
  </button>
);
