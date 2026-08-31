import { accessibility, borderWidths, radii, spacing } from './primitives';

export const components = {
  screen: {
    horizontalPadding: spacing.md,
    topPadding: 14,
    bottomContentInset: 124,
    bodyHorizontalPadding: spacing.sm,
    bodyTopPadding: spacing.lg,
    ambientGlow: {
      purple: {
        size: 300,
        top: 54,
        right: -156,
      },
      pink: {
        size: 320,
        bottom: 76,
        left: -190,
      },
    },
  },
  header: {
    radius: 31,
    innerRadius: 29.6,
    minimumHeight: 98,
    innerMinimumHeight: 95,
    rimWidth: borderWidths.thin,
    horizontalPadding: spacing.lg,
    verticalPadding: spacing.md,
    accentWidth: 58,
    accentHeight: spacing.xs,
    accentTopSpacing: 10,
    shineInset: 28,
    shineTop: 2,
    shineHeight: borderWidths.hairline,
    shadow: {
      y: 12,
      opacity: 0.24,
      radius: 24,
      elevation: 10,
    },
    purpleOrb: {
      size: 128,
      right: -42,
      top: -64,
    },
    pinkOrb: {
      size: 108,
      right: 28,
      bottom: -78,
    },
  },
  navigation: {
    root: {
      horizontalInset: spacing.md,
      topPadding: 10,
      minimumBottomInset: spacing.sm,
    },
    bar: {
      height: 88,
      radius: 35,
      innerRadius: 33.5,
      rimWidth: borderWidths.medium,
      contentPadding: 6,
      topShineInset: 26,
      topShineHeight: borderWidths.hairline,
      shadow: {
        y: 15,
        opacity: 0.34,
        radius: 28,
        elevation: 18,
      },
    },
    bubble: {
      radius: 27,
      shadowY: 7,
      shadowOpacity: 0.44,
      shadowRadius: 15,
      elevation: 11,
      specular: {
        top: 7,
        left: 17,
        width: 34,
        height: 10,
        rotation: '-8deg' as const,
        opacity: 0.5,
      },
      glow: {
        size: 72,
        right: -25,
        bottom: -32,
        opacity: 0.82,
      },
      splash: {
        fillSize: 82,
        fillTop: -2,
        ringSize: 72,
        ringTop: 3,
        ringWidth: borderWidths.medium,
      },
    },
    trail: {
      top: 18,
      height: 50,
      horizontalRatio: 0.13,
      widthRatio: 0.74,
      opacity: 0.86,
    },
    tab: {
      minimumHeight: 72,
      horizontalPadding: 5,
      gap: spacing.xxs,
      hitSlop: spacing.xs,
      iconSlot: 33,
      iconActiveSize: 26,
      iconInactiveSize: 23,
      activeDotSize: spacing.xs,
      activeDotTopSpacing: 1,
      minimumTouchTarget: accessibility.comfortableTouchTarget,
    },
    ambientOrb: {
      left: {
        size: 112,
        left: -42,
        top: -44,
      },
      right: {
        size: 104,
        right: -38,
        bottom: -48,
      },
    },
  },
} as const;

export type ComponentTokens = typeof components;
