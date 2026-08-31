import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import { designSystems, getDesignSystem, useDesignSystem } from './designSystem';
import { components } from './tokens/components';
import { motion } from './tokens/motion';
import {
  accessibility,
  borderWidths,
  primitiveColors,
  radii,
  spacing,
  typography,
} from './tokens/primitives';
import { semanticColors } from './tokens/semantic';

// Compatibility exports for existing components. New code should prefer
// useDesignSystem() so color mode + tokens come from one typed source.
export const palette = semanticColors;
export {
  accessibility,
  borderWidths,
  components,
  designSystems,
  getDesignSystem,
  motion,
  primitiveColors,
  radii,
  spacing,
  typography,
  useDesignSystem,
};

export const budgetLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: semanticColors.light.primary,
    background: semanticColors.light.background,
    card: semanticColors.light.surface,
    text: semanticColors.light.text,
    border: semanticColors.light.border,
    notification: semanticColors.light.secondary,
  },
};

export const budgetDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: semanticColors.dark.primary,
    background: semanticColors.dark.background,
    card: semanticColors.dark.surface,
    text: semanticColors.dark.text,
    border: semanticColors.dark.border,
    notification: semanticColors.dark.secondary,
  },
};
