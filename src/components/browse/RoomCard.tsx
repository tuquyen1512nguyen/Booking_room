import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Room, AmenityType } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { useBookingStore } from '../../store/useBookingStore';

interface RoomCardProps {
  room: Room;
  onPress: () => void;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AMENITY_ICON_MAP: Record<AmenityType, keyof typeof Ionicons.glyphMap> = {
  wifi: 'wifi-outline',
  ac: 'snow-outline',
  power: 'flash-outline',
  projector: 'videocam-outline',
  whiteboard: 'easel-outline',
  soundproof: 'volume-mute-outline',
  tv: 'tv-outline',
  computers: 'desktop-outline',
  wheelchair: 'accessibility-outline',
};

export const RoomCard: React.FC<RoomCardProps> = ({ room, onPress, index = 0 }) => {
  const scale = useSharedValue(1);
  const isFavorite = useBookingStore((state) => state.isFavorite(room.id));
  const toggleFavorite = useBookingStore((state) => state.toggleFavorite);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 14, stiffness: 220 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 220 });
  };

  const handleToggleFavorite = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch { }
    toggleFavorite(room.id);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 60, 300)).duration(400)}
      style={styles.outerWrapper}
    >
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, SHADOWS.card, animatedStyle]}
      >
        {/* Top Room Image & Badges */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: room.thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Availability Status Badge */}
          <View style={styles.statusBadgeWrapper}>
            <Badge
              label={room.status === 'available' ? 'Còn trống' : 'Đang sử dụng'}
              variant={room.status === 'available' ? 'available' : 'occupied'}
              size="sm"
            />
          </View>

          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>{room.rating.toFixed(1)}</Text>
          </View>

          {/* Bookmark Button */}
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.favoriteButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={isFavorite ? COLORS.accentIndigo : COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Room Info Content */}
        <View style={styles.contentContainer}>
          {/* Header Row: Room Name & Code */}
          <View style={styles.titleRow}>
            <View style={styles.titleWrapper}>
              <Text style={styles.roomName} numberOfLines={1}>
                {room.name}
              </Text>
              <Text style={styles.locationText} numberOfLines={1}>
                <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />{' '}
                {room.building} • {room.floor}
              </Text>
            </View>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{room.code}</Text>
            </View>
          </View>

          {/* Capacity & Noise Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{room.capacity} chỗ ngồi</Text>
            </View>

            <View style={styles.dotSeparator} />

            <View style={styles.metaItem}>
              <Ionicons name="volume-medium-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{room.noiseLevel}</Text>
            </View>
          </View>

          {/* Amenities icon pills */}
          <View style={styles.amenitiesRow}>
            {room.amenities.slice(0, 5).map((amenity) => (
              <View key={amenity} style={styles.amenityPill}>
                <Ionicons
                  name={AMENITY_ICON_MAP[amenity] || 'checkmark-outline'}
                  size={12}
                  color={COLORS.textSecondary}
                />
              </View>
            ))}
            {room.amenities.length > 5 && (
              <View style={styles.moreAmenityPill}>
                <Text style={styles.moreAmenityText}>+{room.amenities.length - 5}</Text>
              </View>
            )}
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadgeWrapper: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  contentContainer: {
    padding: SPACING.cardPadding,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  titleWrapper: {
    flex: 1,
    marginRight: 8,
  },
  roomName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  codeBadge: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  codeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: 8,
  },
  amenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  amenityPill: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moreAmenityPill: {
    height: 28,
    paddingHorizontal: 8,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moreAmenityText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
