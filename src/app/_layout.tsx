import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { UserProvider } from '@/data/UserProvider';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { layout, reset } from '@/theme/main';

function RootShell() {
  const { colors, isDark } = useTheme();

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={[styles.backdrop, { backgroundColor: colors.blueIris }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={[styles.frame, { backgroundColor: colors.ivory }]}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.ivory },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="roommate/[id]" />
            <Stack.Screen name="message/[id]" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="terms" />
            <Stack.Screen name="create-account" />
          </Stack>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <RootShell />
      </UserProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...reset,
    flex: 1,
    alignItems: 'center',
  },
  frame: {
    ...reset,
    flex: 1,
    width: '100%',
    maxWidth: layout.frameMaxWidth,
  },
});
