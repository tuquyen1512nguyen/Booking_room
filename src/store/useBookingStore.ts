import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, UserProfile, AppNotification, BookingStatus } from '../types';
import { MOCK_ROOMS } from '../data/mockRooms';

interface BookingStoreState {
  bookings: Booking[];
  favorites: string[];
  user: UserProfile;
  notifications: AppNotification[];

  // Booking actions
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'qrCode' | 'status'>) => { success: boolean; bookingId?: string; error?: string };
  cancelBooking: (bookingId: string, reason?: string) => boolean;
  completeBooking: (bookingId: string) => void;

  // Favorites actions
  toggleFavorite: (roomId: string) => void;
  isFavorite: (roomId: string) => boolean;

  // Conflict Check
  isSlotBooked: (roomId: string, date: string, timeSlot: string) => boolean;
  getBookedSlotsForRoom: (roomId: string, date: string) => string[];

  // Notifications actions
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // User profile
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Reset for testing
  resetToDefaults: () => void;
}

const INITIAL_USER: UserProfile = {
  id: 'user-001',
  fullName: 'Tú Quyên',
  studentId: '23IT229',
  email: 'quyen.t@campus.edu.vn',
  major: 'Kỹ thuật Phần mềm',
  faculty: 'Khoa Công nghệ Thông tin',
  year: 4,
  avatarUrl: 'https://daotao.vku.udn.vn/uploads/sinhvien/23IT229.jpg',
  phone: '+84 987 654 321',
  maxBookingQuota: 5,
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-20260928-101',
    roomId: 'room-1',
    roomName: 'Phòng Lab B-101',
    building: 'Tòa nhà B',
    floor: 'Tầng 1',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKccZ023cke6ZlHKhJym1fLwZlFabNNMkp0oRcR7E0GA&s=10',
    date: '2026-09-28',
    timeSlots: ['10:00 - 11:00'],
    timeRange: '10:00 - 11:00',
    purpose: 'Họp nhóm Đồ án Capstone',
    attendeesCount: 4,
    status: 'upcoming',
    createdAt: '2026-09-26T14:30:00Z',
    qrCode: 'STUDYSPACE-BK-20260928-101',
  },
  {
    id: 'BK-20260920-202',
    roomId: 'room-2',
    roomName: 'Khu Thư Viện Trung Tâm',
    building: 'Thư viện Trung tâm',
    floor: 'Tầng 2',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwrIpTQ4azlVGEz2gAi97yqjN4wWIi17IingaHKR1S9Q&s=10',
    date: '2026-09-20',
    timeSlots: ['14:00 - 15:00', '15:00 - 16:00'],
    timeRange: '14:00 - 16:00',
    purpose: 'Ôn thi giữa kỳ',
    attendeesCount: 1,
    status: 'completed',
    createdAt: '2026-09-18T09:15:00Z',
    qrCode: 'STUDYSPACE-BK-20260920-202',
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Đặt phòng thành công 🎉',
    message: 'Lịch đặt Phòng Lab B-101 ngày 28/09 (10:00 - 11:00) của bạn đã được xác nhận.',
    timestamp: '2026-09-26T14:30:00Z',
    read: false,
    type: 'booking_confirmed',
    bookingId: 'BK-20260928-101',
  },
  {
    id: 'notif-2',
    title: 'Nhắc nhở buổi học ⏰',
    message: 'Vui lòng xuất trình mã QR check-in trước giờ học 10 phút tại cửa phòng.',
    timestamp: '2026-09-27T08:00:00Z',
    read: true,
    type: 'reminder',
  },
];

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({
      bookings: INITIAL_BOOKINGS,
      favorites: ['room-1', 'room-3'],
      user: INITIAL_USER,
      notifications: INITIAL_NOTIFICATIONS,

      createBooking: (bookingData) => {
        const { roomId, date, timeSlots } = bookingData;
        const state = get();

        // 1. Kiểm tra trùng slot (Conflict prevention)
        const isConflict = timeSlots.some((slot) => state.isSlotBooked(roomId, date, slot));
        if (isConflict) {
          return {
            success: false,
            error: 'Một hoặc nhiều khung giờ bạn chọn đã có người đặt trước. Vui lòng chọn khung giờ khác.',
          };
        }

        // 2. Kiểm tra hạn mức đặt phòng
        const activeBookings = state.bookings.filter((b) => b.status === 'upcoming');
        if (activeBookings.length >= state.user.maxBookingQuota) {
          return {
            success: false,
            error: `Bạn đã đạt tối đa hạn mức ${state.user.maxBookingQuota} lịch đặt đang hoạt động.`,
          };
        }

        const dateClean = date.replace(/-/g, '');
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const newId = `BK-${dateClean}-${randomSuffix}`;
        const qrCode = `STUDYSPACE-${newId}`;

        const newBooking: Booking = {
          ...bookingData,
          id: newId,
          status: 'upcoming',
          createdAt: new Date().toISOString(),
          qrCode,
        };

        const newNotification: AppNotification = {
          id: `notif-${Date.now()}`,
          title: 'Đặt phòng thành công 🎉',
          message: `Lịch đặt ${bookingData.roomName} vào ngày ${bookingData.date} (${bookingData.timeRange}) đã được xác nhận thành công.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'booking_confirmed',
          bookingId: newId,
        };

        set((s) => ({
          bookings: [newBooking, ...s.bookings],
          notifications: [newNotification, ...s.notifications],
        }));

        return { success: true, bookingId: newId };
      },

      cancelBooking: (bookingId, reason) => {
        const state = get();
        const booking = state.bookings.find((b) => b.id === bookingId);
        if (!booking) return false;

        const updatedBookings = state.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'cancelled' as BookingStatus } : b
        );

        const cancelNotification: AppNotification = {
          id: `notif-${Date.now()}`,
          title: 'Đã hủy lịch đặt phòng ⚠️',
          message: `Lịch đặt ${booking.roomName} vào ngày ${booking.date} (${booking.timeRange}) đã được hủy.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'cancellation',
          bookingId,
        };

        set({
          bookings: updatedBookings,
          notifications: [cancelNotification, ...state.notifications],
        });

        return true;
      },

      completeBooking: (bookingId) => {
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'completed' as BookingStatus } : b
          ),
        }));
      },

      toggleFavorite: (roomId) => {
        set((s) => {
          const exists = s.favorites.includes(roomId);
          return {
            favorites: exists
              ? s.favorites.filter((id) => id !== roomId)
              : [...s.favorites, roomId],
          };
        });
      },

      isFavorite: (roomId) => {
        return get().favorites.includes(roomId);
      },

      isSlotBooked: (roomId, date, timeSlot) => {
        const state = get();

        // Kiểm tra lịch mặc định của mock data
        const room = MOCK_ROOMS.find((r) => r.id === roomId);
        const inDefault = room?.defaultBookings?.some(
          (b) => b.date === date && b.timeSlot === timeSlot
        );
        if (inDefault) return true;

        // Kiểm tra lịch đang hoạt động của client
        const inClient = state.bookings.some(
          (b) =>
            b.roomId === roomId &&
            b.date === date &&
            b.status === 'upcoming' &&
            b.timeSlots.includes(timeSlot)
        );

        return inClient;
      },

      getBookedSlotsForRoom: (roomId, date) => {
        const state = get();
        const bookedSlots = new Set<string>();

        // Từ mock data
        const room = MOCK_ROOMS.find((r) => r.id === roomId);
        room?.defaultBookings?.forEach((b) => {
          if (b.date === date) {
            bookedSlots.add(b.timeSlot);
          }
        });

        // Từ bookings đang hoạt động
        state.bookings.forEach((b) => {
          if (b.roomId === roomId && b.date === date && b.status === 'upcoming') {
            b.timeSlots.forEach((slot) => bookedSlots.add(slot));
          }
        });

        return Array.from(bookedSlots);
      },

      addNotification: (notification) => {
        const newNotif: AppNotification = {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
        };
        set((s) => ({ notifications: [newNotif, ...s.notifications] }));
      },

      markNotificationRead: (notificationId) => {
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        }));
      },

      markAllNotificationsRead: () => {
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      updateUserProfile: (profile) => {
        set((s) => ({ user: { ...s.user, ...profile } }));
      },

      resetToDefaults: () => {
        set({
          bookings: INITIAL_BOOKINGS,
          favorites: ['room-1', 'room-3'],
          user: INITIAL_USER,
          notifications: INITIAL_NOTIFICATIONS,
        });
      },
    }),
    {
      name: 'studyspace-storage-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
