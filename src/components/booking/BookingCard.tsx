import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Booking } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  onShowQR?: (booking: Booking) => void;
  onPressRoom?: (roomId: string) => void;
  index?: number;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  onShowQR,
  onPressRoom,
  index = 0,
}) => {
  const isUpcoming = booking.status === 'upcoming';
  const isCompleted = booking.status === 'completed';
  const isCancelled = booking.status === 'cancelled';

  // Định dạng ngày hiển thị: "2026-09-28" -> "28 Thg 9, 2026"
  const formattedDate = React.useMemo(() => {
    try {
      const parts = booking.date.split('-');
      if (parts.length === 3) {
        return `${parts[2]} Thg ${parseInt(parts[1], 10)}, ${parts[0]}`;
      }
    } catch {}
    return booking.date;
  }, [booking.date]);

  const handleCancelPress = () => {
    Alert.alert(
      'Hủy lịch đặt phòng?',
      `Bạn có chắc chắn muốn hủy lịch đặt ${booking.roomName} vào ngày ${formattedDate} (${booking.timeRange}) không?`,
      [
        { text: 'Giữ lại', style: 'cancel' },
        {
          text: 'Xác nhận Hủy',
          style: 'destructive',
          onPress: () => onCancel && onCancel(booking.id),
        },
      ]
    );
  };

  const getStatusLabel = () => {
    switch (booking.status) {
      case 'upcoming':
        return 'Sắp tới';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Đang diễn ra';
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 50, 250)).duration(350)}
      style={styles.container}
    >
      <View style={[styles.card, SHADOWS.card]}>
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.roomHeader}
            onPress={() => onPressRoom && onPressRoom(booking.roomId)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: booking.thumbnail }}
              style={styles.thumbnail}
            />
            <View style={styles.roomInfo}>
              <Text style={styles.roomName} numberOfLines={1}>
                {booking.roomName}
              </Text>
              <Text style={styles.locationText} numberOfLines={1}>
                <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />{' '}
                {booking.building} • {booking.floor}
              </Text>
            </View>
          </TouchableOpacity>

          <Badge
            label={getStatusLabel()}
            variant={
              isUpcoming
                ? 'upcoming'
                : isCompleted
                ? 'completed'
                : 'cancelled'
            }
            size="sm"
          />
        </View>

        <View style={styles.divider} />

        {/* Chi tiết lịch đặt */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar-outline" size={15} color={COLORS.accentIndigo} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Ngày đặt</Text>
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="time-outline" size={15} color={COLORS.accentIndigo} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Khung giờ</Text>
              <Text style={styles.detailValue}>{booking.timeRange}</Text>
            </View>
          </View>
        </View>

        {/* Mục đích sử dụng */}
        {booking.purpose ? (
          <View style={styles.purposeBox}>
            <Ionicons name="bookmark-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.purposeText} numberOfLines={1}>
              {booking.purpose} ({booking.attendeesCount} {booking.attendeesCount > 1 ? 'người' : 'người'})
            </Text>
          </View>
        ) : null}

        {/* Nút tác vụ cho lịch sắp tới */}
        {isUpcoming && (
          <View style={styles.actionsRow}>
            <Button
              title="Mã thẻ QR"
              onPress={() => onShowQR && onShowQR(booking)}
              variant="secondary"
              size="sm"
              icon={<Ionicons name="qr-code-outline" size={16} color={COLORS.accentBlue} />}
              style={styles.qrButton}
            />
            <Button
              title="Hủy đặt"
              onPress={handleCancelPress}
              variant="outline"
              size="sm"
              style={styles.cancelButton}
              textStyle={{ color: COLORS.danger }}
            />
          </View>
        )}

        {/* Đặt lại phòng cho lịch đã qua */}
        {!isUpcoming && (
          <View style={styles.pastActionRow}>
            <Button
              title="Đặt lại phòng này"
              onPress={() => onPressRoom && onPressRoom(booking.roomId)}
              variant="secondary"
              size="sm"
              icon={<Ionicons name="repeat-outline" size={16} color={COLORS.accentBlue} />}
              fullWidth
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.cardPadding,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSubtle,
    marginRight: 10,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  purposeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
    marginBottom: 12,
  },
  purposeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  qrButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
    borderColor: COLORS.dangerBorder,
  },
  pastActionRow: {
    marginTop: 4,
  },
});
