import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import {
  Alert,
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

function logout() {
  if (Platform.OS === 'android') {
    BackHandler.exitApp();
    return;
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.close();
    Alert.alert('Logged out', 'You can close this tab to finish signing out.');
    return;
  }

  Alert.alert('Logged out', 'Close the app to finish signing out for now.');
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark, setDarkMode } = useTheme();
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
          backgroundColor: colors.ivory,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
          <Text style={[styles.backLabel, { color: colors.blueGrotto }]}>Back</Text>
        </Pressable>
      </View>

      <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>Settings</Text>

      <View style={styles.section}>
        <View style={[styles.row, styles.rowStatic, { backgroundColor: colors.surface }]}>
          <View style={styles.rowCopy}>
            <Text style={[styles.rowTitle, { fontSize: rowSize, color: colors.blueIris }]}>
              Dark mode
            </Text>
            <Text style={[styles.rowHint, { color: colors.blueGrotto }]}>
              Switch the whole app to a darker look
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={setDarkMode}
            trackColor={{ false: colors.surface, true: colors.blueGrotto }}
            thumbColor={colors.ivory}
          />
        </View>

        <SettingsLink
          label="Retake quiz"
          onPress={() => router.push('/create-account')}
          colors={colors}
          rowSize={rowSize}
        />
        <SettingsLink
          label="Privacy policy"
          onPress={() => router.push('/privacy')}
          colors={colors}
          rowSize={rowSize}
        />
        <SettingsLink
          label="Terms & conditions"
          onPress={() => router.push('/terms')}
          colors={colors}
          rowSize={rowSize}
        />
      </View>

      <Pressable
        style={[styles.logout, { backgroundColor: colors.roseQuartz }]}
        onPress={() => {
          Alert.alert('Log out', 'This will close the app for now.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log out', style: 'destructive', onPress: logout },
          ]);
        }}
      >
        <Text style={[styles.logoutLabel, { color: colors.ivory }]}>Log out</Text>
      </Pressable>
    </View>
  );
}

function SettingsLink({
  label,
  onPress,
  colors,
  rowSize,
}: {
  label: string;
  onPress: () => void;
  colors: { ivory: string; blueIris: string; surface: string };
  rowSize: number;
}) {
  return (
    <Pressable
      style={[styles.row, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <Text style={[styles.rowTitle, { fontSize: rowSize, color: colors.blueIris }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.blueIris} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...reset,
    flex: 1,
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
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    ...reset,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  section: {
    ...reset,
    paddingHorizontal: 16,
    gap: 10,
  },
  row: {
    ...reset,
    minHeight: 56,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowStatic: {
    alignItems: 'center',
  },
  rowCopy: {
    ...reset,
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    ...reset,
    fontWeight: '700',
  },
  rowHint: {
    ...reset,
    fontSize: 12,
    fontWeight: '500',
  },
  logout: {
    ...reset,
    marginTop: 28,
    marginHorizontal: 16,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutLabel: {
    ...reset,
    fontWeight: '700',
    fontSize: 16,
  },
});
