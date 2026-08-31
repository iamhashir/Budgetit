import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { palette, radii, typography } from '../theme/theme';

const BAR_PADDING = 6;
const DRAG_ACTIVE_OFFSET = 8;
const RAPID_TAP_GUARD_MS = 320;

const SNAP_SPRING = {
  damping: 17,
  stiffness: 210,
  mass: 0.82,
} as const;

const TRAIL_SPRING = {
  damping: 22,
  stiffness: 150,
  mass: 0.95,
} as const;

const PRESS_RELEASE_SPRING = {
  damping: 13,
  stiffness: 360,
  mass: 0.48,
} as const;

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

function getIconName(routeName: string, focused: boolean) {
  switch (routeName) {
    case 'Home':
      return focused
        ? ({ ios: 'house.fill', android: 'home', web: 'home' } as const)
        : ({ ios: 'house', android: 'home', web: 'home' } as const);
    case 'Add':
      return focused
        ? ({ ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' } as const)
        : ({ ios: 'plus.circle', android: 'add_circle', web: 'add_circle' } as const);
    case 'Settings':
      return focused
        ? ({ ios: 'gearshape.fill', android: 'settings', web: 'settings' } as const)
        : ({ ios: 'gearshape', android: 'settings', web: 'settings' } as const);
    default:
      return { ios: 'circle', android: 'circle', web: 'circle' } as const;
  }
}

type NavTabButtonProps = {
  routeName: string;
  isFocused: boolean;
  iconName: ReturnType<typeof getIconName>;
  labelColor: string;
  inactiveIconBg: string;
  activeDot: string;
  accessibilityLabel: string;
  reduceMotion: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function NavTabButton({
  routeName,
  isFocused,
  iconName,
  labelColor,
  inactiveIconBg,
  activeDot,
  accessibilityLabel,
  reduceMotion,
  onPress,
  onLongPress,
}: NavTabButtonProps) {
  const pressScale = useSharedValue(1);

  const animatedPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = () => {
    cancelAnimation(pressScale);
    pressScale.value = reduceMotion
      ? 0.96
      : withTiming(0.9, { duration: 72 });
  };

  const handlePressOut = () => {
    cancelAnimation(pressScale);
    pressScale.value = reduceMotion
      ? 1
      : withSpring(1, PRESS_RELEASE_SPRING);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      hitSlop={4}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.tabVisual, animatedPressStyle]}>
        <View
          style={[
            styles.iconPod,
            !isFocused && { backgroundColor: inactiveIconBg },
          ]}
        >
          <SymbolView
            name={iconName}
            size={isFocused ? 25 : 22}
            tintColor={labelColor}
          />
        </View>
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.35}
          style={[styles.label, { color: labelColor }]}
        >
          {routeName}
        </Text>
        {isFocused ? (
          <View
            style={[
              styles.activeDot,
              {
                backgroundColor: activeDot,
                shadowColor: activeDot,
              },
            ]}
          />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

export function GlassTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? palette.dark : palette.light;
  const [reduceMotion, setReduceMotion] = useState(false);
  const lastAcceptedTapRef = useRef<{ index: number; at: number } | null>(null);
  const routeCount = state.routes.length;
  const maxIndex = Math.max(routeCount - 1, 0);
  const bottomInset = Math.max(insets.bottom, 8);

  const itemWidth = useSharedValue(0);
  const activePosition = useSharedValue(state.index);
  const trailPosition = useSharedValue(state.index);
  const dragStartPosition = useSharedValue(state.index);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const liftY = useSharedValue(0);
  const tilt = useSharedValue(0);
  const reducedMotionShared = useSharedValue(false);

  useEffect(() => {
    const applyReduceMotion = (enabled: boolean) => {
      setReduceMotion(enabled);
      reducedMotionShared.value = enabled;
    };

    void AccessibilityInfo.isReduceMotionEnabled().then(applyReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      applyReduceMotion,
    );

    return () => subscription.remove();
  }, [reducedMotionShared]);

  useEffect(() => {
    lastAcceptedTapRef.current = null;

    cancelAnimation(activePosition);
    cancelAnimation(trailPosition);
    cancelAnimation(scaleX);
    cancelAnimation(scaleY);
    cancelAnimation(liftY);
    cancelAnimation(tilt);

    if (reduceMotion) {
      activePosition.value = state.index;
      trailPosition.value = state.index;
      scaleX.value = 1;
      scaleY.value = 1;
      liftY.value = 0;
      tilt.value = 0;
      return;
    }

    activePosition.value = withSpring(state.index, SNAP_SPRING);
    trailPosition.value = withSpring(state.index, TRAIL_SPRING);
    scaleX.value = withSpring(1, SNAP_SPRING);
    scaleY.value = withSpring(1, SNAP_SPRING);
    liftY.value = withSpring(0, SNAP_SPRING);
    tilt.value = withSpring(0, SNAP_SPRING);
  }, [
    activePosition,
    liftY,
    reduceMotion,
    scaleX,
    scaleY,
    state.index,
    tilt,
    trailPosition,
  ]);

  const snapBubbleToIndex = (index: number) => {
    if (reduceMotion) {
      activePosition.value = index;
      trailPosition.value = index;
      return;
    }

    activePosition.value = withSpring(index, SNAP_SPRING);
    trailPosition.value = withSpring(index, TRAIL_SPRING);
  };

  const selectIndex = (index: number) => {
    const route = state.routes[index];

    if (!route) {
      return;
    }

    const now = Date.now();
    const lastTap = lastAcceptedTapRef.current;

    if (
      lastTap &&
      lastTap.index === index &&
      now - lastTap.at < RAPID_TAP_GUARD_MS
    ) {
      return;
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented && index !== state.index) {
      lastAcceptedTapRef.current = { index, at: now };
      snapBubbleToIndex(index);
      void Haptics.selectionAsync();
      navigation.navigate(route.name, route.params);
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const availableWidth = Math.max(
      event.nativeEvent.layout.width - BAR_PADDING * 2,
      0,
    );
    itemWidth.value = routeCount > 0 ? availableWidth / routeCount : 0;
  };

  const bubbleAnimatedStyle = useAnimatedStyle(() => ({
    width: itemWidth.value,
    transform: [
      { translateX: activePosition.value * itemWidth.value },
      { translateY: liftY.value },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
      { rotateZ: `${tilt.value}deg` },
    ],
  }));

  const trailAnimatedStyle = useAnimatedStyle(() => {
    const separation = Math.abs(activePosition.value - trailPosition.value);

    return {
      left: BAR_PADDING + itemWidth.value * 0.13,
      width: itemWidth.value * 0.74,
      opacity: itemWidth.value > 0 ? 0.86 : 0,
      transform: [
        { translateX: trailPosition.value * itemWidth.value },
        { scaleX: 1 + Math.min(separation * 0.9, 0.32) },
      ],
    };
  });

  const bubbleGlowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tilt.value * 1.8 },
      { translateY: -liftY.value * 0.7 },
      { scale: 1 + Math.abs(scaleX.value - 1) * 2.2 },
    ],
  }));

  const panGesture = Gesture.Pan()
    .activeOffsetX([-DRAG_ACTIVE_OFFSET, DRAG_ACTIVE_OFFSET])
    .onStart(() => {
      dragStartPosition.value = activePosition.value;
      cancelAnimation(activePosition);
      cancelAnimation(trailPosition);

      if (!reducedMotionShared.value) {
        liftY.value = withTiming(-3, { duration: 90 });
        scaleY.value = withTiming(1.035, { duration: 90 });
      }
    })
    .onUpdate((event) => {
      const width = itemWidth.value;

      if (width <= 0) {
        return;
      }

      const nextPosition = clamp(
        dragStartPosition.value + event.translationX / width,
        0,
        maxIndex,
      );
      const velocityStrength = clamp(Math.abs(event.velocityX) / 1800, 0, 1);
      const direction = event.velocityX === 0 ? 0 : event.velocityX > 0 ? 1 : -1;

      activePosition.value = nextPosition;
      trailPosition.value = clamp(
        nextPosition - direction * (0.055 + velocityStrength * 0.1),
        0,
        maxIndex,
      );

      if (!reducedMotionShared.value) {
        scaleX.value = 1 + velocityStrength * 0.12;
        scaleY.value = 1 - velocityStrength * 0.055;
        tilt.value = direction * velocityStrength * 2.4;
      }
    })
    .onEnd((event) => {
      const width = itemWidth.value;

      if (width <= 0) {
        return;
      }

      const velocityProjection = (event.velocityX / width) * 0.11;
      const targetIndex = Math.round(
        clamp(activePosition.value + velocityProjection, 0, maxIndex),
      );

      if (reducedMotionShared.value) {
        activePosition.value = targetIndex;
        trailPosition.value = targetIndex;
        scaleX.value = 1;
        scaleY.value = 1;
        liftY.value = 0;
        tilt.value = 0;
      } else {
        activePosition.value = withSpring(targetIndex, SNAP_SPRING);
        trailPosition.value = withSpring(targetIndex, TRAIL_SPRING);
        scaleX.value = withSpring(1, SNAP_SPRING);
        scaleY.value = withSpring(1, SNAP_SPRING);
        liftY.value = withSpring(0, SNAP_SPRING);
        tilt.value = withSpring(0, SNAP_SPRING);
      }

      scheduleOnRN(selectIndex, targetIndex);
    })
    .onFinalize(() => {
      if (!reducedMotionShared.value) {
        scaleX.value = withSpring(1, SNAP_SPRING);
        scaleY.value = withSpring(1, SNAP_SPRING);
        liftY.value = withSpring(0, SNAP_SPRING);
        tilt.value = withSpring(0, SNAP_SPRING);
      }
    });

  return (
    <View
      pointerEvents="box-none"
      style={[styles.root, { paddingBottom: bottomInset }]}
    >
      <View style={[styles.shadowWrap, { shadowColor: colors.navShadow }]}>
        <LinearGradient
          colors={colors.navRimGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rim}
        >
          <GestureDetector gesture={panGesture}>
            <View style={styles.innerClip} onLayout={handleLayout}>
              <LinearGradient
                colors={colors.navInnerGradient}
                start={{ x: 0.05, y: 0 }}
                end={{ x: 0.95, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              <View
                pointerEvents="none"
                style={[styles.topGlassLine, { backgroundColor: colors.bubbleHighlight }]}
              />
              <View
                pointerEvents="none"
                style={[styles.leftGlassOrb, { backgroundColor: colors.glowPurple }]}
              />
              <View
                pointerEvents="none"
                style={[styles.rightGlassOrb, { backgroundColor: colors.glowPink }]}
              />

              <Animated.View
                pointerEvents="none"
                style={[styles.trail, trailAnimatedStyle]}
              >
                <LinearGradient
                  colors={colors.trailGradient}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.activeBubbleShadow,
                  { shadowColor: colors.bubbleShadow },
                  bubbleAnimatedStyle,
                ]}
              >
                <LinearGradient
                  colors={colors.bubbleGradient}
                  start={{ x: 0.04, y: 0 }}
                  end={{ x: 0.96, y: 1 }}
                  style={styles.activeBubble}
                >
                  <View
                    style={[
                      styles.bubbleRim,
                      { borderColor: colors.bubbleHighlight },
                    ]}
                  />
                  <View
                    style={[
                      styles.bubbleSpecular,
                      { backgroundColor: colors.bubbleHighlight },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.bubbleGlow,
                      { backgroundColor: colors.glowPink },
                      bubbleGlowAnimatedStyle,
                    ]}
                  />
                </LinearGradient>
              </Animated.View>

              <View style={styles.tabRow}>
                {state.routes.map((route, index) => {
                  const descriptor = descriptors[route.key];

                  if (!descriptor) {
                    return null;
                  }

                  const { options } = descriptor;
                  const isFocused = state.index === index;
                  const iconName = getIconName(route.name, isFocused);
                  const labelColor = isFocused ? colors.activeText : colors.mutedText;

                  const onLongPress = () => {
                    navigation.emit({
                      type: 'tabLongPress',
                      target: route.key,
                    });
                  };

                  return (
                    <NavTabButton
                      key={route.key}
                      routeName={route.name}
                      isFocused={isFocused}
                      iconName={iconName}
                      labelColor={labelColor}
                      inactiveIconBg={colors.inactiveIconBg}
                      activeDot={colors.activeDot}
                      accessibilityLabel={options.tabBarAccessibilityLabel ?? route.name}
                      reduceMotion={reduceMotion}
                      onPress={() => selectIndex(index)}
                      onLongPress={onLongPress}
                    />
                  );
                })}
              </View>
            </View>
          </GestureDetector>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  shadowWrap: {
    borderRadius: 35,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.34,
    shadowRadius: 28,
    elevation: 18,
  },
  rim: {
    height: 88,
    borderRadius: 35,
    padding: 1.5,
  },
  innerClip: {
    flex: 1,
    borderRadius: 33.5,
    overflow: 'hidden',
  },
  topGlassLine: {
    position: 'absolute',
    top: 1,
    left: 26,
    right: 26,
    height: 1,
    opacity: 0.72,
  },
  leftGlassOrb: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: radii.pill,
    left: -42,
    top: -44,
  },
  rightGlassOrb: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: radii.pill,
    right: -38,
    bottom: -48,
  },
  trail: {
    position: 'absolute',
    top: 18,
    height: 50,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  activeBubbleShadow: {
    position: 'absolute',
    left: BAR_PADDING,
    top: BAR_PADDING,
    bottom: BAR_PADDING,
    borderRadius: 27,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.44,
    shadowRadius: 15,
    elevation: 11,
  },
  activeBubble: {
    flex: 1,
    borderRadius: 27,
    overflow: 'hidden',
  },
  bubbleRim: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderRadius: 27,
  },
  bubbleSpecular: {
    position: 'absolute',
    top: 7,
    left: 17,
    width: 34,
    height: 10,
    borderRadius: radii.pill,
    opacity: 0.5,
    transform: [{ rotate: '-8deg' }],
  },
  bubbleGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    right: -25,
    bottom: -32,
    opacity: 0.82,
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: BAR_PADDING,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 72,
    borderRadius: 27,
  },
  tabVisual: {
    flex: 1,
    width: '100%',
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 5,
  },
  iconPod: {
    width: 33,
    height: 33,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.tabLabel,
    textAlign: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 3,
  },
});
