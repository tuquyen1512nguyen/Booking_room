import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../navigation/types';
import { useRoomDetail } from '../services/roomApi';
import { useBookingStore } from '../store/useBookingStore';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AMENITY_DETAILS, TIME_SLOTS } from '../data/mockRooms';
import { AmenityType } from '../types';

type RouteProps = RouteProp<RootStackParamList, 'RoomDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const RoomDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProps>();
  const route = useRoute<RouteProps>();
  const { roomId } = route.params;
  const { width: screenWidth } = useWindowDimensions();

  const heroHeight = Math.min(Math.round(screenWidth * 0.7), 320);

  const { data: room, isLoading } = useRoomDetail(roomId);
  const isFavorite = useBookingStore((state) => state.isFavorite(roomId));
  const toggleFavorite = useBookingStore((state) => state.toggleFavorite);
  const isSlotBooked = useBookingStore((state) => state.isSlotBooked);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (isLoading || !room) {
    return (
      <View style={[styles.loadingScreen, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Đang tải thông tin phòng học...</Text>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        title: `Đặt ${room.name} trên StudySpace`,
        message: `Khám phá và đặt ${room.name} tại ${room.building} (${room.capacity} chỗ ngồi) trên ứng dụng StudySpace!`,
      });
    } catch {}
  };

  const handleToggleFavorite = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    toggleFavorite(room.id);
  };

  const handleBookNow = () => {
    navigation.navigate('Booking', { roomId: room.id });
  };

  // Xem trước số slot còn trống ngày 27/09/2026
  const todayDateStr = '2026-09-27';
  const openSlotsCount = TIME_SLOTS.filter(
    (slot) => !isSlotBooked(room.id, todayDateStr, slot)
  ).length;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 95 },
        ]}
      >
        {/* Top Hero Image Carousel */}
        <View style={[styles.heroContainer, { height: heroHeight }]}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(
                e.nativeEvent.contentOffset.x / screenWidth
              );
              if (slide !== activeImageIndex) setActiveImageIndex(slide);
            }}
            scrollEventThrottle={16}
          >
            {room.images.map((imgUri, index) => (
              <Image
                key={index}
                source={{ uri: imgUri }}
                style={{ width: screenWidth, height: heroHeight }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Floating Top Controls */}
          <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.circleButton}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <View style={styles.rightHeaderControls}>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.circleButton}
                activeOpacity={0.8}
              >
                <Ionicons name="share-outline" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleToggleFavorite}
                style={styles.circleButton}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isFavorite ? COLORS.accentIndigo : COLORS.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Image Dots Indicator */}
          {room.images.length > 1 && (
            <View style={styles.paginationDots}>
              {room.images.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    activeImageIndex === idx ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Content Body */}
        <View style={styles.contentCard}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <View style={styles.statusRow}>
              <Badge
                label={room.status === 'available' ? 'Đang trống' : 'Đang bận'}
                variant={room.status === 'available' ? 'available' : 'occupied'}
                size="md"
              />
              <View style={styles.ratingBox}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingScore}>{room.rating.toFixed(1)}</Text>
                <Text style={styles.ratingCount}>({room.reviewCount} đánh giá)</Text>
              </View>
            </View>

            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomLocation}>
              <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />{' '}
              {room.building}, {room.floor} • Mã phòng: {room.code}
            </Text>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="people" size={20} color={COLORS.accentIndigo} />
              <Text style={styles.statBoxValue}>{room.capacity} chỗ</Text>
              <Text style={styles.statBoxLabel}>Sức chứa tối đa</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="volume-medium" size={20} color={COLORS.accentIndigo} />
              <Text style={styles.statBoxValue} numberOfLines={1}>{room.noiseLevel}</Text>
              <Text style={styles.statBoxLabel}>Âm thanh</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="hourglass-outline" size={20} color={COLORS.accentIndigo} />
              <Text style={styles.statBoxValue}>Tối đa {room.maxDurationHours}h</Text>
              <Text style={styles.statBoxLabel}>Thời lượng</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu không gian</Text>
            <Text style={styles.descriptionText}>{room.description}</Text>
          </View>

          {/* Amenities & Facilities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trang thiết bị & Tiện ích</Text>
            <View style={styles.amenitiesGrid}>
              {room.amenities.map((amenityKey: AmenityType) => {
                const info = AMENITY_DETAILS[amenityKey];
                return (
                  <View key={amenityKey} style={styles.amenityCard}>
                    <View style={styles.amenityIconCircle}>
                      <Ionicons name="checkmark-circle" size={18} color={COLORS.accentIndigo} />
                    </View>
                    <Text style={styles.amenityTitle} numberOfLines={1}>{info?.name || amenityKey}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Rules & Guidelines */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quy định sử dụng phòng</Text>
            <View style={styles.rulesList}>
              {room.rules.map((rule, idx) => (
                <View key={idx} style={styles.ruleItem}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.accentBlue} />
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Live Today Slots Snapshot */}
          <View style={styles.section}>
            <View style={styles.scheduleHeaderRow}>
              <Text style={styles.sectionTitle}>Lịch học hôm nay (27/09)</Text>
              <Text style={styles.openSlotsCountText}>Còn {openSlotsCount} khung giờ trống</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsScroll}>
              {TIME_SLOTS.slice(0, 8).map((slot) => {
                const booked = isSlotBooked(room.id, todayDateStr, slot);
                return (
                  <View
                    key={slot}
                    style={[
                      styles.previewSlotPill,
                      booked ? styles.previewSlotBooked : styles.previewSlotOpen,
                    ]}
                  >
                    <Text style={[styles.previewSlotText, booked && styles.previewSlotTextBooked]}>
                      {slot.split(' - ')[0]}
                    </Text>
                    <Text style={[styles.previewSlotStatus, booked ? styles.previewStatusBooked : styles.previewStatusOpen]}>
                      {booked ? 'Đã kín' : 'Trống'}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA Bar */}
      <View
        style={[
          styles.bottomCtaBar,
          SHADOWS.hover,
          { paddingBottom: Math.max(insets.bottom + 6, 14) },
        ]}
      >
        <View style={styles.ctaPriceInfo}>
          <Text style={styles.ctaHint}>Cơ sở vật chất</Text>
          <Text style={styles.ctaStatus} numberOfLines={1}>
            {room.status === 'available' ? '🟢 Sẵn sàng đặt chỗ' : '🔴 Đang có người dùng'}
          </Text>
        </View>

        <Button
          title="Đặt phòng này"
          onPress={handleBookNow}
          variant="primary"
          size="lg"
          icon={<Ionicons name="calendar" size={18} color={COLORS.textWhite} />}
          style={styles.bookCtaBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  heroContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.primaryDark,
  },
  floatingHeader: {
    position: 'absolute',
    left: SPACING.screenPadding,
    right: SPACING.screenPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightHeaderControls: {
    flexDirection: 'row',
    gap: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.surface,
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  contentCard: {
    marginTop: -16,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    backgroundColor: COLORS.background,
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.screenPadding,
  },
  headerInfo: {
    marginBottom: SPACING.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  ratingCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  roomName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  roomLocation: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  statBoxValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 6,
    marginBottom: 2,
    textAlign: 'center',
  },
  statBoxLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 6,
    flexBasis: '47%',
    flexGrow: 1,
  },
  amenityIconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  rulesList: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  ruleText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  openSlotsCountText: {
    fontSize: 12,
    color: COLORS.successDark,
    fontWeight: '600',
  },
  slotsScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  previewSlotPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 70,
  },
  previewSlotOpen: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  previewSlotBooked: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  previewSlotText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  previewSlotTextBooked: {
    color: COLORS.dangerDark,
    textDecorationLine: 'line-through',
  },
  previewSlotStatus: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  previewStatusOpen: {
    color: COLORS.successDark,
  },
  previewStatusBooked: {
    color: COLORS.danger,
  },
  bottomCtaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  ctaPriceInfo: {
    flex: 1,
  },
  ctaHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  ctaStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  bookCtaBtn: {
    flex: 1.2,
  },
});
