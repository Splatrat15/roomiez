import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { currentUser } from '@/data/user';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const nameSize = useFluidSize(32);
  const metaSize = useFluidSize(15);
  const bodySize = useFluidSize(15);
  const sectionSize = useFluidSize(13);

  const top = Platform.OS === 'web' ? 0 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;
  const bottom = Platform.OS === 'web' ? 16 : Math.max(insets.bottom, 8);

  const overlayText = isDark ? '#E4E3D0' : colors.ivory;

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
      <View style={styles.topBar}>
        <Text style={[styles.brand, { color: colors.blueGrotto }]}>roomiez</Text>
        <Pressable
          onPress={() => router.push('/settings')}
          style={[styles.settingsButton, { backgroundColor: colors.blueIris }]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Ionicons name="settings-outline" size={22} color={colors.ivory} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: colors.blueIris }]}>
          <Image source={currentUser.image} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(80, 79, 128, 0.15)', colors.gradientEnd]}
            locations={[0.45, 0.7, 1]}
            style={styles.heroFade}
          />
          <View style={styles.heroCopy}>
            <Text style={[styles.heroName, { fontSize: nameSize, color: overlayText }]}>
              {currentUser.name.split(' ')[0]}, {currentUser.age}
            </Text>
            <Text style={[styles.heroMeta, { fontSize: metaSize, color: overlayText }]}>
              {currentUser.gender}
            </Text>
          </View>
        </View>

        <View style={styles.about}>
          <Text style={[styles.sectionLabel, { fontSize: sectionSize, color: colors.blueGrotto }]}>
            About me
          </Text>
          <Text style={[styles.bio, { fontSize: bodySize, color: colors.blueIris }]}>
            {currentUser.description}
          </Text>
        </View>

        <View style={styles.chips}>
          <View style={[styles.chip, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chipText, { color: colors.blueIris }]}>
              {currentUser.stats.matches} matches
            </Text>
          </View>
          <View style={[styles.chip, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chipText, { color: colors.blueIris }]}>
              {currentUser.stats.likes} likes
            </Text>
          </View>
          <View style={[styles.chip, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chipText, { color: colors.blueIris }]}>
              {currentUser.stats.chats} chats
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.editButton, { backgroundColor: colors.roseQuartz }]}
          onPress={() => {}}
        >
          <Text style={[styles.editLabel, { color: isDark ? '#14141C' : colors.ivory }]}>
            Edit profile
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...reset,
    flex: 1,
  },
  topBar: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  brand: {
    ...reset,
    fontWeight: '700',
    letterSpacing: 2,
    fontSize: 16,
  },
  settingsButton: {
    ...reset,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    ...reset,
    flex: 1,
  },
  content: {
    ...reset,
    paddingHorizontal: 16,
    gap: 14,
  },
  hero: {
    ...reset,
    width: '100%',
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    borderRadius: 18,
  },
  heroImage: {
    ...reset,
    width: '100%',
    height: '100%',
  },
  heroFade: {
    ...StyleSheet.absoluteFill,
  },
  heroCopy: {
    ...reset,
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    gap: 2,
  },
  heroName: {
    ...reset,
    fontWeight: '700',
  },
  heroMeta: {
    ...reset,
    fontWeight: '600',
    opacity: 0.9,
  },
  about: {
    ...reset,
    gap: 6,
  },
  sectionLabel: {
    ...reset,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  bio: {
    ...reset,
    lineHeight: 22,
  },
  chips: {
    ...reset,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    ...reset,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: {
    ...reset,
    fontWeight: '600',
    fontSize: 13,
  },
  editButton: {
    ...reset,
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editLabel: {
    ...reset,
    fontWeight: '700',
    fontSize: 15,
  },
});
