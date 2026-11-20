import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUser } from '@/data/UserProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

function Fact({ label, value, colors }: { label: string; value: string; colors: any }) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.fact}>
      <Text style={[styles.factLabel, { color: colors.blueGrotto }]}>{label}</Text>
      <Text style={[styles.factValue, { color: colors.blueIris }]}>{value}</Text>
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
  const sectionSize = useFluidSize(13);

  const top = Platform.OS === 'web' ? 0 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;
  const bottom = Platform.OS === 'web' ? 16 : Math.max(insets.bottom, 8);

  const overlayText = isDark ? '#E4E3D0' : colors.ivory;
  const about = user.about;
  const allergyLine = about.allergies.has
    ? about.allergies.details || 'Yes'
    : 'No allergies listed';

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

        <View style={styles.about}>
          <Text style={[styles.sectionLabel, { fontSize: sectionSize, color: colors.blueGrotto }]}>
            About me
          </Text>
          <Text style={[styles.bio, { fontSize: bodySize, color: colors.blueIris }]}>
            {about.expressYourself.trim() || user.description}
          </Text>
        </View>

        <View style={styles.about}>
          <Text style={[styles.sectionLabel, { fontSize: sectionSize, color: colors.blueGrotto }]}>
            Hobbies
          </Text>
          <View style={styles.chips}>
            {user.hobbies.map((hobby) => (
              <View key={hobby} style={[styles.chip, { backgroundColor: colors.surface }]}>
                <Text style={[styles.chipText, { color: colors.blueIris }]}>{hobby}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.about}>
          <Text style={[styles.sectionLabel, { fontSize: sectionSize, color: colors.blueGrotto }]}>
            Lifestyle
          </Text>
          <Fact label="Cleanliness" value={`${about.cleanliness} / 5`} colors={colors} />
          <Fact label="Looking for" value={about.roommateCloseness} colors={colors} />
          <Fact label="Guests" value={about.guests} colors={colors} />
          <Fact label="Affection in shared spaces" value={about.affection} colors={colors} />
          <Fact label="Study vibe" value={about.quietStudy} colors={colors} />
          <Fact label="Schedule" value={about.schedule} colors={colors} />
          <Fact label="Past midnight" value={about.pastMidnight} colors={colors} />
          <Fact label="Animals" value={about.animals} colors={colors} />
          <Fact label="Sleep" value={about.sleepNeeds} colors={colors} />
          <Fact label="Medical" value={about.medicalConditions || 'None listed'} colors={colors} />
          <Fact label="Allergies" value={allergyLine} colors={colors} />
        </View>

        <View style={styles.about}>
          <Text style={[styles.sectionLabel, { fontSize: sectionSize, color: colors.blueGrotto }]}>
            Looking for in a roommate
          </Text>
          <View style={styles.chips}>
            {user.roommateLikes.map((item) => (
              <View key={item} style={[styles.chip, { backgroundColor: colors.blueGrotto }]}>
                <Text
                  style={[styles.chipText, { color: isDark ? '#14141C' : colors.ivory }]}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.about}>
          <Text style={[styles.sectionLabel, { fontSize: sectionSize, color: colors.roseQuartz }]}>
            Private dislikes (only you)
          </Text>
          <View style={styles.chips}>
            {user.roommateDislikes.map((item) => (
              <View key={item} style={[styles.chip, { backgroundColor: colors.surface }]}>
                <Text style={[styles.chipText, { color: colors.blueIris }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          style={[styles.editButton, { backgroundColor: colors.roseQuartz }]}
          onPress={() => router.push('/create-account')}
        >
          <Text style={[styles.editLabel, { color: isDark ? '#14141C' : colors.ivory }]}>
            {user.quizCompleted ? 'Retake quiz' : 'Complete profile quiz'}
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
    gap: 8,
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
  fact: {
    ...reset,
    gap: 2,
  },
  factLabel: {
    ...reset,
    fontSize: 12,
    fontWeight: '700',
  },
  factValue: {
    ...reset,
    fontSize: 14,
    lineHeight: 20,
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
