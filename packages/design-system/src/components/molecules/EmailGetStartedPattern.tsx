import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

type EmailGetStartedPatternProps = {
  emailValue: string;
  onEmailChange: (next: string) => void;
  onSubmit: () => void;
  emailPlaceholder?: string;
  buttonLabel?: string;
  disabled?: boolean;
  showArrow?: boolean;
  style?: CSSProperties;
};

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--fx-space-1)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const inputStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-get-started-input-width)',
  maxWidth: '100%',
};

const buttonStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-get-started-button-width)',
  minHeight: 'var(--fx-size-pattern-get-started-button-height)',
  borderRadius: 'var(--fx-radius-input)',
  background: 'var(--fx-color-brand-primary)',
  borderColor: 'var(--fx-color-brand-primary)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--fx-space-2)',
  fontSize: 'var(--fx-typo-medium-headline2-size)',
  lineHeight: 'var(--fx-typo-medium-headline2-line)',
  fontWeight: 'var(--fx-typo-medium-headline2-weight)',
  letterSpacing: 'var(--fx-typo-medium-headline2-spacing)',
};

export const EmailGetStartedPattern = ({
  emailValue,
  onEmailChange,
  onSubmit,
  emailPlaceholder = 'Email address',
  buttonLabel = 'Get Started',
  disabled,
  showArrow = true,
  style,
}: EmailGetStartedPatternProps): ReactNode => (
  <div style={{ ...rowStyle, ...style }}>
    <Input
      type="email"
      value={emailValue}
      placeholder={emailPlaceholder}
      onChange={(event) => onEmailChange(event.target.value)}
      style={inputStyle}
    />
    <Button type="button" onClick={onSubmit} disabled={disabled} style={buttonStyle}>
      <span>{buttonLabel}</span>
      {showArrow ? (
        <svg
          width="var(--fx-size-pattern-get-started-arrow-width)"
          height="var(--fx-size-pattern-get-started-arrow-height)"
          viewBox="0 0 9 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1L8 8L1 15"
            stroke="var(--fx-color-text-primary)"
            strokeWidth="var(--fx-size-pattern-get-started-arrow-stroke)"
            strokeLinecap="square"
          />
        </svg>
      ) : null}
    </Button>
  </div>
);
