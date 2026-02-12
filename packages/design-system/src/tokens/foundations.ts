export const spacing = {
  scale: {
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
} as const;

export const radius = {
  scale: {
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
} as const;

export const shadows = {
  scale: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    none: 'none',
  },
} as const;

export const motion = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const componentSizes = {
  faq: {
    maxWidth: '1104px',
    itemMinHeight: '84px',
    itemPaddingX: '24px',
    itemGap: '8px',
    icon: '30px',
    answerGap: '24px',
    textSize: '40px',
    textLineHeight: '1.15',
  },
  hero: {
    large: { width: '518px', height: '406px' },
    medium: { width: '518px', height: '360px' },
    small1: { width: '518px', height: '289px' },
    small2: { width: '518px', height: '207px' },
    small3: { width: '340px', height: '136px' },
    mediaHeight: '207px',
    contentPaddingX: '24px',
    actionHeight: '42px',
    control: '36px',
    ratingWidth: '111px',
    ratingHeight: '36px',
  },
  homeHero: {
    height: '810px',
    contentTop: '118px',
    contentLeft: '54px',
    contentMaxWidth: '560px',
    titleSize: '92px',
    titleLineHeight: '0.88',
    descriptionSize: '35px',
    descriptionLineHeight: '1.2',
    descriptionMaxWidth: '640px',
    ratingDockRight: '0px',
    ratingDockBottom: '322px',
    ratingDockHeight: '42px',
  },
  heroMobile: {
    height: '481px',
    contentLeft: '48px',
    contentRight: '48px',
    contentBottom: '64px',
    titleMaxWidth: '420px',
    titleSize: '57px',
    titleLineHeight: '0.9',
    previewTop: '206px',
    previewWidth: '340px',
    previewHeight: '136px',
    closeTop: '17px',
    closeRight: '16px',
    closeSize: '36px',
    muteSize: '40px',
  },
} as const;

export const zIndex = {
  dropdown: 1000,
  modal: 1100,
  toast: 1200,
  tooltip: 1300,
  player: 900,
} as const;
