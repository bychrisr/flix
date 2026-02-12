import type { CSSProperties, InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const style: CSSProperties = {
  borderRadius: 'var(--fx-radius-lg)',
  border: '1px solid var(--fx-color-border-strong)',
  background: 'transparent',
  color: 'var(--fx-color-text-primary)',
  padding: 'var(--fx-space-3) var(--fx-space-4)',
  fontFamily: 'var(--fx-font-sans)',
  fontSize: 'var(--fx-text-body)',
  width: '100%',
};

export const Input = (props: InputProps) => <input style={style} {...props} />;
