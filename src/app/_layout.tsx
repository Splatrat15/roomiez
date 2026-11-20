import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { colors, layout, reset } from '@/theme/main';

export default function RootLayout() {
  return (
    <View style={styles.backdrop}>
      <StatusBar style="dark" />
      <View style={styles.frame}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.ivory },
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...reset,
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.blueIris,
  },
  frame: {
    ...reset,
    flex: 1,
    width: '100%',
    maxWidth: layout.frameMaxWidth,
    backgroundColor: colors.ivory,
  },
});
