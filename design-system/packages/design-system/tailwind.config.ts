/**
 * Netflix Design System - Tailwind CSS Preset
 * Import this preset in your tailwind.config.ts
 */

import type { Config } from 'tailwindcss';

const netflixPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // Netflix Brand Colors
        netflix: {
          red: '#E50914',
          black: '#000000',
          white: '#FFFFFF',
        },
        
        // Primary Colors
        primary: {
          DEFAULT: '#E50914',
          hover: '#C11119',
          active: '#F50723',
        },

        // Secondary Colors  
        secondary: {
          red: {
            100: '#EB3942',
            200: '#C11119',
            300: '#F50723',
          },
          blue: {
            100: '#0071EB',
            200: '#448EF4',
            300: '#54b9c5',
          },
          green: '#46d369',
        },

        // Netflix Gray Scale (complete palette)
        gray: {
          10: '#e5e5e5',
          20: '#dcdcdc',
          25: '#d2d2d2',
          50: '#bcbcbc',
          100: '#b3b3b3',
          150: '#979797',
          200: '#808080',
          250: '#777777',
          300: '#6d6d6e',
          350: '#545454',
          400: '#414141',
          450: '#404040',
          500: '#3a3a3a',
          550: '#363636',
          600: '#333333',
          650: '#2f2f2f',
          700: '#2a2a2a',
          750: '#262626',
          800: '#232323',
          850: '#181818',
          900: '#141414',
        },

        // Transparent variants
        'white-transparent': {
          15: 'rgba(255, 255, 255, 0.15)',
          20: 'rgba(255, 255, 255, 0.20)',
          30: 'rgba(255, 255, 255, 0.30)',
          35: 'rgba(255, 255, 255, 0.35)',
          50: 'rgba(255, 255, 255, 0.50)',
          70: 'rgba(255, 255, 255, 0.70)',
        },
        'black-transparent': {
          30: 'rgba(0, 0, 0, 0.30)',
          60: 'rgba(0, 0, 0, 0.60)',
          90: 'rgba(0, 0, 0, 0.90)',
        },
      },

      fontFamily: {
        sans: ['Netflix Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Bebas Neue', 'Arial Black', 'sans-serif'],
      },

      fontSize: {
        // Caption sizes
        'caption-2': ['11px', { lineHeight: '1.3' }],
        'caption-1': ['13px', { lineHeight: '1.3', letterSpacing: '0.25px' }],
        
        // Body sizes
        'small-body': ['14px', { lineHeight: '1.4', letterSpacing: '-0.25px' }],
        'body': ['16px', { lineHeight: '1.5' }],
        
        // Headline sizes
        'headline-2': ['17px', { lineHeight: '1.3' }],
        'headline-1': ['18px', { lineHeight: '1.3' }],
        
        // Title sizes
        'title-4': ['20px', { lineHeight: '1.3' }],
        'title-3': ['21px', { lineHeight: '1.3' }],
        'title-2': ['24px', { lineHeight: '1.2' }],
        'title-1': ['27px', { lineHeight: '1.2' }],
        'large-title': ['50px', { lineHeight: '1.1' }],
        
        // Display sizes (Bebas Neue)
        'display-sm': ['24px', { lineHeight: '1.0' }],
        'display-md': ['36px', { lineHeight: '1.0' }],
        'display-lg': ['48px', { lineHeight: '1.0' }],
        'display-xl': ['64px', { lineHeight: '1.0' }],
      },

      fontWeight: {
        regular: '400',
        medium: '500',
        bold: '700',
      },

      spacing: {
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
      },

      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
        full: '9999px',
      },

      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        none: 'none',
      },

      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        slower: '500ms',
      },

      transitionTimingFunction: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      zIndex: {
        dropdown: '1000',
        modal: '1100',
        toast: '1200',
        tooltip: '1300',
        player: '900',
      },
    },
  },
};

export default netflixPreset;
