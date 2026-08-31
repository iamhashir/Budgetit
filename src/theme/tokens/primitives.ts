export const primitiveColors = {
  transparent: 'transparent',
  white: '#FFFFFF',

  plum50: '#FBF7FD',
  plum100: '#F8F1FA',
  plum150: '#F7ECFA',
  plum200: '#F1D9F2',
  plum500: '#B34FAF',
  plum600: '#9F4CC7',
  plum700: '#715D76',
  plum900: '#2D1731',
  plum950: '#1A111C',

  rose50: '#FFF8FF',
  rose100: '#FFF4FB',
  rose200: '#FFF1FB',
  rose500: '#D85C9D',
  rose550: '#D455A0',
  rose600: '#E15B9F',
  rose650: '#EE72AC',

  darkSurface: '#281A2A',
  darkPrimarySoft: '#512C55',
  darkMutedText: '#D0BCD3',

  lightBackgroundEnd: '#FBEAF4',
  darkBackgroundStart: '#171019',
  darkBackgroundMid: '#211225',
  darkBackgroundEnd: '#281322',

  purpleGlowLight: 'rgba(152, 71, 177, 0.16)',
  pinkGlowLight: 'rgba(230, 87, 157, 0.14)',
  purpleGlowDark: 'rgba(159, 73, 196, 0.24)',
  pinkGlowDark: 'rgba(230, 77, 150, 0.18)',

  glassWhite72: 'rgba(255, 255, 255, 0.72)',
  glassWhite88: 'rgba(255, 255, 255, 0.88)',
  glassWhite96: 'rgba(255, 255, 255, 0.96)',
  glassDark78: 'rgba(47, 27, 51, 0.78)',
  glassDark90: 'rgba(61, 33, 65, 0.90)',
  glassDark92: 'rgba(43, 24, 49, 0.92)',
  glassDark94: 'rgba(54, 31, 59, 0.94)',
  glassDarkRose94: 'rgba(51, 24, 45, 0.94)',

  lightBorder: 'rgba(137, 76, 145, 0.20)',
  lightGlassBorder: 'rgba(255, 255, 255, 0.82)',
  darkBorder: 'rgba(224, 134, 211, 0.18)',
  darkGlassBorder: 'rgba(255, 220, 249, 0.18)',

  lightNavPurple: 'rgba(183, 88, 195, 0.56)',
  lightNavPink: 'rgba(225, 91, 157, 0.62)',
  lightNavInnerPurple: 'rgba(252, 243, 255, 0.78)',
  lightNavInnerPink: 'rgba(255, 240, 248, 0.80)',
  darkNavWhite: 'rgba(255, 224, 253, 0.28)',
  darkNavPurple: 'rgba(174, 78, 205, 0.64)',
  darkNavPink: 'rgba(232, 89, 163, 0.64)',
  darkNavWhiteEnd: 'rgba(255, 221, 248, 0.20)',

  lightNavShadow: 'rgba(113, 45, 129, 0.34)',
  darkNavShadow: 'rgba(0, 0, 0, 0.52)',
  lightBubbleShadow: 'rgba(188, 69, 166, 0.48)',
  darkBubbleShadow: 'rgba(213, 83, 186, 0.52)',
  lightBubbleHighlight: 'rgba(255, 255, 255, 0.24)',
  darkBubbleHighlight: 'rgba(255, 255, 255, 0.20)',

  lightTrailStart: 'rgba(159, 76, 199, 0.22)',
  lightTrailEnd: 'rgba(218, 83, 160, 0.06)',
  darkTrailStart: 'rgba(170, 79, 211, 0.30)',
  darkTrailEnd: 'rgba(225, 91, 159, 0.08)',
} as const;

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 30,
  pill: 999,
} as const;

export const borderWidths = {
  hairline: 1,
  thin: 1.4,
  medium: 1.5,
  strong: 2,
} as const;

export const typography = {
  screenTitle: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800' as const,
    letterSpacing: -0.9,
  },
  tabLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.15,
  },
} as const;

export const accessibility = {
  minimumTouchTarget: 44,
  comfortableTouchTarget: 56,
  maximumTextScale: 1.35,
} as const;

export const primitives = {
  colors: primitiveColors,
  spacing,
  radii,
  borderWidths,
  typography,
  accessibility,
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
export type TypographyToken = keyof typeof typography;
