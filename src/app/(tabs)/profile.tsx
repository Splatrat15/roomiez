import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUser } from '@/data/UserProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize, type ThemeColors } from '@/theme/main';

type TileProps = {
  label: string;
  value: string;
  colors: ThemeColors;
  wide?: boolean;
};

function ProfileSection({
  title,
  colors,
  children,
  accent,
  onEdit,
}: {
  title: string;
  colors: ThemeColors;
  children: ReactNode;
  accent?: string;
  onEdit?: () => void;
}) {
  const labelColor = accent ?? colors.blueGrotto;

  return (
    <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionLabel, { color: labelColor }]}>{title}</Text>
        {onEdit ? (
          <Pressable onPress={onEdit} hitSlop={10} accessibilityLabel={`Edit ${title}`}>
            <Ionicons name="pencil" size={16} color={labelColor} />
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function ProfileTile({ label, value, colors, wide }: TileProps) {
  if (!value) {
    return null;
  }

  return (
    <View
      style={[
        styles.tile,
        wide ? styles.tileWide : styles.tileHalf,
        { backgroundColor: colors.ivory },
      ]}
    >
      <Text style={[styles.tileLabel, { color: colors.blueGrotto }]}>{label}</Text>
      <Text style={[styles.tileValue, { color: colors.blueIris }]}>{value}</Text>
    </View>
  );
}

function ChipRow({
  items,
  colors,
  filled,
}: {
  items: string[];
  colors: ThemeColors;
  filled?: boolean;
}) {
  const filledText = filled ? colors.ivory : colors.blueIris;

  return (
    <View style={styles.chips}>
      {items.map((item) => (
        <View
          key={item}
          style={[styles.chip, { backgroundColor: filled ? colors.blueGrotto : colors.ivory }]}
        >
          <Text style={[styles.chipText, { color: filled ? filledText : colors.blueIris }]}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const nameSize = useFluidSize(32);
  const metaSize = useFluidSize(15);
  const bodySize = useFluidSize(15);

  const top = Platform.OS === 'web' ? 0 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;
  const bottom = Platform.OS === 'web' ? 16 : Math.max(insets.bottom, 8);

  const overlayText = isDark ? '#E4E3D0' : colors.ivory;
  const about = user.about;
  const allergyLine = about.allergies.has
    ? about.allergies.details || 'Yes'
    : 'No allergies listed';
  const openQuiz = () => router.push('/create-account');

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
          <Image source={user.image} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(80, 79, 128, 0.15)', colors.gradientEnd]}
            locations={[0.45, 0.7, 1]}
            style={styles.heroFade}
          />
          <View style={styles.heroCopy}>
            <Text style={[styles.heroName, { fontSize: nameSize, color: overlayText }]}>
              {user.name.split(' ')[0]}, {user.age}
            </Text>
            <Text style={[styles.heroMeta, { fontSize: metaSize, color: overlayText }]}>
              {user.gender}
            </Text>
          </View>
        </View>

        <ProfileSection title="About me" colors={colors} onEdit={openQuiz}>
          <View style={[styles.bioCard, { backgroundColor: colors.ivory }]}>
            <Text style={[styles.tileLabel, { color: colors.blueGrotto }]}>Express yourself</Text>
            <Text style={[styles.bio, { fontSize: bodySize, color: colors.blueIris }]}>
              {about.expressYourself.trim() || user.description}
            </Text>
          </View>
        </ProfileSection>

        <ProfileSection title="Hobbies" colors={colors} onEdit={openQuiz}>
          <ChipRow items={user.hobbies} colors={colors} />
        </ProfileSection>

        <ProfileSection title="Lifestyle" colors={colors} onEdit={openQuiz}>
          <View style={styles.tileGrid}>
            <ProfileTile
              label="Cleanliness"
              value={`${about.cleanliness} / 5`}
              colors={colors}
            />
            <ProfileTile label="Looking for" value={about.roommateCloseness} colors={colors} />
            <ProfileTile label="Schedule" value={about.schedule} colors={colors} />
            <ProfileTile label="Past midnight" value={about.pastMidnight} colors={colors} />
            <ProfileTile label="Study vibe" value={about.quietStudy} colors={colors} wide />
            <ProfileTile label="Guests" value={about.guests} colors={colors} wide />
            <ProfileTile
              label="Affection in shared spaces"
              value={about.affection}
              colors={colors}
              wide
            />
            <ProfileTile label="Animals" value={about.animals} colors={colors} wide />
            <ProfileTile label="Sleep" value={about.sleepNeeds} colors={colors} wide />
            <ProfileTile
              label="Medical"
              value={about.medicalConditions || 'None listed'}
              colors={colors}
            />
            <ProfileTile label="Allergies" value={allergyLine} colors={colors} />
          </View>
        </ProfileSection>

        <ProfileSection title="Looking for in a roommate" colors={colors} onEdit={openQuiz}>
          <ChipRow items={user.roommateLikes} colors={colors} filled />
        </ProfileSection>

        <ProfileSection
          title="Private dislikes (only you)"
          colors={colors}
          accent={colors.roseQuartz}
          onEdit={openQuiz}
        >
          <ChipRow items={user.roommateDislikes} colors={colors} />
        </ProfileSection>
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
    gap: 12,
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
  sectionCard: {
    ...reset,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  sectionHeader: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionLabel: {
    ...reset,
    flex: 1,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  bioCard: {
    ...reset,
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  bio: {
    ...reset,
    lineHeight: 22,
  },
  tileGrid: {
    ...reset,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    ...reset,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  tileHalf: {
    width: '48.5%',
    flexGrow: 1,
  },
  tileWide: {
    width: '100%',
  },
  tileLabel: {
    ...reset,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tileValue: {
    ...reset,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
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
  });
