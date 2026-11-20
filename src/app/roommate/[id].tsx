import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { profiles } from '@/data/data';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize, type ThemeColors } from '@/theme/main';

function Section({
  title,
  colors,
  children,
  accent,
}: {
  title: string;
  colors: ThemeColors;
  children: ReactNode;
  accent?: string;
}) {
  return (
    <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionLabel, { color: accent ?? colors.blueGrotto }]}>{title}</Text>
      {children}
    </View>
  );
}

function Tile({
  label,
  value,
  colors,
  wide,
}: {
  label: string;
  value: string;
  colors: ThemeColors;
  wide?: boolean;
}) {
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

function ChipRow({ items, colors }: { items: string[]; colors: ThemeColors }) {
  return (
    <View style={styles.chips}>
      {items.map((item) => (
        <View key={item} style={[styles.chip, { backgroundColor: colors.blueGrotto }]}>
          <Text style={[styles.chipText, { color: colors.ivory }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function RoommateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const nameSize = useFluidSize(30);
  const tagSize = useFluidSize(12);
  const bodySize = useFluidSize(15);

  const top = Platform.OS === 'web' ? 12 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;
  const bottom = Platform.OS === 'web' ? 16 : Math.max(insets.bottom, 16);

  const profile = profiles.find((person) => String(person.id) === String(id));
  const overlayText = '#E4E3D0';

  if (!profile) {
    return (
      <View style={[styles.screen, { paddingTop: top, backgroundColor: colors.ivory }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
          <Text style={[styles.backLabel, { color: colors.blueGrotto }]}>Back</Text>
        </Pressable>
        <View style={styles.missing}>
          <Text style={[styles.missingText, { color: colors.blueIris }]}>Roommate not found</Text>
        </View>
      </View>
    );
  }

  const about = profile.about;
  const allergyLine = about.allergies.has
    ? about.allergies.details || 'Yes'
    : 'No allergies listed';
  const oneWord = about.oneWordDescribeMe.trim() || 'Roommate';
  const heroTags = [`${profile.age}`, profile.gender, oneWord];
  const heroDescription = about.expressYourself.trim() || profile.description;
  const showLikes = !profile.roommateLikesPrivate && profile.roommateLikes.length > 0;
  const showDislikes = !profile.roommateDislikesPrivate && profile.roommateDislikes.length > 0;

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
      <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
        <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
        <Text style={[styles.backLabel, { color: colors.blueGrotto }]}>Back</Text>
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: colors.blueIris }]}>
          <Image source={profile.image} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(80, 79, 128, 0.15)', colors.gradientEnd]}
            locations={[0.45, 0.7, 1]}
            style={styles.heroFade}
          />
          <View style={styles.heroCopy}>
            <Text style={[styles.heroName, { fontSize: nameSize, color: overlayText }]}>
              {profile.name.split(' ')[0]}
            </Text>
            <View style={styles.heroTags}>
              {heroTags.map((tag) => (
                <View
                  key={tag}
                  style={[styles.heroTag, { backgroundColor: 'rgba(228, 227, 208, 0.22)' }]}
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

        <Section title="About me" colors={colors}>
          <View style={[styles.bioCard, { backgroundColor: colors.ivory }]}>
            <Text style={[styles.tileLabel, { color: colors.blueGrotto }]}>Express yourself</Text>
            <Text style={[styles.bio, { fontSize: bodySize, color: colors.blueIris }]}>
              {about.expressYourself.trim() || profile.description}
            </Text>
          </View>
        </Section>

        <Section title="Education" colors={colors}>
          <View style={styles.tileGrid}>
            <Tile label="School" value={profile.education.school} colors={colors} wide />
            <Tile label="District" value={profile.education.district} colors={colors} />
            <Tile label="Building" value={profile.education.building} colors={colors} />
            <Tile label="Year" value={profile.education.year} colors={colors} />
          </View>
        </Section>

        <Section title="Hobbies" colors={colors}>
          <View style={styles.chips}>
            {profile.hobbies.map((hobby) => (
              <View key={hobby} style={[styles.chip, { backgroundColor: colors.ivory }]}>
                <Text style={[styles.chipText, { color: colors.blueIris }]}>{hobby}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Lifestyle" colors={colors}>
          <View style={styles.tileGrid}>
            <Tile label="Cleanliness" value={`${about.cleanliness} / 5`} colors={colors} />
            <Tile label="Looking for" value={about.roommateCloseness} colors={colors} />
            <Tile label="Schedule" value={about.schedule} colors={colors} />
            <Tile label="Past midnight" value={about.pastMidnight} colors={colors} />
            <Tile label="Study vibe" value={about.quietStudy} colors={colors} wide />
            <Tile label="Guests" value={about.guests} colors={colors} wide />
            <Tile label="Affection in shared spaces" value={about.affection} colors={colors} wide />
            <Tile label="Animals" value={about.animals} colors={colors} wide />
            <Tile label="Sleep" value={about.sleepNeeds} colors={colors} wide />
            <Tile
              label="Medical"
              value={about.medicalConditions || 'None listed'}
              colors={colors}
            />
            <Tile label="Allergies" value={allergyLine} colors={colors} />
          </View>
        </Section>

        {showLikes ? (
          <Section title="Looking for in a roommate" colors={colors}>
            <ChipRow items={profile.roommateLikes} colors={colors} />
          </Section>
        ) : null}

        {showDislikes ? (
          <Section title="Dislikes in a roommate" colors={colors}>
            <ChipRow items={profile.roommateDislikes} colors={colors} />
          </Section>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...reset,
    flex: 1,
  },
  back: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 2,
  },
  backLabel: {
    ...reset,
    fontWeight: '600',
    fontSize: 16,
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
  sectionLabel: {
    ...reset,
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
  missing: {
    ...reset,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    ...reset,
    fontWeight: '600',
  },
});
