import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/BrandLogo';
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
  isPrivate,
  showVisibility,
}: {
  items: string[];
  colors: ThemeColors;
  isPrivate?: boolean;
  showVisibility?: boolean;
}) {
  const privateMode = Boolean(isPrivate);

  return (
    <View style={styles.chipBlock}>
      {showVisibility ? (
        <View
          style={[
            styles.visibilityBadge,
            { backgroundColor: privateMode ? colors.roseQuartz : colors.blueGrotto },
          ]}
        >
          <Text style={[styles.visibilityBadgeText, { color: colors.ivory }]}>
            {privateMode ? 'Private · only you' : 'Visible on profile'}
          </Text>
        </View>
      ) : null}
      <View style={styles.chips}>
        {items.map((item) => (
          <View
            key={item}
            style={[
              styles.chip,
              {
                backgroundColor:
                  showVisibility && !privateMode ? colors.blueGrotto : colors.ivory,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color:
                    showVisibility && !privateMode ? colors.ivory : colors.blueIris,
                },
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const nameSize = useFluidSize(32);
  const tagSize = useFluidSize(12);
  const bodySize = useFluidSize(15);
  const settingsIcon = useFluidSize(22);
  const settingsHit = useFluidSize(40);

  const top = Platform.OS === 'web' ? 0 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;
  const bottom = Platform.OS === 'web' ? 16 : Math.max(insets.bottom, 8);

  const overlayText = '#E4E3D0';
  const about = user.about;
  const allergyLine = about.allergies.has
    ? about.allergies.details || 'Yes'
    : 'No allergies listed';
  const oneWord = about.oneWordDescribeMe.trim() || 'Roommate';
  const heroTags = [`${user.age}`, user.gender, oneWord];
  const heroDescription = about.expressYourself.trim() || user.description;
  const openQuiz = (
    section: 'about' | 'education' | 'hobbies' | 'lifestyle' | 'likes' | 'dislikes',
  ) =>
    router.push({
      pathname: '/create-account',
      params: { section },
    });

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
        <BrandLogo height={40} />
        <Pressable
          onPress={() => router.push('/settings')}
          style={[
            styles.settingsButton,
            {
              width: settingsHit,
              height: settingsHit,
              borderRadius: settingsHit / 2,
              backgroundColor: colors.blueIris,
            },
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Ionicons name="settings-outline" size={settingsIcon} color={colors.ivory} />
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
              {user.name.split(' ')[0]}
            </Text>
            <View style={styles.heroTags}>
              {heroTags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.heroTag,
                    {
                      backgroundColor: isDark
                        ? 'rgba(228, 227, 208, 0.18)'
                        : 'rgba(228, 227, 208, 0.22)',
                    },
                  ]}
                >
                  <Text style={[styles.heroTagText, { fontSize: tagSize, color: overlayText }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
            <Text
              style={[styles.heroDescription, { fontSize: bodySize, color: overlayText }]}
              numberOfLines={3}
            >
              {heroDescription}
            </Text>
          </View>
        </View>

        <ProfileSection title="About me" colors={colors} onEdit={() => openQuiz('about')}>
          <View style={[styles.bioCard, { backgroundColor: colors.ivory }]}>
            <Text style={[styles.tileLabel, { color: colors.blueGrotto }]}>Express yourself</Text>
            <Text style={[styles.bio, { fontSize: bodySize, color: colors.blueIris }]}>
              {about.expressYourself.trim() || user.description}
            </Text>
          </View>
        </ProfileSection>

        <ProfileSection title="Education" colors={colors} onEdit={() => openQuiz('education')}>
          <View style={styles.tileGrid}>
            <ProfileTile label="School" value={user.education.school} colors={colors} wide />
            <ProfileTile label="District" value={user.education.district} colors={colors} />
            <ProfileTile label="Building" value={user.education.building} colors={colors} />
            <ProfileTile label="Year" value={user.education.year} colors={colors} />
          </View>
        </ProfileSection>

        <ProfileSection title="Hobbies" colors={colors} onEdit={() => openQuiz('hobbies')}>
          <ChipRow items={user.hobbies} colors={colors} />
        </ProfileSection>

        <ProfileSection title="Lifestyle" colors={colors} onEdit={() => openQuiz('lifestyle')}>
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

        <ProfileSection
          title="Looking for in a roommate"
          colors={colors}
          accent={user.roommateLikesPrivate ? colors.roseQuartz : colors.blueGrotto}
          onEdit={() => openQuiz('likes')}
        >
          <ChipRow
            items={user.roommateLikes}
            colors={colors}
            isPrivate={user.roommateLikesPrivate}
            showVisibility
          />
        </ProfileSection>

        <ProfileSection
          title="Dislikes in a roommate"
          colors={colors}
          accent={user.roommateDislikesPrivate ? colors.roseQuartz : colors.blueGrotto}
          onEdit={() => openQuiz('dislikes')}
        >
          <ChipRow
            items={user.roommateDislikes}
            colors={colors}
            isPrivate={user.roommateDislikesPrivate}
            showVisibility
          />
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
  settingsButton: {
    ...reset,
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
    gap: 10,
  },
  heroName: {
    ...reset,
    fontWeight: '700',
  },
  heroTags: {
    ...reset,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  heroTag: {
    ...reset,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroTagText: {
    ...reset,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroDescription: {
    ...reset,
    lineHeight: 18,
    opacity: 0.95,
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
  chipBlock: {
    ...reset,
    gap: 10,
  },
  visibilityBadge: {
    ...reset,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  visibilityBadgeText: {
    ...reset,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
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
