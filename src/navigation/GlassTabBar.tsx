import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { palette, radii, typography } from '../theme/theme';

const BAR_PADDING = 6;

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

export function GlassTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? palette.dark : palette.light;
  const [barWidth, setBarWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const activePosition = useRef(new Animated.Value(state.index)).current;
  const trailPosition = useRef(new Animated.Value(state.index)).current;
  const bubbleScale = useRef(new Animated.Value(1)).current;
  const bottomInset = Math.max(insets.bottom, 8);
  const itemWidth =
    barWidth > BAR_PADDING * 2
      ? (barWidth - BAR_PADDING * 2) / state.routes.length
      : 0;

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      activePosition.setValue(state.index);
      trailPosition.setValue(state.index);
      bubbleScale.setValue(1);
      return;
    }

    activePosition.stopAnimation();
    trailPosition.stopAnimation();
    bubbleScale.stopAnimation();

    Animated.parallel([
      Animated.spring(activePosition, {
        toValue: state.index,
        tension: 145,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(45),
        Animated.spring(trailPosition, {
          toValue: state.index,
          tension: 82,
          friction: 15,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(bubbleScale, {
          toValue: 0.965,
          duration: 75,
          useNativeDriver: true,
        }),
        Animated.spring(bubbleScale, {
          toValue: 1,
          speed: 22,
          bounciness: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [activePosition, bubbleScale, reduceMotion, state.index, trailPosition]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;

    if (Math.abs(nextWidth - barWidth) > 0.5) {
      setBarWidth(nextWidth);
    }
  };

  const inputRange = state.routes.map((_, index) => index);
  const outputRange = state.routes.map((_, index) => index * itemWidth);
  const activeTranslateX = activePosition.interpolate({ inputRange, outputRange });
  const trailTranslateX = trailPosition.interpolate({ inputRange, outputRange });

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

            {itemWidth > 0 ? (
              <>
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.trail,
                    {
                      left: BAR_PADDING + itemWidth * 0.14,
                      width: itemWidth * 0.72,
                      transform: [{ translateX: trailTranslateX }],
                    },
                  ]}
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
                    {
                      left: BAR_PADDING,
                      width: itemWidth,
                      shadowColor: colors.bubbleShadow,
                      transform: [
                        { translateX: activeTranslateX },
                        { scale: bubbleScale },
                      ],
                    },
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
                    <View
                      style={[
                        styles.bubbleGlow,
                        { backgroundColor: colors.glowPink },
                      ]}
                    />
                  </LinearGradient>
                </Animated.View>
              </>
            ) : null}

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

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    void Haptics.selectionAsync();
                    navigation.navigate(route.name, route.params);
                  }
                };

                const onLongPress = () => {
                  navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                  });
                };

                return (
                  <Pressable
                    key={route.key}
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel ?? route.name}
                    hitSlop={4}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    style={({ pressed }) => [
                      styles.tabButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.iconPod,
                        !isFocused && { backgroundColor: colors.inactiveIconBg },
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
                      {route.name}
                    </Text>
                    {isFocused ? (
                      <View
                        style={[
                          styles.activeDot,
                          {
                            backgroundColor: colors.activeDot,
                            shadowColor: colors.activeDot,
                          },
                        ]}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 5,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.955 }],
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
