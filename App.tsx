import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { ConvexClientProvider } from './src/convex/ConvexClientProvider';
import {
  budgetDarkTheme,
  budgetLightTheme,
  useDesignSystem,
} from './src/theme';

export default function App() {
  const designSystem = useDesignSystem();
  const isDark = designSystem.mode === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ConvexClientProvider>
          <NavigationContainer theme={isDark ? budgetDarkTheme : budgetLightTheme}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <AppNavigator />
          </NavigationContainer>
        </ConvexClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
