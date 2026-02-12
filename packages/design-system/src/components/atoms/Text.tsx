import type { HTMLAttributes, ReactNode } from 'react';

type TextTone = 'primary' | 'secondary' | 'tertiary' | 'error';
type TextSize = 'caption' | 'body' | 'headline' | 'title';

type TextProps = HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'strong';
  children: ReactNode;
  tone?: TextTone;
  size?: TextSize;
};

const tones: Record<TextTone, string> = {
  primary: 'var(--fx-color-text-primary)',
  secondary: 'var(--fx-color-text-secondary)',
  tertiary: 'var(--fx-color-text-tertiary)',
  error: 'var(--fx-color-error)',
};

const sizes: Record<TextSize, string> = {
  caption: 'var(--fx-text-caption)',
  body: 'var(--fx-text-body)',
  headline: 'var(--fx-text-headline)',
  title: 'var(--fx-text-title)',
};

export const Text = ({ as = 'p', children, tone = 'primary', size = 'body', style, ...props }: TextProps) => {
  const Comp = as;
  return (
    <Comp
      style={{
        margin: 0,
        color: tones[tone],
        fontSize: sizes[size],
        fontFamily: 'var(--fx-font-sans)',
        ...style,
      }}
      {...props}
    >
      {children}
    </Comp>
  );
};
