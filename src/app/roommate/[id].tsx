import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { profiles } from '@/data/data';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

export default function RoommateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const titleSize = useFluidSize(30);
  const metaSize = useFluidSize(16);
  const bodySize = useFluidSize(16);

  const top = Platform.OS === 'web' ? 12 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;
  const bottom = Platform.OS === 'web' ? 16 : Math.max(insets.bottom, 16);

  const profile = profiles.find((person) => String(person.id) === String(id));

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

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: top,
          paddingLeft: left,
          paddingRight: right,
          paddingBottom: bottom,
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
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.imageFrame, { backgroundColor: colors.blueIris }]}>
          <Image source={profile.image} style={styles.image} resizeMode="cover" />
        </View>

        <Text style={[styles.name, { fontSize: titleSize, color: colors.blueIris }]}>
          {profile.name}, {profile.age}
        </Text>
        <Text style={[styles.meta, { fontSize: metaSize, color: colors.blueGrotto }]}>
          {profile.gender}
        </Text>
        <Text style={[styles.description, { fontSize: bodySize, color: colors.blueIris }]}>
          {profile.description}
        </Text>
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
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 8,
  },
  imageFrame: {
    ...reset,
    width: '100%',
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    ...reset,
    width: '100%',
    height: '100%',
  },
  name: {
    ...reset,
    fontWeight: '700',
  },
  meta: {
    ...reset,
    fontWeight: '600',
  },
  description: {
    ...reset,
    marginTop: 8,
    lineHeight: 24,
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
