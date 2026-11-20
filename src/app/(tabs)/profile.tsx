import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { currentUser } from '@/data/user';
import { colors, reset, useFluidSize } from '@/theme/main';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const usernameSize = useFluidSize(18);
  const nameSize = useFluidSize(15);
  const statNumberSize = useFluidSize(18);
  const statLabelSize = useFluidSize(12);
  const bioSize = useFluidSize(14);

  const top = Platform.OS === 'web' ? 0 : insets.top;
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
      <View style={styles.topBar}>
        <Text style={[styles.username, { fontSize: usernameSize }]} numberOfLines={1}>
          {currentUser.username}
        </Text>
        <Pressable
          onPress={() => router.push('/settings')}
          style={styles.settingsButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Ionicons name="settings-outline" size={22} color={colors.ivory} />
        </Pressable>
      </View>

      <View style={styles.identityRow}>
        <Image source={currentUser.image} style={styles.avatar} />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { fontSize: statNumberSize }]}>
              {currentUser.stats.matches}
            </Text>
            <Text style={[styles.statLabel, { fontSize: statLabelSize }]}>Matches</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { fontSize: statNumberSize }]}>
              {currentUser.stats.likes}
            </Text>
            <Text style={[styles.statLabel, { fontSize: statLabelSize }]}>Likes</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { fontSize: statNumberSize }]}>
              {currentUser.stats.chats}
            </Text>
            <Text style={[styles.statLabel, { fontSize: statLabelSize }]}>Chats</Text>
          </View>
        </View>
      </View>

      <View style={styles.bioBlock}>
        <Text style={[styles.displayName, { fontSize: nameSize }]}>
          {currentUser.name}, {currentUser.age}
        </Text>
        <Text style={[styles.meta, { fontSize: bioSize }]}>{currentUser.gender}</Text>
        <Text style={[styles.bio, { fontSize: bioSize }]}>{currentUser.description}</Text>
      </View>

      <Pressable style={styles.editButton} onPress={() => {}}>
        <Text style={styles.editLabel}>Edit profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...reset,
    flex: 1,
    backgroundColor: colors.ivory,
  },
  topBar: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 12,
  },
  username: {
    ...reset,
    flex: 1,
    color: colors.blueIris,
    fontWeight: '700',
  },
  settingsButton: {
    ...reset,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueIris,
  },
  identityRow: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 18,
  },
  avatar: {
    ...reset,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.blueIris,
  },
  statsRow: {
    ...reset,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    ...reset,
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    ...reset,
    color: colors.blueIris,
    fontWeight: '700',
  },
  statLabel: {
    ...reset,
    color: colors.blueGrotto,
    fontWeight: '600',
  },
  bioBlock: {
    ...reset,
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 4,
  },
  displayName: {
    ...reset,
    color: colors.blueIris,
    fontWeight: '700',
  },
  meta: {
    ...reset,
    color: colors.blueGrotto,
    fontWeight: '600',
  },
  bio: {
    ...reset,
    marginTop: 4,
    color: colors.blueIris,
    lineHeight: 20,
  },
  editButton: {
    ...reset,
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.blueGrotto,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editLabel: {
    ...reset,
    color: colors.ivory,
    fontWeight: '700',
    fontSize: 14,
  },
});
