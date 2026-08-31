import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
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
        <NavigationContainer theme={isDark ? budgetDarkTheme : budgetLightTheme}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
