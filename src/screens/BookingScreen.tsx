import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
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
import { DateSelector } from '../components/booking/DateSelector';
import { TimeSlotPicker } from '../components/booking/TimeSlotPicker';
import { Button } from '../components/common/Button';

type RouteProps = RouteProp<RootStackParamList, 'Booking'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const BookingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProps>();
  const route = useRoute<RouteProps>();
  const { roomId, initialDate } = route.params;

  const { data: room, isLoading } = useRoomDetail(roomId);
  const getBookedSlotsForRoom = useBookingStore((state) => state.getBookedSlotsForRoom);
  const createBooking = useBookingStore((state) => state.createBooking);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || '2026-09-27');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [purpose, setPurpose] = useState<string>('Học nhóm & Làm bài tập lớn');
  const [attendeesCount, setAttendeesCount] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Danh sách slot đã bị đặt
  const bookedSlots = useMemo(() => {
    return getBookedSlotsForRoom(roomId, selectedDate);
  }, [roomId, selectedDate, getBookedSlotsForRoom]);

  // Toggle chọn slot
  const handleToggleSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots((prev) => prev.filter((s) => s !== slot));
    } else {
      const maxDuration = room?.maxDurationHours || 3;
      if (selectedSlots.length >= maxDuration) {
        Alert.alert(
          'Đạt giới hạn thời gian',
          `Bạn chỉ có thể đặt tối đa ${maxDuration} giờ mỗi buổi tại ${room?.name || 'phòng này'}.`
        );
        return;
      }
      setSelectedSlots((prev) => [...prev, slot]);
    }
  };

  // Tính chuỗi khung giờ hiển thị
  const formattedTimeRange = useMemo(() => {
    if (selectedSlots.length === 0) return 'Chưa chọn khung giờ';
    const sorted = [...selectedSlots].sort();
    const firstStart = sorted[0].split(' - ')[0];
    const lastEnd = sorted[sorted.length - 1].split(' - ')[1];
    return `${firstStart} - ${lastEnd} (${sorted.length} tiếng)`;
  }, [selectedSlots]);

  const handleConfirmBooking = () => {
    if (selectedSlots.length === 0) {
      Alert.alert('Chưa chọn khung giờ', 'Vui lòng chọn ít nhất một khung giờ còn trống.');
      return;
    }

    if (!room) return;

    setIsSubmitting(true);

    const result = createBooking({
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      floor: room.floor,
      thumbnail: room.thumbnail,
      date: selectedDate,
      timeSlots: selectedSlots,
      timeRange: formattedTimeRange,
      purpose: purpose.trim() || 'Tự học',
      attendeesCount,
    });

    setIsSubmitting(false);

    if (result.success) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      Alert.alert(
        'Đặt phòng thành công! 🎉',
        `Lịch đặt phòng ${room.name} vào ngày ${selectedDate} (${formattedTimeRange}) đã sẵn sàng. Mã thẻ QR check-in điện tử của bạn đã được khởi tạo.`,
        [
          {
            text: 'Xem Lịch Đã Đặt',
            onPress: () => {
              navigation.navigate('MainTabs', { screen: 'BookingsTab' });
            },
          },
        ]
      );
    } else {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {}
      Alert.alert('Lỗi đặt phòng', result.error || 'Không thể hoàn tất đặt phòng.');
    }
  };

  if (isLoading || !room) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Đang chuẩn bị thông tin đặt chỗ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={[styles.navHeader, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt Phòng Học</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollBody,
          { paddingBottom: insets.bottom + 110 },
        ]}
      >
        {/* Selected Room Header Card */}
        <View style={[styles.roomCard, SHADOWS.subtle]}>
          <Image source={{ uri: room.thumbnail }} style={styles.roomThumb} />
          <View style={styles.roomInfo}>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomSub}>
              <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />{' '}
              {room.building} • {room.floor}
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.roomMetaPill}>
                <Ionicons name="people-outline" size={12} color={COLORS.accentIndigo} />
                <Text style={styles.roomMetaText}>Sức chứa {room.capacity} chỗ</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Date Selector */}
        <DateSelector
          selectedDate={selectedDate}
          onSelectDate={(newDate) => {
            setSelectedDate(newDate);
            setSelectedSlots([]); // reset slots khi đổi ngày
          }}
        />

        {/* Conflict Notice if all booked */}
        {bookedSlots.length >= 8 && (
          <View style={styles.conflictAlert}>
            <Ionicons name="alert-circle" size={18} color={COLORS.warningDark} />
            <Text style={styles.conflictAlertText}>
              Nhu cầu cao vào ngày này! Nhiều khung giờ cao điểm đã có người đặt.
            </Text>
          </View>
        )}

        {/* Time Slot Picker */}
        <TimeSlotPicker
          bookedSlots={bookedSlots}
          selectedSlots={selectedSlots}
          onToggleSlot={handleToggleSlot}
          maxSlots={room.maxDurationHours}
        />

        {/* Purpose & Details Section */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Thông Tin Đặt Chỗ</Text>

          {/* Purpose Input */}
          <Text style={styles.inputLabel}>Mục đích học tập / Môn học</Text>
          <TextInput
            style={styles.textInput}
            value={purpose}
            onChangeText={setPurpose}
            placeholder="vd: Ôn thi đồ án tốt nghiệp, Làm bài tập nhóm"
            placeholderTextColor={COLORS.textMuted}
          />

          {/* Attendees Selector */}
          <Text style={styles.inputLabel}>Số lượng người tham gia</Text>
          <View style={styles.attendeesCounter}>
            <TouchableOpacity
              onPress={() => setAttendeesCount((prev) => Math.max(1, prev - 1))}
              style={styles.counterBtn}
            >
              <Ionicons name="remove" size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <View style={styles.counterDisplay}>
              <Text style={styles.counterText}>
                {attendeesCount} người
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                setAttendeesCount((prev) => Math.min(room.capacity, prev + 1))
              }
              style={styles.counterBtn}
            >
              <Ionicons name="add" size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Booking Summary Box */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tóm Tắt Lịch Đặt</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phòng học:</Text>
            <Text style={styles.summaryValue}>{room.name}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ngày học:</Text>
            <Text style={styles.summaryValue}>{selectedDate}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Khung giờ:</Text>
            <Text
              style={[
                styles.summaryValue,
                selectedSlots.length > 0 && { color: COLORS.accentIndigo },
              ]}
            >
              {formattedTimeRange}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số người:</Text>
            <Text style={styles.summaryValue}>{attendeesCount} sinh viên</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Confirm Button */}
      <View
        style={[
          styles.stickyFooter,
          SHADOWS.hover,
          { paddingBottom: Math.max(insets.bottom + 6, 14) },
        ]}
      >
        <Button
          title={
            selectedSlots.length === 0
              ? 'Chọn khung giờ để tiếp tục'
              : `Xác nhận đặt (${selectedSlots.length} tiếng)`
          }
          onPress={handleConfirmBooking}
          disabled={selectedSlots.length === 0 || isSubmitting}
          loading={isSubmitting}
          variant="primary"
          size="lg"
          fullWidth
          icon={<Ionicons name="checkmark-circle" size={20} color={COLORS.textWhite} />}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollBody: {
    paddingTop: SPACING.md,
  },
  roomCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.cardPadding,
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  roomThumb: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
    marginRight: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  roomSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  roomMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  roomMetaText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accentIndigo,
  },
  conflictAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.warningLight,
    padding: SPACING.sm,
    marginHorizontal: SPACING.screenPadding,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.warningBorder,
  },
  conflictAlertText: {
    fontSize: 12,
    color: COLORS.warningDark,
    flex: 1,
    fontWeight: '500',
  },
  formSection: {
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.lg,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  attendeesCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 6,
    maxWidth: 220,
    width: '100%',
  },
  counterBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.cardPadding,
    marginHorizontal: SPACING.screenPadding,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: 12,
  },
});
