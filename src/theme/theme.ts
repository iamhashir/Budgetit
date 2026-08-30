import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

export const palette = {
  light: {
    background: '#FFF9FB',
    surface: '#FFFFFF',
    text: '#2D2529',
    mutedText: '#665A60',
    primary: '#7A3655',
    primarySoft: '#F5E6EC',
    border: '#E8D8DF',
  },
  dark: {
    background: '#1C171A',
    surface: '#271F23',
    text: '#FFF7FA',
    mutedText: '#D5C6CC',
    primary: '#F2AFC8',
    primarySoft: '#4B2B38',
    border: '#4A3A41',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radii = {
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  screenTitle: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  tabLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
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
    notification: palette.light.primary,
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
    notification: palette.dark.primary,
  },
};
