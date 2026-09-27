import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';
import { EmptyState } from '../components/common/EmptyState';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { AppNotification } from '../types';

type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const NotificationsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProps>();

  const notifications = useBookingStore((state) => state.notifications);
  const markNotificationRead = useBookingStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useBookingStore((state) => state.markAllNotificationsRead);

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'booking_confirmed':
        return { name: 'checkmark-circle' as const, color: COLORS.success, bg: COLORS.successLight };
      case 'reminder':
        return { name: 'alarm' as const, color: COLORS.accentIndigo, bg: '#EEF2FF' };
      case 'cancellation':
        return { name: 'close-circle' as const, color: COLORS.danger, bg: COLORS.dangerLight };
      default:
        return { name: 'information-circle' as const, color: COLORS.accentBlue, bg: COLORS.blueLight };
    }
  };

  const handleNotificationPress = (item: AppNotification) => {
    markNotificationRead(item.id);
    if (item.bookingId) {
      navigation.navigate('MainTabs', { screen: 'BookingsTab' });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông Báo</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity onPress={markAllNotificationsRead} activeOpacity={0.7}>
            <Text style={styles.markAllText}>Đã đọc tất cả</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const iconMeta = getNotifIcon(item.type);
          return (
            <TouchableOpacity
              style={[
                styles.notifCard,
                !item.read && styles.notifCardUnread,
                SHADOWS.subtle,
              ]}
              onPress={() => handleNotificationPress(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconCircle, { backgroundColor: iconMeta.bg }]}>
                <Ionicons name={iconMeta.name} size={20} color={iconMeta.color} />
              </View>

              <View style={styles.notifContent}>
                <View style={styles.notifTopRow}>
                  <Text style={[styles.notifTitle, !item.read && styles.unreadTitle]}>
                    {item.title}
                  </Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMsg}>{item.message}</Text>
                <Text style={styles.notifTime}>
                  {new Date(item.timestamp).toLocaleDateString('vi-VN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="Không Có Thông Báo Nào"
            description="Bạn đã đọc hết tất cả thông báo và lời nhắc đặt phòng."
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
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
  markAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accentIndigo,
  },
  listContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.cardPadding,
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notifCardUnread: {
    backgroundColor: '#F8FAFC',
    borderColor: '#C7D2FE',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  unreadTitle: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accentIndigo,
  },
  notifMsg: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
