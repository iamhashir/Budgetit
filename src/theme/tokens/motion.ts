export const motion = {
  duration: {
    instant: 0,
    fast: 72,
    pressIn: 76,
    dragLift: 90,
    splashExpand: 340,
    splashFade: 390,
  },
  spring: {
    snap: {
      damping: 17,
      stiffness: 210,
      mass: 0.82,
    },
    trail: {
      damping: 22,
      stiffness: 150,
      mass: 0.95,
    },
    pressRelease: {
      damping: 13,
      stiffness: 360,
      mass: 0.48,
    },
  },
  interaction: {
    rapidTapGuardMs: 320,
    dragActivationOffset: 8,
    dragLift: -3,
    dragScaleY: 1.035,
    pressedBubbleScale: 0.91,
    reducedMotionPressedScale: 0.96,
    splashStartScale: 0.18,
    splashEndScale: 1.55,
    splashOpacity: 0.62,
    swipeVelocityReference: 1800,
    swipeVelocityProjection: 0.11,
  },
} as const;

export type MotionTokens = typeof motion;
