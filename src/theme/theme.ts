import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

export const palette = {
  light: {
    background: '#F8F1FA',
    backgroundGradient: ['#FBF7FD', '#F7ECFA', '#FBEAF4'] as const,
    surface: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.72)',
    surfaceGlassStrong: 'rgba(255, 255, 255, 0.88)',
    text: '#2D1731',
    mutedText: '#715D76',
    primary: '#B34FAF',
    secondary: '#D85C9D',
    primarySoft: '#F1D9F2',
    activeText: '#FFFFFF',
    border: 'rgba(137, 76, 145, 0.20)',
    glassBorder: 'rgba(255, 255, 255, 0.82)',
    glowPurple: 'rgba(152, 71, 177, 0.16)',
    glowPink: 'rgba(230, 87, 157, 0.14)',
    bubbleGradient: ['#9F4CC7', '#D455A0'] as const,
    bubbleHighlight: 'rgba(255, 255, 255, 0.24)',
    navRimGradient: [
      'rgba(255, 255, 255, 0.96)',
      'rgba(183, 88, 195, 0.56)',
      'rgba(225, 91, 157, 0.62)',
      'rgba(255, 255, 255, 0.88)',
    ] as const,
    navInnerGradient: [
      'rgba(255, 255, 255, 0.88)',
      'rgba(252, 243, 255, 0.78)',
      'rgba(255, 240, 248, 0.80)',
    ] as const,
    navShadow: 'rgba(113, 45, 129, 0.34)',
    bubbleShadow: 'rgba(188, 69, 166, 0.48)',
    trailGradient: ['rgba(159, 76, 199, 0.22)', 'rgba(218, 83, 160, 0.06)'] as const,
    inactiveIconBg: 'rgba(139, 73, 149, 0.08)',
    activeDot: '#FFF4FB',
  },
  dark: {
    background: '#1A111C',
    backgroundGradient: ['#171019', '#211225', '#281322'] as const,
    surface: '#281A2A',
    surfaceGlass: 'rgba(47, 27, 51, 0.78)',
    surfaceGlassStrong: 'rgba(61, 33, 65, 0.90)',
    text: '#FFF8FF',
    mutedText: '#D0BCD3',
    primary: '#D66BD0',
    secondary: '#EE72AC',
    primarySoft: '#512C55',
    activeText: '#FFFFFF',
    border: 'rgba(224, 134, 211, 0.18)',
    glassBorder: 'rgba(255, 220, 249, 0.18)',
    glowPurple: 'rgba(159, 73, 196, 0.24)',
    glowPink: 'rgba(230, 77, 150, 0.18)',
    bubbleGradient: ['#A64FD1', '#E15B9F'] as const,
    bubbleHighlight: 'rgba(255, 255, 255, 0.20)',
    navRimGradient: [
      'rgba(255, 224, 253, 0.28)',
      'rgba(174, 78, 205, 0.64)',
      'rgba(232, 89, 163, 0.64)',
      'rgba(255, 221, 248, 0.20)',
    ] as const,
    navInnerGradient: [
      'rgba(54, 31, 59, 0.94)',
      'rgba(43, 24, 49, 0.92)',
      'rgba(51, 24, 45, 0.94)',
    ] as const,
    navShadow: 'rgba(0, 0, 0, 0.52)',
    bubbleShadow: 'rgba(213, 83, 186, 0.52)',
    trailGradient: ['rgba(170, 79, 211, 0.30)', 'rgba(225, 91, 159, 0.08)'] as const,
    inactiveIconBg: 'rgba(255, 220, 250, 0.07)',
    activeDot: '#FFF1FB',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,
} as const;

export const radii = {
  md: 16,
  lg: 24,
  xl: 30,
  pill: 999,
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

export const budgetLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.light.primary,
    background: palette.light.background,
    card: palette.light.surface,
    text: palette.light.text,
    border: palette.light.border,
    notification: palette.light.secondary,
  },
};

export const budgetDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: palette.dark.primary,
    background: palette.dark.background,
    card: palette.dark.surface,
    text: palette.dark.text,
    border: palette.dark.border,
    notification: palette.dark.secondary,
  },
};
