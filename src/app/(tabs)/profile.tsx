import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { currentUser } from '@/data/user';
import { colors, reset, useFluidSize } from '@/theme/main';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const nameSize = useFluidSize(32);
  const metaSize = useFluidSize(15);
  const bodySize = useFluidSize(15);
  const sectionSize = useFluidSize(13);

  const top = Platform.OS === 'web' ? 0 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;
  const bottom = Platform.OS === 'web' ? 16 : Math.max(insets.bottom, 8);

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
        <Text style={styles.brand}>roomiez</Text>
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image source={currentUser.image} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(80, 79, 128, 0.15)', 'rgba(80, 79, 128, 0.92)']}
            locations={[0.45, 0.7, 1]}
            style={styles.heroFade}
          />
          <View style={styles.heroCopy}>
            <Text style={[styles.heroName, { fontSize: nameSize }]}>
              {currentUser.name.split(' ')[0]}, {currentUser.age}
            </Text>
            <Text style={[styles.heroMeta, { fontSize: metaSize }]}>{currentUser.gender}</Text>
          </View>
        </View>

        <View style={styles.about}>
          <Text style={[styles.sectionLabel, { fontSize: sectionSize }]}>About me</Text>
          <Text style={[styles.bio, { fontSize: bodySize }]}>{currentUser.description}</Text>
        </View>

        <View style={styles.chips}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{currentUser.stats.matches} matches</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{currentUser.stats.likes} likes</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{currentUser.stats.chats} chats</Text>
          </View>
        </View>

        <Pressable style={styles.editButton} onPress={() => {}}>
          <Text style={styles.editLabel}>Edit profile</Text>
        </Pressable>
      </ScrollView>
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
  },
  brand: {
    ...reset,
    color: colors.blueGrotto,
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
    backgroundColor: colors.blueIris,
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
    backgroundColor: colors.blueIris,
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
    color: colors.ivory,
    fontWeight: '700',
  },
  heroMeta: {
    ...reset,
    color: colors.ivory,
    fontWeight: '600',
    opacity: 0.9,
  },
  about: {
    ...reset,
    gap: 6,
  },
  sectionLabel: {
    ...reset,
    color: colors.blueGrotto,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  bio: {
    ...reset,
    color: colors.blueIris,
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
    backgroundColor: '#D8D4C8',
  },
  chipText: {
    ...reset,
    color: colors.blueIris,
    fontWeight: '600',
    fontSize: 13,
  },
  editButton: {
    ...reset,
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.roseQuartz,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editLabel: {
    ...reset,
    color: colors.ivory,
    fontWeight: '700',
    fontSize: 15,
  },
});
