import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { profiles } from '@/data/data';
import { colors, reset, useFluidSize } from '@/theme/main';

export default function RoommateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
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
      <View style={[styles.screen, { paddingTop: top }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <View style={styles.missing}>
          <Text style={styles.missingText}>Roommate not found</Text>
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
        },
      ]}
    >
      <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
        <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageFrame}>
          <Image source={profile.image} style={styles.image} resizeMode="cover" />
        </View>

        <Text style={[styles.name, { fontSize: titleSize }]}>
          {profile.name}, {profile.age}
        </Text>
        <Text style={[styles.meta, { fontSize: metaSize }]}>{profile.gender}</Text>
        <Text style={[styles.description, { fontSize: bodySize }]}>{profile.description}</Text>
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
    color: colors.blueGrotto,
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
    backgroundColor: colors.blueIris,
    marginBottom: 12,
  },
  image: {
    ...reset,
    width: '100%',
    height: '100%',
  },
  name: {
    ...reset,
    color: colors.blueIris,
    fontWeight: '700',
  },
  meta: {
    ...reset,
    color: colors.blueGrotto,
    fontWeight: '600',
  },
  description: {
    ...reset,
    marginTop: 8,
    color: colors.blueIris,
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
    color: colors.blueIris,
    fontWeight: '600',
  },
});
