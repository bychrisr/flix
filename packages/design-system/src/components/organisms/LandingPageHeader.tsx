import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Dropdown, type DropdownOption } from '../atoms/Dropdown';

type LandingPageHeaderProps = {
  languageOptions: DropdownOption[];
  languageValue?: string;
  onLanguageChange?: (value: string, option: DropdownOption) => void;
  onSignInClick?: () => void;
  signInLabel?: string;
  brandLabel?: string;
  style?: CSSProperties;
};

const headerStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--fx-space-6)',
  padding: 'var(--fx-space-6) var(--fx-space-8)',
  flexWrap: 'wrap',
};

const brandStyle: CSSProperties = {
  margin: 0,
  color: 'var(--fx-color-brand-primary)',
  fontFamily: 'var(--fx-font-sans)',
  fontSize: 'var(--fx-size-pattern-header-landing-logo-size)',
  lineHeight: '1',
  fontWeight: 'var(--fx-font-weight-bold)',
  letterSpacing: 'var(--fx-size-pattern-header-logo-letter-spacing)',
  textTransform: 'uppercase',
};

const actionsStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--fx-space-4)',
};

const languageControlStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-header-language-width)',
};

const signInButtonStyle: CSSProperties = {
  minWidth: 'var(--fx-size-pattern-header-signin-width)',
  minHeight: 'var(--fx-size-pattern-header-signin-height)',
  borderRadius: 'var(--fx-radius-input)',
};

export const LandingPageHeader = ({
  languageOptions,
  languageValue,
  onLanguageChange,
  onSignInClick,
  signInLabel = 'Sign In',
  brandLabel = 'NETFLIX',
  style,
}: LandingPageHeaderProps): ReactNode => (
  <header style={{ ...headerStyle, ...style }}>
    <h1 style={brandStyle}>{brandLabel}</h1>

    <div style={actionsStyle}>
      <Dropdown
        ariaLabel="Language selector"
        options={languageOptions}
        value={languageValue}
        onChange={onLanguageChange}
        placeholder="English"
        style={languageControlStyle}
      />
      <Button type="button" size="sm" onClick={onSignInClick} style={signInButtonStyle}>
        {signInLabel}
      </Button>
    </div>
  </header>
);
