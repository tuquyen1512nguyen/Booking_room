import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';
import { Booking } from '../types';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { BookingCard } from '../components/booking/BookingCard';
import { QRCodeModal } from '../components/booking/QRCodeModal';
import { EmptyState } from '../components/common/EmptyState';

type NavProps = NativeStackNavigationProp<RootStackParamList>;
type TabFilter = 'upcoming' | 'past';

export const MyBookingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProps>();

  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);

  const [activeTab, setActiveTab] = useState<TabFilter>('upcoming');
  const [selectedQRBooking, setSelectedQRBooking] = useState<Booking | null>(null);

  // Lọc danh sách đặt chỗ theo tab
  const filteredBookings = useMemo(() => {
    if (activeTab === 'upcoming') {
      return bookings.filter((b) => b.status === 'upcoming' || b.status === 'in_progress');
    } else {
      return bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
    }
  }, [bookings, activeTab]);

  const upcomingCount = useMemo(
    () => bookings.filter((b) => b.status === 'upcoming' || b.status === 'in_progress').length,
    [bookings]
  );

  const pastCount = useMemo(
    () => bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled').length,
    [bookings]
  );

  const handleCancel = (bookingId: string) => {
    const success = cancelBooking(bookingId);
    if (success) {
      Alert.alert('Đã hủy đặt phòng', 'Lịch đặt của bạn đã được hủy và khung giờ đã được giải phóng.');
    }
  };

  const handleShowQR = (booking: Booking) => {
    setSelectedQRBooking(booking);
  };

  const handlePressRoom = (roomId: string) => {
    navigation.navigate('RoomDetail', { roomId });
  };

  const handleExploreRooms = () => {
    navigation.navigate('MainTabs', { screen: 'BrowseTab' });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Lịch Đặt Của Tôi</Text>
      <Text style={styles.subtitle}>Theo dõi không gian học tập và mã thẻ check-in điện tử</Text>

      {/* Segmented Control */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'upcoming' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('upcoming')}
          activeOpacity={0.8}
        >
          <Text style={[styles.segmentText, activeTab === 'upcoming' && styles.segmentTextActive]}>
            Sắp tới ({upcomingCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'past' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('past')}
          activeOpacity={0.8}
        >
          <Text style={[styles.segmentText, activeTab === 'past' && styles.segmentTextActive]}>
            Lịch sử & Đã qua ({pastCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <BookingCard
            booking={item}
            index={index}
            onCancel={handleCancel}
            onShowQR={handleShowQR}
            onPressRoom={handlePressRoom}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon={activeTab === 'upcoming' ? 'calendar-outline' : 'time-outline'}
            title={activeTab === 'upcoming' ? 'Chưa Có Lịch Đặt Sắp Tới' : 'Chưa Có Lịch Sử Đặt'}
            description={
              activeTab === 'upcoming'
                ? 'Bạn chưa có lịch đặt phòng nào đang hoạt động. Hãy khám phá các phòng học và phòng Lab trong trường.'
                : 'Các buổi học đã hoàn thành hoặc đã hủy sẽ hiển thị tại đây.'
            }
            actionTitle={activeTab === 'upcoming' ? 'Tìm Phòng Học Ngay' : undefined}
            onActionPress={activeTab === 'upcoming' ? handleExploreRooms : undefined}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* QR Code Pass Modal */}
      <QRCodeModal
        visible={!!selectedQRBooking}
        booking={selectedQRBooking}
        onClose={() => setSelectedQRBooking(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: SPACING.xxl + 24,
  },
  headerContainer: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.surface,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});
