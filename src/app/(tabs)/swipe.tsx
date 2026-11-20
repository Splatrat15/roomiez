import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SwipeCard, type SwipeProfile } from '@/components/SwipeCard';
import { profiles } from '@/data/data';
import { colors, reset, useFluidSize } from '@/theme/main';

function shuffleProfiles(list: SwipeProfile[]) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export default function SwipeScreen() {
  const insets = useSafeAreaInsets();
  const [deck] = useState(() => shuffleProfiles(profiles as SwipeProfile[]));
  const [index, setIndex] = useState(0);
  const titleSize = useFluidSize(18);
  const emptySize = useFluidSize(22);

  const top = Platform.OS === 'web' ? 0 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;

  const profile = deck[index];

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
      <Text style={[styles.brand, { fontSize: titleSize }]}>roomiez</Text>

      {profile ? (
        <SwipeCard
          key={profile.id}
          profile={profile}
          onSwiped={() => setIndex((current) => current + 1)}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { fontSize: emptySize }]}>No more roommates</Text>
          <Text style={styles.emptyBody}>You have swiped through everyone for now.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...reset,
    flex: 1,
    backgroundColor: colors.ivory,
  },
  brand: {
    ...reset,
    color: colors.blueGrotto,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    paddingTop: 8,
  },
  empty: {
    ...reset,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    ...reset,
    color: colors.blueIris,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyBody: {
    ...reset,
    marginTop: 8,
    color: colors.blueGrotto,
    textAlign: 'center',
  },
});
