import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/BrandLogo';
import { SwipeCard, type SwipeProfile } from '@/components/SwipeCard';
import { SwipeTutorialOverlay } from '@/components/SwipeTutorialOverlay';
import { profiles } from '@/data/data';
import { useMessages } from '@/data/MessagesProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

/** Survives tab switches. Resets when the app reloads. */
let swipeTutorialSeenThisSession = false;

type SwipeHistoryEntry = {
  profileId: number;
  direction: 'left' | 'right';
};

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
  const { likeProfile, unlikeProfile } = useMessages();
  const [deck] = useState(() => shuffleProfiles(profiles as SwipeProfile[]));
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<SwipeHistoryEntry[]>([]);
  const [showTutorial, setShowTutorial] = useState(!swipeTutorialSeenThisSession);
  const undoSize = useFluidSize(13);
  const emptySize = useFluidSize(22);
  const canUndo = history.length > 0;

  const top = Platform.OS === 'web' ? 0 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;

  const profile = deck[index];

  const undoLast = () => {
    const last = history[history.length - 1];
    if (!last) {
      return;
    }
    if (last.direction === 'right') {
      unlikeProfile(last.profileId);
    }
    setHistory((current) => current.slice(0, -1));
    setIndex((value) => Math.max(0, value - 1));
  };

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
            onPress={undoLast}
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
        <View style={styles.brandSlot}>
          <BrandLogo height={40} />
        </View>
        <View style={styles.undoPlaceholder} />
      </View>

      {profile ? (
        <SwipeCard
          key={`${profile.id}-${index}`}
          profile={profile}
          onSwiped={(direction) => {
            if (direction === 'right') {
              likeProfile(profile.id);
            }
            setHistory((current) => [...current, { profileId: profile.id, direction }]);
            setIndex((current) => current + 1);
          }}
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
              onPress={undoLast}
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
  brandSlot: {
    ...reset,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
