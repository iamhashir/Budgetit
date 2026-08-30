import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { palette, radii, typography } from '../theme/theme';

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
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.root, { paddingBottom: bottomInset }]}
    >
      <View style={[styles.shadowWrap, { shadowColor: colors.primary }]}>
        <LinearGradient
          colors={[colors.surfaceGlassStrong, colors.surfaceGlass]}
          start={{ x: 0.08, y: 0 }}
          end={{ x: 0.92, y: 1 }}
          style={[styles.bar, { borderColor: colors.glassBorder }]}
        >
          <View
            pointerEvents="none"
            style={[styles.topHighlight, { backgroundColor: colors.bubbleHighlight }]}
          />

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
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={({ pressed }) => [
                  styles.tabButton,
                  pressed && styles.pressed,
                ]}
              >
                {isFocused ? (
                  <LinearGradient
                    colors={colors.bubbleGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.activeBubble}
                  >
                    <View
                      pointerEvents="none"
                      style={[
                        styles.bubbleHighlight,
                        { backgroundColor: colors.bubbleHighlight },
                      ]}
                    />
                    <SymbolView
                      name={iconName}
                      size={22}
                      tintColor={colors.activeText}
                    />
                    <Text
                      numberOfLines={1}
                      maxFontSizeMultiplier={1.35}
                      style={[styles.label, { color: labelColor }]}
                    >
                      {route.name}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveItem}>
                    <SymbolView
                      name={iconName}
                      size={22}
                      tintColor={colors.mutedText}
                    />
                    <Text
                      numberOfLines={1}
                      maxFontSizeMultiplier={1.35}
                      style={[styles.label, { color: labelColor }]}
                    >
                      {route.name}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
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
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  shadowWrap: {
    borderRadius: radii.xl,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 16,
  },
  bar: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 7,
    gap: 5,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    height: 62,
    borderRadius: radii.lg,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  activeBubble: {
    flex: 1,
    minWidth: 0,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    overflow: 'hidden',
    paddingHorizontal: 8,
  },
  bubbleHighlight: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1,
  },
  inactiveItem: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 8,
  },
  label: {
    ...typography.tabLabel,
    textAlign: 'center',
  },
});
