import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type TextTone = 'primary' | 'secondary' | 'tertiary' | 'error';
type TextVariant =
  | 'regular-caption2'
  | 'regular-caption1'
  | 'regular-small-body'
  | 'regular-small-body-normal'
  | 'regular-body'
  | 'regular-headline2'
  | 'regular-headline1'
  | 'regular-title4'
  | 'regular-title3'
  | 'regular-title2'
  | 'regular-title1'
  | 'regular-large-title'
  | 'medium-caption2'
  | 'medium-caption1'
  | 'medium-small-body'
  | 'medium-body'
  | 'medium-body-condensed'
  | 'medium-headline2'
  | 'medium-headline1'
  | 'medium-title4'
  | 'medium-title3'
  | 'medium-title3-condensed'
  | 'medium-title2'
  | 'medium-title1'
  | 'medium-large-title'
  | 'bold-title2'
  | 'bold-title1'
  | 'bold-large-title'
  | 'display-small'
  | 'display-medium'
  | 'display-large'
  | 'display-xlarge';

type TextProps = HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'strong' | 'h1' | 'h2' | 'h3' | 'h4';
  children: ReactNode;
  tone?: TextTone;
  variant?: TextVariant;
};

const tones: Record<TextTone, string> = {
  primary: 'var(--fx-color-text-primary)',
  secondary: 'var(--fx-color-text-secondary)',
  tertiary: 'var(--fx-color-text-tertiary)',
  error: 'var(--fx-color-error)',
};

const variants: Record<TextVariant, CSSProperties> = {
  'regular-caption2': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-caption2-size)',
    lineHeight: 'var(--fx-typo-regular-caption2-line)',
    fontWeight: 'var(--fx-typo-regular-caption2-weight)',
    letterSpacing: 'var(--fx-typo-regular-caption2-spacing)',
  },
  'regular-caption1': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-caption1-size)',
    lineHeight: 'var(--fx-typo-regular-caption1-line)',
    fontWeight: 'var(--fx-typo-regular-caption1-weight)',
    letterSpacing: 'var(--fx-typo-regular-caption1-spacing)',
  },
  'regular-small-body': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-small-body-size)',
    lineHeight: 'var(--fx-typo-regular-small-body-line)',
    fontWeight: 'var(--fx-typo-regular-small-body-weight)',
    letterSpacing: 'var(--fx-typo-regular-small-body-spacing)',
  },
  'regular-small-body-normal': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-small-body-normal-size)',
    lineHeight: 'var(--fx-typo-regular-small-body-normal-line)',
    fontWeight: 'var(--fx-typo-regular-small-body-normal-weight)',
    letterSpacing: 'var(--fx-typo-regular-small-body-normal-spacing)',
  },
  'regular-body': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-body-size)',
    lineHeight: 'var(--fx-typo-regular-body-line)',
    fontWeight: 'var(--fx-typo-regular-body-weight)',
    letterSpacing: 'var(--fx-typo-regular-body-spacing)',
  },
  'regular-headline2': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-headline2-size)',
    lineHeight: 'var(--fx-typo-regular-headline2-line)',
    fontWeight: 'var(--fx-typo-regular-headline2-weight)',
    letterSpacing: 'var(--fx-typo-regular-headline2-spacing)',
  },
  'regular-headline1': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-headline1-size)',
    lineHeight: 'var(--fx-typo-regular-headline1-line)',
    fontWeight: 'var(--fx-typo-regular-headline1-weight)',
    letterSpacing: 'var(--fx-typo-regular-headline1-spacing)',
  },
  'regular-title4': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-title4-size)',
    lineHeight: 'var(--fx-typo-regular-title4-line)',
    fontWeight: 'var(--fx-typo-regular-title4-weight)',
    letterSpacing: 'var(--fx-typo-regular-title4-spacing)',
  },
  'regular-title3': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-title3-size)',
    lineHeight: 'var(--fx-typo-regular-title3-line)',
    fontWeight: 'var(--fx-typo-regular-title3-weight)',
    letterSpacing: 'var(--fx-typo-regular-title3-spacing)',
  },
  'regular-title2': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-title2-size)',
    lineHeight: 'var(--fx-typo-regular-title2-line)',
    fontWeight: 'var(--fx-typo-regular-title2-weight)',
    letterSpacing: 'var(--fx-typo-regular-title2-spacing)',
  },
  'regular-title1': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-title1-size)',
    lineHeight: 'var(--fx-typo-regular-title1-line)',
    fontWeight: 'var(--fx-typo-regular-title1-weight)',
    letterSpacing: 'var(--fx-typo-regular-title1-spacing)',
  },
  'regular-large-title': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-regular-large-title-size)',
    lineHeight: 'var(--fx-typo-regular-large-title-line)',
    fontWeight: 'var(--fx-typo-regular-large-title-weight)',
    letterSpacing: 'var(--fx-typo-regular-large-title-spacing)',
  },
  'medium-caption2': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-caption2-size)',
    lineHeight: 'var(--fx-typo-medium-caption2-line)',
    fontWeight: 'var(--fx-typo-medium-caption2-weight)',
    letterSpacing: 'var(--fx-typo-medium-caption2-spacing)',
  },
  'medium-caption1': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-caption1-size)',
    lineHeight: 'var(--fx-typo-medium-caption1-line)',
    fontWeight: 'var(--fx-typo-medium-caption1-weight)',
    letterSpacing: 'var(--fx-typo-medium-caption1-spacing)',
  },
  'medium-small-body': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-small-body-size)',
    lineHeight: 'var(--fx-typo-medium-small-body-line)',
    fontWeight: 'var(--fx-typo-medium-small-body-weight)',
    letterSpacing: 'var(--fx-typo-medium-small-body-spacing)',
  },
  'medium-body': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-body-size)',
    lineHeight: 'var(--fx-typo-medium-body-line)',
    fontWeight: 'var(--fx-typo-medium-body-weight)',
    letterSpacing: 'var(--fx-typo-medium-body-spacing)',
  },
  'medium-body-condensed': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-body-condensed-size)',
    lineHeight: 'var(--fx-typo-medium-body-condensed-line)',
    fontWeight: 'var(--fx-typo-medium-body-condensed-weight)',
    letterSpacing: 'var(--fx-typo-medium-body-condensed-spacing)',
  },
  'medium-headline2': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-headline2-size)',
    lineHeight: 'var(--fx-typo-medium-headline2-line)',
    fontWeight: 'var(--fx-typo-medium-headline2-weight)',
    letterSpacing: 'var(--fx-typo-medium-headline2-spacing)',
  },
  'medium-headline1': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-headline1-size)',
    lineHeight: 'var(--fx-typo-medium-headline1-line)',
    fontWeight: 'var(--fx-typo-medium-headline1-weight)',
    letterSpacing: 'var(--fx-typo-medium-headline1-spacing)',
  },
  'medium-title4': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-title4-size)',
    lineHeight: 'var(--fx-typo-medium-title4-line)',
    fontWeight: 'var(--fx-typo-medium-title4-weight)',
    letterSpacing: 'var(--fx-typo-medium-title4-spacing)',
  },
  'medium-title3': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-title3-size)',
    lineHeight: 'var(--fx-typo-medium-title3-line)',
    fontWeight: 'var(--fx-typo-medium-title3-weight)',
    letterSpacing: 'var(--fx-typo-medium-title3-spacing)',
  },
  'medium-title3-condensed': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-title3-condensed-size)',
    lineHeight: 'var(--fx-typo-medium-title3-condensed-line)',
    fontWeight: 'var(--fx-typo-medium-title3-condensed-weight)',
    letterSpacing: 'var(--fx-typo-medium-title3-condensed-spacing)',
  },
  'medium-title2': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-title2-size)',
    lineHeight: 'var(--fx-typo-medium-title2-line)',
    fontWeight: 'var(--fx-typo-medium-title2-weight)',
    letterSpacing: 'var(--fx-typo-medium-title2-spacing)',
  },
  'medium-title1': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-title1-size)',
    lineHeight: 'var(--fx-typo-medium-title1-line)',
    fontWeight: 'var(--fx-typo-medium-title1-weight)',
    letterSpacing: 'var(--fx-typo-medium-title1-spacing)',
  },
  'medium-large-title': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-medium-large-title-size)',
    lineHeight: 'var(--fx-typo-medium-large-title-line)',
    fontWeight: 'var(--fx-typo-medium-large-title-weight)',
    letterSpacing: 'var(--fx-typo-medium-large-title-spacing)',
  },
  'bold-title2': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-bold-title2-size)',
    lineHeight: 'var(--fx-typo-bold-title2-line)',
    fontWeight: 'var(--fx-typo-bold-title2-weight)',
    letterSpacing: 'var(--fx-typo-bold-title2-spacing)',
  },
  'bold-title1': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-bold-title1-size)',
    lineHeight: 'var(--fx-typo-bold-title1-line)',
    fontWeight: 'var(--fx-typo-bold-title1-weight)',
    letterSpacing: 'var(--fx-typo-bold-title1-spacing)',
  },
  'bold-large-title': {
    fontFamily: 'var(--fx-font-sans)',
    fontSize: 'var(--fx-typo-bold-large-title-size)',
    lineHeight: 'var(--fx-typo-bold-large-title-line)',
    fontWeight: 'var(--fx-typo-bold-large-title-weight)',
    letterSpacing: 'var(--fx-typo-bold-large-title-spacing)',
  },
  'display-small': {
    fontFamily: 'var(--fx-font-display)',
    fontSize: 'var(--fx-typo-display-small-size)',
    lineHeight: 'var(--fx-typo-display-small-line)',
    fontWeight: 'var(--fx-typo-display-small-weight)',
    letterSpacing: 'var(--fx-typo-display-small-spacing)',
  },
  'display-medium': {
    fontFamily: 'var(--fx-font-display)',
    fontSize: 'var(--fx-typo-display-medium-size)',
    lineHeight: 'var(--fx-typo-display-medium-line)',
    fontWeight: 'var(--fx-typo-display-medium-weight)',
    letterSpacing: 'var(--fx-typo-display-medium-spacing)',
  },
  'display-large': {
    fontFamily: 'var(--fx-font-display)',
    fontSize: 'var(--fx-typo-display-large-size)',
    lineHeight: 'var(--fx-typo-display-large-line)',
    fontWeight: 'var(--fx-typo-display-large-weight)',
    letterSpacing: 'var(--fx-typo-display-large-spacing)',
  },
  'display-xlarge': {
    fontFamily: 'var(--fx-font-display)',
    fontSize: 'var(--fx-typo-display-xlarge-size)',
    lineHeight: 'var(--fx-typo-display-xlarge-line)',
    fontWeight: 'var(--fx-typo-display-xlarge-weight)',
    letterSpacing: 'var(--fx-typo-display-xlarge-spacing)',
  },
};

export const Text = ({
  as = 'p',
  children,
  tone = 'primary',
  variant = 'regular-body',
  style,
  ...props
}: TextProps) => {
  const Comp = as;
  return (
    <Comp
      style={{
        margin: 0,
        color: tones[tone],
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </Comp>
  );
};
