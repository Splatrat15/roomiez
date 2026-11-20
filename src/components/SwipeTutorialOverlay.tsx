import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

type SwipeTutorialOverlayProps = {
  onDismiss: () => void;
};

export function SwipeTutorialOverlay({ onDismiss }: SwipeTutorialOverlayProps) {
  const { colors } = useTheme();
  const titleSize = useFluidSize(22);
  const bodySize = useFluidSize(15);
  const hintSize = useFluidSize(13);
  const iconSize = useFluidSize(28);

  return (
    <Pressable
      style={[styles.overlay, { backgroundColor: 'rgba(80, 79, 128, 0.72)' }]}
      onPress={onDismiss}
      accessibilityRole="button"
    >
      <View style={[styles.panel, { backgroundColor: colors.ivory }]} pointerEvents="none">
        <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
          How swiping works
        </Text>

        <View style={styles.row}>
          <Ionicons name="trash" size={iconSize} color={colors.rejectRedDeep} />
          <Text style={[styles.body, { fontSize: bodySize, color: colors.blueIris }]}>
            Swipe left to reject
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="checkmark-circle" size={iconSize} color={colors.likeGreenDeep} />
          <Text style={[styles.body, { fontSize: bodySize, color: colors.blueIris }]}>
            Swipe right to accept
          </Text>
        </View>

        <Text style={[styles.hint, { fontSize: hintSize, color: colors.blueGrotto }]}>
          Tap anywhere to continue
        </Text>
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
  },
  panel: {
    ...reset,
    width: '78%',
    paddingVertical: 28,
    paddingHorizontal: 22,
    gap: 18,
  },
  title: {
    ...reset,
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
    fontWeight: '600',
  },
  hint: {
    ...reset,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
});
