import { useQuery } from '@tanstack/react-query';
import { MOCK_ROOMS } from '../data/mockRooms';
import { Room, RoomFilterState } from '../types';

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const roomApiService = {
  getRooms: async (filter?: Partial<RoomFilterState>): Promise<Room[]> => {
    await delay(300); // realistic query latency

    let rooms = [...MOCK_ROOMS];

    if (!filter) return rooms;

    // Filter by Category
    if (filter.category && filter.category !== 'all') {
      if (filter.category === 'available') {
        rooms = rooms.filter((r) => r.status === 'available');
      } else if (filter.category === 'large') {
        rooms = rooms.filter((r) => r.capacity >= 25);
      } else {
        rooms = rooms.filter((r) => r.category === filter.category);
      }
    }

    // Filter by Search text (Name, Code, Building, Description)
    if (filter.searchQuery && filter.searchQuery.trim().length > 0) {
      const q = filter.searchQuery.toLowerCase().trim();
      rooms = rooms.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.building.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    // Filter by Building
    if (filter.building && filter.building !== 'all') {
      rooms = rooms.filter((r) => r.building === filter.building);
    }

    // Filter by Minimum Capacity
    if (filter.minCapacity && filter.minCapacity > 0) {
      rooms = rooms.filter((r) => r.capacity >= (filter.minCapacity || 0));
    }

    // Filter by only Available
    if (filter.onlyAvailable) {
      rooms = rooms.filter((r) => r.status === 'available');
    }

    // Filter by Amenities
    if (filter.amenities && filter.amenities.length > 0) {
      rooms = rooms.filter((r) =>
        filter.amenities!.every((reqAmenity) => r.amenities.includes(reqAmenity))
      );
    }

    return rooms;
  },

  getRoomById: async (id: string): Promise<Room | null> => {
    await delay(200);
    const room = MOCK_ROOMS.find((r) => r.id === id);
    return room || null;
  },

  getCampusStats: async () => {
    await delay(150);
    const total = MOCK_ROOMS.length;
    const available = MOCK_ROOMS.filter((r) => r.status === 'available').length;
    const occupied = total - available;
    return {
      totalRooms: total,
      availableRooms: available,
      occupiedRooms: occupied,
      campusOpeningHours: '07:30 - 22:00',
    };
  },
};

// React Query Hooks
export const QUERY_KEYS = {
  rooms: (filters?: Partial<RoomFilterState>) => ['rooms', filters] as const,
  roomDetail: (id: string) => ['room', id] as const,
  campusStats: ['campus-stats'] as const,
};

export const useRooms = (filters?: Partial<RoomFilterState>) => {
  return useQuery({
    queryKey: QUERY_KEYS.rooms(filters),
    queryFn: () => roomApiService.getRooms(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useRoomDetail = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.roomDetail(id),
    queryFn: () => roomApiService.getRoomById(id),
    enabled: !!id,
  });
};

export const useCampusStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.campusStats,
    queryFn: () => roomApiService.getCampusStats(),
  });
};
