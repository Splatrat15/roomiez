import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, fluidSize, layout, reset } from '@/theme/main';

export type SwipeProfile = {
  id: number;
  name: string;
  age: number;
  gender: string;
  description: string;
  image: number;
};

type SwipeCardProps = {
  profile: SwipeProfile;
  onSwiped: (direction: 'left' | 'right') => void;
  onPress: () => void;
};

const SWIPE_THRESHOLD = 110;

export function SwipeCard({ profile, onSwiped, onPress }: SwipeCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth, layout.frameMaxWidth);
  const cardWidth = Math.round(width * 0.76);
  const imageHeight = Math.round(cardWidth * 1.2);
  const titleSize = fluidSize(24, width);
  const metaSize = fluidSize(14, width);
  const bodySize = fluidSize(14, width);
  const iconSize = fluidSize(36, width);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const finishSwipe = (direction: 'left' | 'right') => {
    onSwiped(direction);
  };

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(onPress)();
  });

  const pan = Gesture.Pan()
    .activeOffsetX([-18, 18])
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.12;
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(width * 1.25, { duration: 220 }, () => {
          runOnJS(finishSwipe)('right');
        });
        return;
      }

      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-width * 1.25, { duration: 220 }, () => {
          runOnJS(finishSwipe)('left');
        });
        return;
      }

      translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
      translateY.value = withSpring(0, { damping: 18, stiffness: 180 });
    });

  // Drag wins once it moves sideways; a plain tap opens the detail page.
  const gesture = Gesture.Exclusive(pan, tap);

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width, 0, width],
      [-12, 0, 12],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [24, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const rejectStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, -24], [1, 0], Extrapolation.CLAMP),
  }));

  const likeWashStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [24, SWIPE_THRESHOLD], [0, 0.35], Extrapolation.CLAMP),
  }));

  const rejectWashStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, -24], [0.35, 0], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.stage}>
      <Animated.View style={[styles.sideCue, styles.leftCue, rejectStyle]} pointerEvents="none">
        <Ionicons name="trash" size={iconSize} color={colors.rejectRedDeep} />
      </Animated.View>

      <Animated.View style={[styles.sideCue, styles.rightCue, likeStyle]} pointerEvents="none">
        <Ionicons name="checkmark-circle" size={iconSize} color={colors.likeGreenDeep} />
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, { width: cardWidth }, cardStyle]}>
          <View style={[styles.imageFrame, { height: imageHeight }]}>
            <Image source={profile.image} style={styles.image} resizeMode="cover" />
            <Animated.View
              style={[styles.wash, { backgroundColor: colors.likeGreen }, likeWashStyle]}
              pointerEvents="none"
            />
            <Animated.View
              style={[styles.wash, { backgroundColor: colors.rejectRed }, rejectWashStyle]}
              pointerEvents="none"
            />
          </View>

          <View style={styles.info}>
            <Text style={[styles.name, { fontSize: titleSize }]}>
              {profile.name}, {profile.age}
            </Text>
            <Text style={[styles.meta, { fontSize: metaSize }]}>{profile.gender}</Text>
            <Text style={[styles.description, { fontSize: bodySize }]}>{profile.description}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    ...reset,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideCue: {
    ...reset,
    position: 'absolute',
    top: '42%',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftCue: {
    left: '3%',
  },
  rightCue: {
    right: '3%',
  },
  card: {
    ...reset,
    backgroundColor: colors.ivory,
    overflow: 'hidden',
  },
  imageFrame: {
    ...reset,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.blueIris,
  },
  image: {
    ...reset,
    width: '100%',
    height: '100%',
  },
  wash: {
    ...StyleSheet.absoluteFill,
  },
  info: {
    ...reset,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 4,
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
    color: colors.blueIris,
    lineHeight: 20,
  },
});
