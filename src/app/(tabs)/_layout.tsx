import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { colors } from '@/theme/main';

function tabIcon(name: keyof typeof Ionicons.glyphMap, color: ColorValue | null, size: number) {
  const iconColor = typeof color === 'string' ? color : colors.blueIris;
  return <Ionicons name={name} color={iconColor} size={size} />;
}

export const unstable_settings = {
  initialRouteName: 'swipe',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blueGrotto,
        tabBarInactiveTintColor: colors.blueIris,
        tabBarStyle: {
          backgroundColor: colors.ivory,
          borderTopWidth: 0,
          borderWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          margin: 0,
        },
        tabBarLabelStyle: {
          margin: 0,
          fontWeight: '600',
        },
        sceneStyle: { backgroundColor: colors.ivory },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="swipe"
        options={{
          title: 'Swipe',
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon('heart', focused ? colors.roseQuartz : color, size),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => tabIcon('chatbubble', color, size),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => tabIcon('person', color, size),
        }}
      />
    </Tabs>
  );
}
