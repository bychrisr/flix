import { useMemo, useState, type CSSProperties, type InputHTMLAttributes } from 'react';

type InputState = 'default' | 'focused' | 'error';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  state?: InputState;
  errorMessage?: string;
  helperText?: string;
};

const baseInputStyle: CSSProperties = {
  width: '100%',
  height: 'var(--fx-size-input-height)',
  borderRadius: 'var(--fx-radius-input)',
  border: 'var(--fx-size-border-default) solid var(--fx-color-border-strong)',
  background: 'var(--fx-color-bg-input)',
  color: 'var(--fx-color-text-primary)',
  padding: '0 var(--fx-space-4)',
  fontFamily: 'var(--fx-font-sans)',
  fontSize: 'var(--fx-typo-regular-headline2-size)',
  lineHeight: 'var(--fx-typo-regular-headline2-line)',
  fontWeight: 'var(--fx-typo-regular-headline2-weight)',
  letterSpacing: 'var(--fx-typo-regular-headline2-spacing)',
  outline: 'none',
  transition: 'box-shadow 150ms ease, border-color 150ms ease',
};

const helperStyle: CSSProperties = {
  fontFamily: 'var(--fx-font-sans)',
  fontSize: 'var(--fx-typo-medium-caption1-size)',
  lineHeight: 'var(--fx-typo-medium-caption1-line)',
  fontWeight: 'var(--fx-typo-medium-caption1-weight)',
  letterSpacing: 'var(--fx-typo-medium-caption1-spacing)',
  marginTop: 'var(--fx-space-1)',
  display: 'inline-flex',
  gap: 'var(--fx-space-1)',
  alignItems: 'center',
};

const ErrorIcon = () => (
  <svg
    width="var(--fx-size-input-error-icon)"
    height="var(--fx-size-input-error-icon)"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 0.5C3.85775 0.5 0.5 3.85775 0.5 8C0.5 12.1422 3.85775 15.5 8 15.5C12.1422 15.5 15.5 12.1422 15.5 8C15.5 3.85775 12.1422 0.5 8 0.5ZM5.64645 5.64645C5.84171 5.45118 6.15829 5.45118 6.35355 5.64645L8 7.29289L9.64645 5.64645C9.84171 5.45118 10.1583 5.45118 10.3536 5.64645C10.5488 5.84171 10.5488 6.15829 10.3536 6.35355L8.70711 8L10.3536 9.64645C10.5488 9.84171 10.5488 10.1583 10.3536 10.3536C10.1583 10.5488 9.84171 10.5488 9.64645 10.3536L8 8.70711L6.35355 10.3536C6.15829 10.5488 5.84171 10.5488 5.64645 10.3536C5.45118 10.1583 5.45118 9.84171 5.64645 9.64645L7.29289 8L5.64645 6.35355C5.45118 6.15829 5.45118 5.84171 5.64645 5.64645Z"
      fill="var(--fx-color-error)"
    />
  </svg>
);

export const Input = ({ state, errorMessage, helperText, style, onFocus, onBlur, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { width, maxWidth, minWidth, ...styleOverrides } = style ?? {};

  const resolvedState = useMemo<InputState>(() => {
    if (state) {
      return state;
    }
    if (errorMessage) {
      return 'error';
    }
    if (isFocused) {
      return 'focused';
    }
    return 'default';
  }, [errorMessage, isFocused, state]);

  const inputStyle: CSSProperties = {
    ...baseInputStyle,
    borderColor: resolvedState === 'error' ? 'var(--fx-color-error)' : 'var(--fx-color-border-strong)',
    boxShadow: resolvedState === 'focused' ? '0 0 0 var(--fx-size-focus-ring) var(--fx-color-text-primary)' : 'none',
    opacity: props.disabled ? 0.6 : 1,
    ...styleOverrides,
  };

  return (
    <div style={{ width: width ?? '100%', maxWidth, minWidth }}>
      <input
        {...props}
        data-fx-input="true"
        style={inputStyle}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
      />
      {errorMessage ? (
        <span style={{ ...helperStyle, color: 'var(--fx-color-error)' }}>
          <ErrorIcon />
          {errorMessage}
        </span>
      ) : null}
      {!errorMessage && helperText ? (
        <span style={{ ...helperStyle, color: 'var(--fx-color-text-secondary)' }}>{helperText}</span>
      ) : null}
    </div>
  );
};
