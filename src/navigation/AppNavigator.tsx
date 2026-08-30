import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AddScreen } from '../screens/AddScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { GlassTabBar } from './GlassTabBar';

export type RootTabParamList = {
  Home: undefined;
  Add: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarAccessibilityLabel: 'Home' }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{ tabBarAccessibilityLabel: 'Add' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarAccessibilityLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
