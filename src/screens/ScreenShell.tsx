import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, radii, spacing, typography } from '../theme/theme';

type ScreenShellProps = PropsWithChildren<{
  title: string;
}>;

export function ScreenShell({ title, children }: ScreenShellProps) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? palette.dark : palette.light;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={colors.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View
          style={[
            styles.glow,
            styles.purpleGlow,
            { backgroundColor: colors.glowPurple },
          ]}
        />
        <View
          style={[
            styles.glow,
            styles.pinkGlow,
            { backgroundColor: colors.glowPink },
          ]}
        />
      </View>

      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <View style={styles.content}>
          <View style={[styles.headerShadow, { shadowColor: colors.navShadow }]}>
            <LinearGradient
              colors={colors.navRimGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerRim}
            >
              <View
                style={[
                  styles.headerInner,
                  { backgroundColor: colors.surfaceGlass },
                ]}
              >
                <LinearGradient
                  colors={colors.navInnerGradient}
                  start={{ x: 0.04, y: 0 }}
                  end={{ x: 0.96, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />

                <View
                  pointerEvents="none"
                  style={[
                    styles.headerPurpleOrb,
                    { backgroundColor: colors.glowPurple },
                  ]}
                />
                <View
                  pointerEvents="none"
                  style={[
                    styles.headerPinkOrb,
                    { backgroundColor: colors.glowPink },
                  ]}
                />
                <View
                  pointerEvents="none"
                  style={[
                    styles.headerShine,
                    { backgroundColor: colors.bubbleHighlight },
                  ]}
                />

                <Text
                  accessibilityRole="header"
                  style={[
                    styles.title,
                    {
                      color: colors.text,
                      textShadowColor: colors.glowPurple,
                    },
                  ]}
                >
                  {title}
                </Text>

                <LinearGradient
                  colors={colors.bubbleGradient}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.headerAccent}
                />
              </View>
            </LinearGradient>
          </View>

          <View style={styles.body}>{children}</View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 124,
  },
  headerShadow: {
    borderRadius: 31,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 10,
  },
  headerRim: {
    minHeight: 98,
    borderRadius: 31,
    padding: 1.4,
  },
  headerInner: {
    flex: 1,
    minHeight: 95,
    borderRadius: 29.6,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.screenTitle,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 18,
  },
  headerAccent: {
    width: 58,
    height: 4,
    borderRadius: radii.pill,
    marginTop: 10,
  },
  headerPurpleOrb: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: radii.pill,
    right: -42,
    top: -64,
  },
  headerPinkOrb: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: radii.pill,
    right: 28,
    bottom: -78,
  },
  headerShine: {
    position: 'absolute',
    height: 1,
    top: 2,
    left: 28,
    right: 28,
    opacity: 0.76,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg,
  },
  glow: {
    position: 'absolute',
    borderRadius: radii.pill,
  },
  purpleGlow: {
    width: 300,
    height: 300,
    top: 54,
    right: -156,
  },
  pinkGlow: {
    width: 320,
    height: 320,
    bottom: 76,
    left: -190,
  },
});
