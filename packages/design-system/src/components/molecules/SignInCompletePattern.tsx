import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Text } from '../atoms/Text';

type SignInCompletePatternProps = {
  emailValue: string;
  passwordValue: string;
  rememberMe?: boolean;
  onEmailChange: (next: string) => void;
  onPasswordChange: (next: string) => void;
  onSubmit: () => void;
  onUseSignInCode?: () => void;
  onForgotPassword?: () => void;
  onRememberMeChange?: (checked: boolean) => void;
  onSignUp?: () => void;
  onLearnMore?: () => void;
  title?: string;
  submitLabel?: string;
  useCodeLabel?: string;
  forgotPasswordLabel?: string;
  rememberMeLabel?: string;
  signUpPrefix?: string;
  signUpLabel?: string;
  recaptchaCopy?: string;
  learnMoreLabel?: string;
  controlWidth?: CSSProperties['width'];
  submitting?: boolean;
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

const linkButtonStyle: CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'var(--fx-font-sans)',
  fontSize: 'var(--fx-typo-regular-headline2-size)',
  lineHeight: 'var(--fx-typo-regular-headline2-line)',
  fontWeight: 'var(--fx-typo-regular-headline2-weight)',
  letterSpacing: 'var(--fx-typo-regular-headline2-spacing)',
};

const checkboxButtonStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-signin-checkbox-size)',
  height: 'var(--fx-size-pattern-signin-checkbox-size)',
  borderRadius: 'var(--fx-radius-sm)',
  border: 'var(--fx-size-border-default) solid var(--fx-color-border-strong)',
  background: 'transparent',
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const rowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--fx-space-3)',
};

const footnoteStyle: CSSProperties = {
  ...controlWidthStyle,
  color: 'var(--fx-color-text-tertiary)',
};

export const SignInCompletePattern = ({
  emailValue,
  passwordValue,
  rememberMe = false,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onUseSignInCode,
  onForgotPassword,
  onRememberMeChange,
  onSignUp,
  onLearnMore,
  title = 'Sign In',
  submitLabel = 'Sign In',
  useCodeLabel = 'Use a Sign-In Code',
  forgotPasswordLabel = 'Forgot Password?',
  rememberMeLabel = 'Remember me',
  signUpPrefix = 'New to Flix?',
  signUpLabel = 'Sign up now.',
  recaptchaCopy = "This page is protected by Google reCAPTCHA to ensure you're not a bot.",
  learnMoreLabel = 'Learn more.',
  controlWidth = 'var(--fx-size-pattern-signin-control-width)',
  submitting = false,
  style,
}: SignInCompletePatternProps): ReactNode => (
  <section style={{ ...layoutStyle, ...style }}>
    <Text as="h2" variant="medium-title1" style={{ marginBottom: 'var(--fx-space-6)' }}>
      {title}
    </Text>

    <Input
      type="email"
      value={emailValue}
      placeholder="Email or phone number"
      onChange={(event) => onEmailChange(event.target.value)}
      style={{ ...controlWidthStyle, width: controlWidth }}
    />
    <Input
      type="password"
      value={passwordValue}
      placeholder="Password"
      onChange={(event) => onPasswordChange(event.target.value)}
      style={{ ...controlWidthStyle, width: controlWidth }}
    />

    <Button
      type="button"
      onClick={onSubmit}
      disabled={submitting}
      style={{ ...controlWidthStyle, width: controlWidth, minHeight: 'var(--fx-size-pattern-signin-button-height)' }}
    >
      {submitLabel}
    </Button>

    <Text as="span" variant="regular-headline1" style={{ ...controlWidthStyle, width: controlWidth, textAlign: 'center' }}>
      OR
    </Text>

    <Button
      type="button"
      variant="secondaryPressed"
      onClick={onUseSignInCode}
      style={{ ...controlWidthStyle, width: controlWidth, minHeight: 'var(--fx-size-pattern-signin-button-height)' }}
    >
      {useCodeLabel}
    </Button>

    <button
      type="button"
      onClick={onForgotPassword}
      style={{
        ...linkButtonStyle,
        ...controlWidthStyle,
        width: controlWidth,
        textAlign: 'center',
        color: 'var(--fx-color-text-primary)',
      }}
    >
      {forgotPasswordLabel}
    </button>

    <div style={{ ...rowStyle, marginTop: 'var(--fx-space-2)' }}>
      <button
        type="button"
        role="checkbox"
        aria-checked={rememberMe}
        aria-label={rememberMeLabel}
        onClick={() => onRememberMeChange?.(!rememberMe)}
        style={checkboxButtonStyle}
      >
        {rememberMe ? (
          <svg width="var(--fx-size-pattern-signin-checkbox-size)" height="var(--fx-size-pattern-signin-checkbox-size)" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M4 9.5L7.2 12.5L14 5.5" stroke="var(--fx-color-text-primary)" strokeWidth="var(--fx-size-border-default)" />
          </svg>
        ) : null}
      </button>
      <Text as="span" variant="regular-headline1">
        {rememberMeLabel}
      </Text>
    </div>

    <Text as="p" variant="regular-headline1" tone="secondary" style={controlWidthStyle}>
      {signUpPrefix}{' '}
      <button type="button" onClick={onSignUp} style={{ ...linkButtonStyle, color: 'var(--fx-color-text-primary)', fontWeight: 'var(--fx-font-weight-bold)' }}>
        {signUpLabel}
      </button>
    </Text>

    <Text as="p" variant="regular-small-body-normal" style={footnoteStyle}>
      {recaptchaCopy}{' '}
      <button type="button" onClick={onLearnMore} style={{ ...linkButtonStyle, color: 'var(--fx-color-link-primary)', fontSize: 'inherit', lineHeight: 'inherit', fontWeight: 'inherit' }}>
        {learnMoreLabel}
      </button>
    </Text>
  </section>
);
