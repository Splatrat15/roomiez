import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
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

import { useTheme } from '@/theme/ThemeProvider';
import { fluidSize, layout, reset } from '@/theme/main';

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
  const { colors, isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth, layout.frameMaxWidth);
  const cardWidth = Math.round(width * 0.84);
  const cardHeight = Math.round(cardWidth * (4 / 3));
  const titleSize = fluidSize(28, width);
  const metaSize = fluidSize(14, width);
  const bodySize = fluidSize(13, width);
  const iconSize = fluidSize(36, width);
  const firstName = profile.name.split(' ')[0] ?? profile.name;
  const overlayText = isDark ? '#E4E3D0' : '#E4E3D0';

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
        <Animated.View
          style={[
            styles.card,
            { width: cardWidth, height: cardHeight, backgroundColor: colors.blueIris },
            cardStyle,
          ]}
        >
          <Image source={profile.image} style={styles.image} resizeMode="cover" />

          <LinearGradient
            colors={['transparent', 'rgba(80, 79, 128, 0.18)', colors.gradientEnd]}
            locations={[0.42, 0.68, 1]}
            style={styles.fade}
            pointerEvents="none"
          />

          <Animated.View
            style={[styles.wash, { backgroundColor: colors.likeGreen }, likeWashStyle]}
            pointerEvents="none"
          />
          <Animated.View
            style={[styles.wash, { backgroundColor: colors.rejectRed }, rejectWashStyle]}
            pointerEvents="none"
          />

          <View style={styles.copy} pointerEvents="none">
            <Text style={[styles.name, { fontSize: titleSize, color: overlayText }]}>
              {firstName}, {profile.age}
            </Text>
            <Text style={[styles.meta, { fontSize: metaSize, color: overlayText }]}>
              {profile.gender}
            </Text>
            <Text
              style={[styles.description, { fontSize: bodySize, color: overlayText }]}
              numberOfLines={3}
            >
              {profile.description}
            </Text>
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
    left: '2%',
  },
  rightCue: {
    right: '2%',
  },
  card: {
    ...reset,
    overflow: 'hidden',
    borderRadius: 18,
  },
  image: {
    ...reset,
    width: '100%',
    height: '100%',
  },
  fade: {
    ...StyleSheet.absoluteFill,
  },
  wash: {
    ...StyleSheet.absoluteFill,
  },
  copy: {
    ...reset,
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    gap: 3,
  },
  name: {
    ...reset,
    fontWeight: '700',
  },
  meta: {
    ...reset,
    fontWeight: '600',
    opacity: 0.92,
  },
  description: {
    ...reset,
    marginTop: 4,
    lineHeight: 18,
    opacity: 0.95,
  },
});
