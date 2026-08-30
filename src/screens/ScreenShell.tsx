import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, spacing, typography } from '../theme/theme';

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
          {children}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 124,
  },
  title: {
    ...typography.screenTitle,
    marginBottom: spacing.lg,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
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
