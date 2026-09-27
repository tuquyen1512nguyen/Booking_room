import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export const SkeletonCard: React.FC = () => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.9, { duration: 800 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.card}>
      {/* Image Skeleton */}
      <Animated.View style={[styles.imageSkeleton, animatedStyle]} />

      <View style={styles.content}>
        {/* Title & Badge */}
        <View style={styles.row}>
          <Animated.View style={[styles.titleSkeleton, animatedStyle]} />
          <Animated.View style={[styles.badgeSkeleton, animatedStyle]} />
        </View>

        {/* Location */}
        <Animated.View style={[styles.locationSkeleton, animatedStyle]} />

        {/* Tags */}
        <View style={styles.tagRow}>
          <Animated.View style={[styles.tagSkeleton, animatedStyle]} />
          <Animated.View style={[styles.tagSkeleton, { width: 60 }, animatedStyle]} />
          <Animated.View style={[styles.tagSkeleton, { width: 50 }, animatedStyle]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  imageSkeleton: {
    width: '100%',
    height: 170,
    backgroundColor: COLORS.border,
  },
  content: {
    padding: SPACING.cardPadding,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleSkeleton: {
    width: '55%',
    height: 18,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.border,
  },
  badgeSkeleton: {
    width: 70,
    height: 20,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
  },
  locationSkeleton: {
    width: '40%',
    height: 14,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.border,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagSkeleton: {
    width: 75,
    height: 24,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSubtle,
  },
});
