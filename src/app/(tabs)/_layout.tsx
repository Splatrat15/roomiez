import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

function tabIcon(name: keyof typeof Ionicons.glyphMap, color: ColorValue | null, size: number) {
  const iconColor = typeof color === 'string' ? color : '#111';
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
        tabBarActiveTintColor: '#e11d48',
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="swipe"
        options={{
          title: 'Swipe',
          tabBarIcon: ({ color, size }) => tabIcon('heart', color, size),
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
