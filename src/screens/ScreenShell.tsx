import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  components,
  radii,
  typography,
  useDesignSystem,
} from '../theme';

type ScreenShellProps = PropsWithChildren<{
  title: string;
}>;

export function ScreenShell({ title, children }: ScreenShellProps) {
  const { colors } = useDesignSystem();

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

const screen = components.screen;
const header = components.header;

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
    paddingHorizontal: screen.horizontalPadding,
    paddingTop: screen.topPadding,
    paddingBottom: screen.bottomContentInset,
  },
  headerShadow: {
    borderRadius: header.radius,
    shadowOffset: { width: 0, height: header.shadow.y },
    shadowOpacity: header.shadow.opacity,
    shadowRadius: header.shadow.radius,
    elevation: header.shadow.elevation,
  },
  headerRim: {
    minHeight: header.minimumHeight,
    borderRadius: header.radius,
    padding: header.rimWidth,
  },
  headerInner: {
    flex: 1,
    minHeight: header.innerMinimumHeight,
    borderRadius: header.innerRadius,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: header.horizontalPadding,
    paddingVertical: header.verticalPadding,
  },
  title: {
    ...typography.screenTitle,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 18,
  },
  headerAccent: {
    width: header.accentWidth,
    height: header.accentHeight,
    borderRadius: radii.pill,
    marginTop: header.accentTopSpacing,
  },
  headerPurpleOrb: {
    position: 'absolute',
    width: header.purpleOrb.size,
    height: header.purpleOrb.size,
    borderRadius: radii.pill,
    right: header.purpleOrb.right,
    top: header.purpleOrb.top,
  },
  headerPinkOrb: {
    position: 'absolute',
    width: header.pinkOrb.size,
    height: header.pinkOrb.size,
    borderRadius: radii.pill,
    right: header.pinkOrb.right,
    bottom: header.pinkOrb.bottom,
  },
  headerShine: {
    position: 'absolute',
    height: header.shineHeight,
    top: header.shineTop,
    left: header.shineInset,
    right: header.shineInset,
    opacity: 0.76,
  },
  body: {
    flex: 1,
    paddingHorizontal: screen.bodyHorizontalPadding,
    paddingTop: screen.bodyTopPadding,
  },
  glow: {
    position: 'absolute',
    borderRadius: radii.pill,
  },
  purpleGlow: {
    width: screen.ambientGlow.purple.size,
    height: screen.ambientGlow.purple.size,
    top: screen.ambientGlow.purple.top,
    right: screen.ambientGlow.purple.right,
  },
  pinkGlow: {
    width: screen.ambientGlow.pink.size,
    height: screen.ambientGlow.pink.size,
    bottom: screen.ambientGlow.pink.bottom,
    left: screen.ambientGlow.pink.left,
  },
});
