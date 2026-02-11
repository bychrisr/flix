/**
 * Netflix Design System - Typography Tokens
 * Font: Netflix Sans (UI), Bebas Neue (Logo/Large Headings)
 */

export const typography = {
  // Font Families
  families: {
    sans: ['Netflix Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
    display: ['Bebas Neue', 'Arial Black', 'sans-serif'],
  },

  // Font Weights
  weights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },

  // Type Scale - Netflix Sans Regular
  scale: {
    caption2: {
      fontSize: '11px',
      lineHeight: '1.3',
      fontWeight: '400',
      letterSpacing: '0',
    },
    caption1: {
      fontSize: '13px',
      lineHeight: '1.3',
      fontWeight: '400',
      letterSpacing: '0.25px',
    },
    smallBody: {
      fontSize: '14px',
      lineHeight: '1.4',
      fontWeight: '400',
      letterSpacing: '-0.25px',
    },
    smallBodyNormal: {
      fontSize: '14px',
      lineHeight: '1.4',
      fontWeight: '400',
      letterSpacing: '0',
    },
    body: {
      fontSize: '16px',
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0',
    },
    headline2: {
      fontSize: '17px',
      lineHeight: '1.3',
      fontWeight: '400',
      letterSpacing: '0',
    },
    headline1: {
      fontSize: '18px',
      lineHeight: '1.3',
      fontWeight: '400',
      letterSpacing: '0',
    },
    title4: {
      fontSize: '20px',
      lineHeight: '1.3',
      fontWeight: '400',
      letterSpacing: '0',
    },
    title3: {
      fontSize: '21px',
      lineHeight: '1.3',
      fontWeight: '400',
      letterSpacing: '0',
    },
    title2: {
      fontSize: '24px',
      lineHeight: '1.2',
      fontWeight: '400',
      letterSpacing: '0',
    },
    title1: {
      fontSize: '27px',
      lineHeight: '1.2',
      fontWeight: '400',
      letterSpacing: '0',
    },
    largeTitle: {
      fontSize: '50px',
      lineHeight: '1.1',
      fontWeight: '400',
      letterSpacing: '0',
    },
  },

  // Medium Weight Variants
  medium: {
    caption2: {
      fontSize: '12px',
      lineHeight: '1.3',
      fontWeight: '500',
      letterSpacing: '0',
    },
    caption1: {
      fontSize: '13px',
      lineHeight: '1.3',
      fontWeight: '500',
      letterSpacing: '0',
    },
    smallBody: {
      fontSize: '14px',
      lineHeight: '1.4',
      fontWeight: '500',
      letterSpacing: '0',
    },
    body: {
      fontSize: '16px',
      lineHeight: '1.5',
      fontWeight: '500',
      letterSpacing: '0',
    },
    bodyCondensed: {
      fontSize: '16px',
      lineHeight: '1.5',
      fontWeight: '500',
      letterSpacing: '-0.5px',
    },
    headline2: {
      fontSize: '20px',
      lineHeight: '1.3',
      fontWeight: '500',
      letterSpacing: '0',
    },
    headline1: {
      fontSize: '21px',
      lineHeight: '1.3',
      fontWeight: '500',
      letterSpacing: '0',
    },
    title4: {
      fontSize: '22px',
      lineHeight: '1.3',
      fontWeight: '500',
      letterSpacing: '0',
    },
    title3: {
      fontSize: '24px',
      lineHeight: '1.3',
      fontWeight: '500',
      letterSpacing: '0',
    },
    title3Condensed: {
      fontSize: '24px',
      lineHeight: '1.3',
      fontWeight: '500',
      letterSpacing: '-0.5px',
    },
    title2: {
      fontSize: '28px',
      lineHeight: '1.2',
      fontWeight: '500',
      letterSpacing: '0',
    },
    title1: {
      fontSize: '30px',
      lineHeight: '1.2',
      fontWeight: '500',
      letterSpacing: '0',
    },
    largeTitle: {
      fontSize: '33px',
      lineHeight: '1.1',
      fontWeight: '500',
      letterSpacing: '0',
    },
  },

  // Bold Weight Variants
  bold: {
    title2: {
      fontSize: '20px',
      lineHeight: '1.3',
      fontWeight: '700',
      letterSpacing: '0',
    },
    title1: {
      fontSize: '48px',
      lineHeight: '1.1',
      fontWeight: '700',
      letterSpacing: '0',
    },
    largeTitle: {
      fontSize: '55px',
      lineHeight: '1.0',
      fontWeight: '700',
      letterSpacing: '0',
    },
  },

  // Bebas Neue Display Styles (for logos and hero text)
  display: {
    small: {
      fontFamily: 'Bebas Neue',
      fontSize: '24px',
      lineHeight: '1.0',
      fontWeight: '400',
      letterSpacing: '0.5px',
    },
    medium: {
      fontFamily: 'Bebas Neue',
      fontSize: '36px',
      lineHeight: '1.0',
      fontWeight: '400',
      letterSpacing: '0.5px',
    },
    large: {
      fontFamily: 'Bebas Neue',
      fontSize: '48px',
      lineHeight: '1.0',
      fontWeight: '400',
      letterSpacing: '0.5px',
    },
    xlarge: {
      fontFamily: 'Bebas Neue',
      fontSize: '64px',
      lineHeight: '1.0',
      fontWeight: '400',
      letterSpacing: '0.5px',
    },
  },
} as const;

export type TypographyScale = keyof typeof typography.scale;
export type TypographyMedium = keyof typeof typography.medium;
export type TypographyBold = keyof typeof typography.bold;
export type TypographyDisplay = keyof typeof typography.display;
