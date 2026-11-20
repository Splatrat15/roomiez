import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { colors, reset } from '@/theme/main';

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
          ...reset,
          backgroundColor: colors.ivory,
          elevation: 0,
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowOffset: { width: 0, height: 0 },
        },
        tabBarLabelStyle: {
          ...reset,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          ...reset,
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
