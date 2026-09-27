export type RoomCategory = 'all' | 'available' | 'lab' | 'library' | 'large' | 'meeting';

export type RoomStatus = 'available' | 'occupied' | 'maintenance';

export type AmenityType = 
  | 'wifi' 
  | 'ac' 
  | 'power' 
  | 'projector' 
  | 'whiteboard' 
  | 'soundproof' 
  | 'tv' 
  | 'computers'
  | 'wheelchair';

export interface Amenity {
  id: AmenityType;
  name: string;
  icon: string;
}

export interface ExistingSlotBooking {
  date: string; // YYYY-MM-DD
  timeSlot: string; // "09:00 - 10:00"
  userName?: string;
}

export interface Room {
  id: string;
  name: string;
  code: string; // e.g. "A3-101"
  building: string; // e.g. "Tòa nhà A3"
  floor: string; // e.g. "Tầng 1"
  category: 'lab' | 'library' | 'meeting' | 'study_pod';
  capacity: number;
  status: RoomStatus;
  rating: number;
  reviewCount: number;
  images: string[];
  thumbnail: string;
  description: string;
  amenities: AmenityType[];
  noiseLevel: 'Khu vực yên tĩnh' | 'Học tập tập trung' | 'Được phép thảo luận' | 'Không gian làm việc nhóm';
  rules: string[];
  maxDurationHours: number;
  availableHours: {
    start: string; // "07:30"
    end: string; // "21:30"
  };
  defaultBookings?: ExistingSlotBooking[];
}

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled' | 'in_progress';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  floor: string;
  thumbnail: string;
  date: string; // YYYY-MM-DD
  timeSlots: string[]; // e.g. ["09:00 - 10:00", "10:00 - 11:00"]
  timeRange: string; // e.g. "09:00 - 11:00"
  purpose: string;
  attendeesCount: number;
  status: BookingStatus;
  createdAt: string;
  qrCode: string;
  userNotes?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  major: string;
  faculty: string;
  year: number;
  avatarUrl: string;
  phone: string;
  maxBookingQuota: number; // e.g. 5 active bookings allowed
}

export interface RoomFilterState {
  category: RoomCategory;
  searchQuery: string;
  building?: string;
  minCapacity?: number;
  amenities: AmenityType[];
  onlyAvailable: boolean;
  noiseLevel?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking_confirmed' | 'reminder' | 'cancellation' | 'system';
  bookingId?: string;
}
