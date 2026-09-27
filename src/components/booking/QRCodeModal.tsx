import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Badge } from '../common/Badge';

interface QRCodeModalProps {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  visible,
  booking,
  onClose,
}) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const qrIconSize = windowHeight < 700 ? 120 : 150;

  if (!booking) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.modalCard,
            { maxHeight: Math.min(windowHeight * 0.9, 640), maxWidth: Math.min(windowWidth * 0.92, 360) },
            SHADOWS.floating,
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Thẻ Check-in Điện Tử</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Thông tin phòng */}
            <View style={styles.roomHeader}>
              <Text style={styles.roomName}>{booking.roomName}</Text>
              <Text style={styles.roomSub}>
                {booking.building} • {booking.floor}
              </Text>
              <View style={styles.badgeWrap}>
                <Badge label="Đã xác nhận đặt chỗ" variant="available" size="sm" />
              </View>
            </View>

            {/* Mô phỏng mã QR */}
            <View style={styles.qrContainer}>
              <View style={styles.qrFrame}>
                <Ionicons name="qr-code" size={qrIconSize} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.qrCodeText}>{booking.qrCode}</Text>
              <Text style={styles.qrHint}>
                Quét mã tại cửa phòng học hoặc xuất trình cho quản lý thư viện
              </Text>
            </View>

            {/* Chi tiết lịch */}
            <View style={styles.scheduleBox}>
              <View style={styles.scheduleCol}>
                <Text style={styles.schedLabel}>Ngày đặt</Text>
                <Text style={styles.schedVal}>{booking.date}</Text>
              </View>
              <View style={styles.schedDivider} />
              <View style={styles.scheduleCol}>
                <Text style={styles.schedLabel}>Khung giờ</Text>
                <Text style={styles.schedVal}>{booking.timeRange}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Nút đóng */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.doneBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.doneBtnText}>Hoàn tất</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.screenPadding,
  },
  modalCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    alignItems: 'center',
  },
  roomHeader: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  roomName: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  roomSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  badgeWrap: {
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
    marginVertical: SPACING.xs,
  },
  qrFrame: {
    padding: 8,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginBottom: 6,
  },
  qrCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  qrHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 8,
  },
  scheduleBox: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLORS.blueLight,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.blueBorder,
  },
  scheduleCol: {
    flex: 1,
    alignItems: 'center',
  },
  schedDivider: {
    width: 1,
    backgroundColor: COLORS.blueBorder,
  },
  schedLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  schedVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentBlue,
    marginTop: 2,
  },
  doneBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
  },
  doneBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
