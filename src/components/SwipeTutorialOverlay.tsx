import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, reset, useFluidSize } from '@/theme/main';

type SwipeTutorialOverlayProps = {
  onDismiss: () => void;
};

export function SwipeTutorialOverlay({ onDismiss }: SwipeTutorialOverlayProps) {
  const titleSize = useFluidSize(22);
  const bodySize = useFluidSize(15);
  const hintSize = useFluidSize(13);
  const iconSize = useFluidSize(28);

  return (
    <Pressable style={styles.overlay} onPress={onDismiss} accessibilityRole="button">
      <View style={styles.panel} pointerEvents="none">
        <Text style={[styles.title, { fontSize: titleSize }]}>How swiping works</Text>

        <View style={styles.row}>
          <Ionicons name="trash" size={iconSize} color={colors.rejectRedDeep} />
          <Text style={[styles.body, { fontSize: bodySize }]}>
            Swipe left to reject
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="checkmark-circle" size={iconSize} color={colors.likeGreenDeep} />
          <Text style={[styles.body, { fontSize: bodySize }]}>
            Swipe right to accept
          </Text>
        </View>

        <Text style={[styles.hint, { fontSize: hintSize }]}>Tap anywhere to continue</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(80, 79, 128, 0.72)',
  },
  panel: {
    ...reset,
    width: '78%',
    backgroundColor: colors.ivory,
    paddingVertical: 28,
    paddingHorizontal: 22,
    gap: 18,
  },
  title: {
    ...reset,
    color: colors.blueIris,
    fontWeight: '700',
    textAlign: 'center',
  },
  row: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  body: {
    ...reset,
    flex: 1,
    color: colors.blueIris,
    fontWeight: '600',
  },
  hint: {
    ...reset,
    marginTop: 4,
    color: colors.blueGrotto,
    textAlign: 'center',
    fontWeight: '600',
  },
});
