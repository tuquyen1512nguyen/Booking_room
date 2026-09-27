import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { useRooms } from '../services/roomApi';
import { useBookingStore } from '../store/useBookingStore';
import { RoomCategory, RoomFilterState, Room } from '../types';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { SearchBar } from '../components/browse/SearchBar';
import { FilterChips } from '../components/browse/FilterChips';
import { RoomCard } from '../components/browse/RoomCard';
import { QuickStatsBanner } from '../components/browse/QuickStatsBanner';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { EmptyState } from '../components/common/EmptyState';
import { FilterModal } from '../components/modals/FilterModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BrowseScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const user = useBookingStore((state) => state.user);
  const notifications = useBookingStore((state) => state.notifications);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] = useState<Partial<RoomFilterState>>({
    building: undefined,
    minCapacity: undefined,
    amenities: [],
    onlyAvailable: false,
  });

  // Query Params combined
  const queryFilterParams = useMemo(() => {
    return {
      category: selectedCategory,
      searchQuery,
      building: advancedFilters.building,
      minCapacity: advancedFilters.minCapacity,
      amenities: advancedFilters.amenities,
      onlyAvailable: advancedFilters.onlyAvailable,
    };
  }, [selectedCategory, searchQuery, advancedFilters]);

  // TanStack Query
  const {
    data: rooms,
    isLoading,
    isRefetching,
    refetch,
  } = useRooms(queryFilterParams);

  const hasActiveAdvancedFilters = useMemo(() => {
    return Boolean(
      advancedFilters.building ||
      (advancedFilters.minCapacity && advancedFilters.minCapacity > 0) ||
      (advancedFilters.amenities && advancedFilters.amenities.length > 0) ||
      advancedFilters.onlyAvailable
    );
  }, [advancedFilters]);

  const handleRoomPress = (room: Room) => {
    navigation.navigate('RoomDetail', { roomId: room.id });
  };

  const handleApplyAdvancedFilters = (newFilters: Partial<RoomFilterState>) => {
    setAdvancedFilters(newFilters);
  };

  const handleResetFilters = () => {
    setAdvancedFilters({
      building: undefined,
      minCapacity: undefined,
      amenities: [],
      onlyAvailable: false,
    });
    setSelectedCategory('all');
    setSearchQuery('');
  };

  // Header component for FlatList
  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Top Welcome Bar */}
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greetingTitle}>
            Chào buổi sáng, {user.fullName.split(' ').pop()} 👋
          </Text>
          <Text style={styles.greetingSubtitle}>Tìm không gian học tập lý tưởng của bạn</Text>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Favorites')}
            style={styles.actionIconButton}
            activeOpacity={0.8}
          >
            <Ionicons name="bookmark-outline" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={styles.actionIconButton}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.textPrimary} />
            {unreadNotifsCount > 0 && (
              <View style={styles.badgeNotif}>
                <Text style={styles.badgeNotifText}>{unreadNotifsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Campus Banner */}
      <QuickStatsBanner />

      {/* Search Input */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
        onFilterPress={() => setFilterModalVisible(true)}
        hasActiveFilters={hasActiveAdvancedFilters}
      />

      {/* Category Chips */}
      <FilterChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Section Title */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Phòng Học Phổ Biến</Text>
        <Text style={styles.resultCount}>
          {rooms ? `${rooms.length} phòng` : 'Đang tải...'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          {renderHeader()}
          <View style={{ paddingHorizontal: SPACING.screenPadding }}>
            <SkeletonCard />
            <SkeletonCard />
          </View>
        </View>
      ) : (
        <FlatList
          data={rooms || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <RoomCard
              room={item}
              index={index}
              onPress={() => handleRoomPress(item)}
            />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              icon="school-outline"
              title="Không Tìm Thấy Phòng Phù Hợp"
              description="Không có phòng nào thỏa mãn tiêu chí tìm kiếm hoặc bộ lọc hiện tại của bạn."
              actionTitle="Đặt lại tất cả bộ lọc"
              onActionPress={handleResetFilters}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={COLORS.accentIndigo}
              colors={[COLORS.accentIndigo]}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        filters={advancedFilters}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyAdvancedFilters}
        onReset={handleResetFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: SPACING.xxl + 24,
  },
  listHeader: {
    paddingTop: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.md,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeNotif: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  badgeNotifText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  resultCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
