import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

type SignInEmailPasswordPatternProps = {
  emailValue: string;
  passwordValue: string;
  onEmailChange: (next: string) => void;
  onPasswordChange: (next: string) => void;
  onSubmit: () => void;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  buttonLabel?: string;
  disabled?: boolean;
  controlWidth?: CSSProperties['width'];
  style?: CSSProperties;
};

const layoutStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--fx-space-4)',
};

const controlWidthStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-signin-control-width)',
  maxWidth: '100%',
};

const submitStyle: CSSProperties = {
  ...controlWidthStyle,
  minHeight: 'var(--fx-size-pattern-signin-button-height)',
  borderRadius: 'var(--fx-radius-input)',
  background: 'var(--fx-color-brand-primary)',
  borderColor: 'var(--fx-color-brand-primary)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'var(--fx-typo-medium-body-size)',
  lineHeight: 'var(--fx-typo-medium-body-line)',
  fontWeight: 'var(--fx-typo-medium-body-weight)',
  letterSpacing: 'var(--fx-typo-medium-body-spacing)',
};

export const SignInEmailPasswordPattern = ({
  emailValue,
  passwordValue,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  emailPlaceholder = 'Email or phone number',
  passwordPlaceholder = 'Password',
  buttonLabel = 'Sign In',
  disabled,
  controlWidth = 'var(--fx-size-pattern-signin-control-width)',
  style,
}: SignInEmailPasswordPatternProps): ReactNode => (
  <div style={{ ...layoutStyle, ...style }}>
    <Input
      type="email"
      value={emailValue}
      placeholder={emailPlaceholder}
      onChange={(event) => onEmailChange(event.target.value)}
      style={{ ...controlWidthStyle, width: controlWidth }}
    />
    <Input
      type="password"
      value={passwordValue}
      placeholder={passwordPlaceholder}
      onChange={(event) => onPasswordChange(event.target.value)}
      style={{ ...controlWidthStyle, width: controlWidth }}
    />
    <Button type="button" onClick={onSubmit} disabled={disabled} style={{ ...submitStyle, width: controlWidth }}>
      {buttonLabel}
    </Button>
  </div>
);
