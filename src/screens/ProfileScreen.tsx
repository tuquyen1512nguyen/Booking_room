import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';

type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProps>();

  const user = useBookingStore((state) => state.user);
  const bookings = useBookingStore((state) => state.bookings);
  const favorites = useBookingStore((state) => state.favorites);
  const notifications = useBookingStore((state) => state.notifications);
  const resetToDefaults = useBookingStore((state) => state.resetToDefaults);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const activeBookingsCount = bookings.filter((b) => b.status === 'upcoming').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleResetData = () => {
    Alert.alert(
      'Khôi phục dữ liệu mẫu?',
      'Thao tác này sẽ đặt lại danh sách đặt phòng, bookmark và thông báo về trạng thái ban đầu.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục',
          style: 'destructive',
          onPress: () => {
            resetToDefaults();
            Alert.alert('Hoàn tất', 'Dữ liệu ứng dụng đã được khôi phục về trạng thái ban đầu.');
          },
        },
      ]
    );
  };

  const renderMenuItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    onPress: () => void,
    badgeText?: string,
    badgeColor?: string,
    color?: string
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIconCircle}>
        <Ionicons name={icon} size={18} color={color || COLORS.accentIndigo} />
      </View>
      <Text style={[styles.menuTitle, color ? { color } : undefined]}>{title}</Text>

      {badgeText && (
        <View style={[styles.menuBadge, badgeColor ? { backgroundColor: badgeColor } : undefined]}>
          <Text style={styles.menuBadgeText}>{badgeText}</Text>
        </View>
      )}

      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Tiêu đề */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>Hồ Sơ Sinh Viên</Text>
        </View>

        {/* Thẻ sinh viên */}
        <View style={[styles.userCard, SHADOWS.card]}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            <View style={styles.onlineBadge} />
          </View>

          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userMajor}>{user.major}</Text>
          <Text style={styles.studentIdBadge}>
            MSSV: <Text style={styles.boldId}>{user.studentId}</Text> • Năm {user.year}
          </Text>

          <View style={styles.quotaPill}>
            <Ionicons name="shield-checkmark" size={13} color={COLORS.successDark} />
            <Text style={styles.quotaText}>
              Hạn mức đặt: {activeBookingsCount}/{user.maxBookingQuota} phòng đang đặt
            </Text>
          </View>
        </View>

        {/* Bảng thống kê */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, SHADOWS.subtle]}>
            <Text style={styles.statNumber}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Tổng lượt đặt</Text>
          </View>

          <View style={[styles.statCard, SHADOWS.subtle]}>
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Phòng đã lưu</Text>
          </View>

          <View style={[styles.statCard, SHADOWS.subtle]}>
            <Text style={styles.statNumber}>{completedCount * 2}h</Text>
            <Text style={styles.statLabel}>Giờ tự học</Text>
          </View>
        </View>

        {/* Hoạt động & Bookmark */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Hoạt động & Yêu thích</Text>
          <View style={[styles.cardGroup, SHADOWS.subtle]}>
            {renderMenuItem(
              'calendar-outline',
              'Lịch Đặt Của Tôi',
              () => navigation.navigate('MainTabs', { screen: 'BookingsTab' }),
              `${activeBookingsCount} lịch`,
              COLORS.blueLight
            )}
            <View style={styles.itemDivider} />
            {renderMenuItem(
              'bookmark-outline',
              'Phòng Học Đã Đánh Dấu',
              () => navigation.navigate('Favorites'),
              `${favorites.length} phòng`,
              '#EEF2FF'
            )}
            <View style={styles.itemDivider} />
            {renderMenuItem(
              'notifications-outline',
              'Thông Báo & Nhắc Nhở',
              () => navigation.navigate('Notifications'),
              unreadNotifsCount > 0 ? `${unreadNotifsCount} mới` : undefined,
              COLORS.dangerLight
            )}
          </View>
        </View>

        {/* Cài đặt thông báo */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Cài đặt & Tùy chọn</Text>
          <View style={[styles.cardGroup, SHADOWS.subtle]}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabelWrap}>
                <Ionicons name="notifications-circle-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.switchTitle}>Thông báo đẩy (Push)</Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.accentIndigo }}
                thumbColor={COLORS.surface}
              />
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.switchRow}>
              <View style={styles.switchLabelWrap}>
                <Ionicons name="alarm-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.switchTitle}>Nhắc trước giờ học 15 phút</Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.accentIndigo }}
                thumbColor={COLORS.surface}
              />
            </View>
          </View>
        </View>

        {/* Hệ thống & Hỗ trợ */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Hệ thống & Hỗ trợ</Text>
          <View style={[styles.cardGroup, SHADOWS.subtle]}>
            {renderMenuItem('document-text-outline', 'Quy chế mượn phòng học', () => {
              Alert.alert(
                'Quy định khuôn viên',
                '1. Thời lượng đặt tối đa: 3-4 tiếng.\n2. Vui lòng quét mã QR check-in trong vòng 15 phút.\n3. Giữ vệ sinh chung và bảo quản thiết bị.\n4. Hủy trước ít nhất 1 tiếng nếu không thể tham gia.'
              );
            })}
            <View style={styles.itemDivider} />
            {renderMenuItem('help-circle-outline', 'Hỗ trợ kỹ thuật & Ban quản lý', () => {
              Alert.alert('Hỗ trợ StudySpace', 'Liên hệ Phòng Quản trị Cơ sở vật chất:\n📧 support@campus.edu.vn\n📞 (028) 37244270');
            })}
            <View style={styles.itemDivider} />
            {renderMenuItem('refresh-outline', 'Khôi phục dữ liệu mẫu', handleResetData, undefined, undefined, COLORS.danger)}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerAppTitle}>StudySpace v1.0.0</Text>
          <Text style={styles.footerAppSub}>Hệ thống Đặt Phòng Học & Lab Đại học</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl + 32,
  },
  topHeader: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  userCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginHorizontal: SPACING.screenPadding,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  userMajor: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  studentIdBadge: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  boldId: {
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  quotaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
  },
  quotaText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.successDark,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  section: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.screenPadding,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  menuBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginRight: 8,
  },
  menuBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 56,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
  },
  switchLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  footerAppTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  footerAppSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
