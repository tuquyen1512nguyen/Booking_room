import React, { useMemo } from 'react';
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
import { useRooms } from '../services/roomApi';
import { useBookingStore } from '../store/useBookingStore';
import { RoomCard } from '../components/browse/RoomCard';
import { EmptyState } from '../components/common/EmptyState';
import { COLORS, SPACING } from '../constants/theme';
import { Room } from '../types';

type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const FavoritesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProps>();

  const favorites = useBookingStore((state) => state.favorites);
  const { data: allRooms } = useRooms();

  const favoriteRooms = useMemo(() => {
    if (!allRooms) return [];
    return allRooms.filter((r) => favorites.includes(r.id));
  }, [allRooms, favorites]);

  const handleRoomPress = (room: Room) => {
    navigation.navigate('RoomDetail', { roomId: room.id });
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
        <Text style={styles.headerTitle}>Phòng Đã Lưu ({favoriteRooms.length})</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={favoriteRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <RoomCard
            room={item}
            index={index}
            onPress={() => handleRoomPress(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="Chưa Có Phòng Nào Được Lưu"
            description="Nhấn vào biểu tượng bookmark trên bất kỳ phòng học hoặc phòng Lab nào để lưu lại tại đây."
            actionTitle="Khám Phá Tất Cả Phòng"
            onActionPress={() => navigation.goBack()}
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
  listContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
});
