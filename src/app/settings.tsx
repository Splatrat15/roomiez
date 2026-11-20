import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, reset, useFluidSize } from '@/theme/main';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const titleSize = useFluidSize(28);
  const rowSize = useFluidSize(16);

  const top = Platform.OS === 'web' ? 12 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: top,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
      </View>

      <Text style={[styles.title, { fontSize: titleSize }]}>Settings</Text>
      <Text style={[styles.hint, { fontSize: rowSize }]}>
        Account and preference options will live here soon.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...reset,
    flex: 1,
    backgroundColor: colors.ivory,
  },
  header: {
    ...reset,
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  back: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 2,
  },
  backLabel: {
    ...reset,
    color: colors.blueGrotto,
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    ...reset,
    color: colors.blueIris,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  hint: {
    ...reset,
    color: colors.blueGrotto,
    paddingHorizontal: 20,
    paddingTop: 10,
    lineHeight: 22,
  },
});
