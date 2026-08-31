import { useColorScheme } from 'react-native';

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
import { semanticColors, type ColorMode } from './tokens/semantic';

const sharedTokens = {
  primitiveColors,
  spacing,
  radii,
  borderWidths,
  typography,
  accessibility,
  motion,
  components,
} as const;

export const designSystems = {
  light: {
    mode: 'light',
    colors: semanticColors.light,
    ...sharedTokens,
  },
  dark: {
    mode: 'dark',
    colors: semanticColors.dark,
    ...sharedTokens,
  },
} as const;

export type DesignSystem = (typeof designSystems)[ColorMode];

export function getDesignSystem(mode: ColorMode): DesignSystem {
  return designSystems[mode];
}

export function useDesignSystem(): DesignSystem {
  const mode: ColorMode = useColorScheme() === 'dark' ? 'dark' : 'light';
  return getDesignSystem(mode);
}
