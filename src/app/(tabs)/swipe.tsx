import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SwipeCard, type SwipeProfile } from '@/components/SwipeCard';
import { SwipeTutorialOverlay } from '@/components/SwipeTutorialOverlay';
import { profiles } from '@/data/data';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

/** Survives tab switches. Resets when the app reloads. */
let swipeTutorialSeenThisSession = false;

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
  const { colors } = useTheme();
  const [deck] = useState(() => shuffleProfiles(profiles as SwipeProfile[]));
  const [index, setIndex] = useState(0);
  const [showTutorial, setShowTutorial] = useState(!swipeTutorialSeenThisSession);
  const titleSize = useFluidSize(18);
  const undoSize = useFluidSize(13);
  const emptySize = useFluidSize(22);
  const canUndo = index > 0;

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
          backgroundColor: colors.ivory,
        },
      ]}
    >
      <View style={styles.topBar}>
        {canUndo ? (
          <Pressable
            onPress={() => setIndex((current) => Math.max(0, current - 1))}
            hitSlop={10}
            style={[styles.undoButton, { backgroundColor: colors.blueGrotto }]}
            accessibilityRole="button"
            accessibilityLabel="Undo last swipe"
          >
            <Text style={[styles.undoLabel, { fontSize: undoSize, color: colors.ivory }]}>
              Undo
            </Text>
          </Pressable>
        ) : (
          <View style={styles.undoPlaceholder} />
        )}
        <Text style={[styles.brand, { fontSize: titleSize, color: colors.blueGrotto }]}>
          roomiez
        </Text>
        <View style={styles.undoPlaceholder} />
      </View>

      {profile ? (
        <SwipeCard
          key={`${profile.id}-${index}`}
          profile={profile}
          onSwiped={() => setIndex((current) => current + 1)}
          onPress={() =>
            router.push({
              pathname: '/roommate/[id]',
              params: { id: String(profile.id) },
            })
          }
        />
      ) : (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { fontSize: emptySize, color: colors.blueIris }]}>
            No more roommates
          </Text>
          <Text style={[styles.emptyBody, { color: colors.blueGrotto }]}>
            You have swiped through everyone for now.
          </Text>
          {canUndo ? (
            <Pressable
              onPress={() => setIndex((current) => Math.max(0, current - 1))}
              hitSlop={10}
              style={[styles.emptyUndo, { backgroundColor: colors.blueGrotto }]}
              accessibilityRole="button"
              accessibilityLabel="Undo last swipe"
            >
              <Text style={[styles.undoLabel, { fontSize: undoSize, color: colors.ivory }]}>
                Undo
              </Text>
            </Pressable>
          ) : null}
        </View>
      )}

      {showTutorial ? (
        <SwipeTutorialOverlay
          onDismiss={() => {
            swipeTutorialSeenThisSession = true;
            setShowTutorial(false);
          }}
        />
      ) : null}
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
    paddingTop: 8,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  undoButton: {
    ...reset,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  undoPlaceholder: {
    ...reset,
    minWidth: 44,
  },
  undoLabel: {
    ...reset,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  brand: {
    ...reset,
    flex: 1,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
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
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyBody: {
    ...reset,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyUndo: {
    ...reset,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
