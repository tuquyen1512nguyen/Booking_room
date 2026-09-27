import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AmenityType, RoomFilterState } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from '../common/Button';

interface FilterModalProps {
  visible: boolean;
  filters: Partial<RoomFilterState>;
  onClose: () => void;
  onApply: (filters: Partial<RoomFilterState>) => void;
  onReset: () => void;
}

const BUILDINGS = [
  { id: 'all', label: 'Tất cả tòa nhà' },
  { id: 'Tòa nhà B', label: 'Tòa nhà B' },
  { id: 'Thư viện Trung tâm', label: 'Thư viện' },
  { id: 'Tòa nhà khu E', label: 'Tòa nhà khu E' },
  { id: 'Tòa nhà eSTI', label: 'Tòa nhà eSTI' },
  { id: 'Khu Nghiên cứu Chuyên sâu', label: 'Khu Nghiên cứu' },
  { id: 'Tòa nhà Điều hành', label: 'Tòa Điều hành' },
  { id: 'Tòa nhà Trung tâm sinh viên', label: 'TT Sinh viên' },
];

const CAPACITIES = [
  { value: 0, label: 'Tất cả' },
  { value: 4, label: 'Từ 4+ chỗ' },
  { value: 10, label: 'Từ 10+ chỗ' },
  { value: 20, label: 'Từ 20+ chỗ' },
  { value: 30, label: 'Từ 30+ chỗ' },
];

const AMENITIES_LIST: { id: AmenityType; name: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'wifi', name: 'Wi-Fi Tốc Độ Cao', icon: 'wifi-outline' },
  { id: 'ac', name: 'Điều Hòa Không Khí', icon: 'snow-outline' },
  { id: 'power', name: 'Ổ Cắm Điện Tiện Lợi', icon: 'flash-outline' },
  { id: 'projector', name: 'Máy Chiếu HD', icon: 'videocam-outline' },
  { id: 'whiteboard', name: 'Bảng Viết Kính', icon: 'easel-outline' },
  { id: 'soundproof', name: 'Cách Âm Tốt', icon: 'volume-mute-outline' },
  { id: 'tv', name: 'Smart TV Trình Chiếu', icon: 'tv-outline' },
  { id: 'computers', name: 'Máy Tính Cấu Hình Cao', icon: 'desktop-outline' },
  { id: 'wheelchair', name: 'Lối Đi Người Khuyết Tật', icon: 'accessibility-outline' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  onClose,
  onApply,
  onReset,
}) => {
  const [building, setBuilding] = useState<string>(filters.building || 'all');
  const [minCapacity, setMinCapacity] = useState<number>(filters.minCapacity || 0);
  const [amenities, setAmenities] = useState<AmenityType[]>(filters.amenities || []);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(filters.onlyAvailable || false);

  const toggleAmenity = (id: AmenityType) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApply({
      building: building === 'all' ? undefined : building,
      minCapacity: minCapacity === 0 ? undefined : minCapacity,
      amenities,
      onlyAvailable,
    });
    onClose();
  };

  const handleReset = () => {
    setBuilding('all');
    setMinCapacity(0);
    setAmenities([]);
    setOnlyAvailable(false);
    onReset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, SHADOWS.floating]} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bộ Lọc Phòng Học</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Chuyển đổi chỉ phòng còn trống */}
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchTitle}>Chỉ hiển thị phòng còn trống</Text>
                <Text style={styles.switchSub}>Ẩn các phòng đang bận hoặc kín lịch</Text>
              </View>
              <Switch
                value={onlyAvailable}
                onValueChange={setOnlyAvailable}
                trackColor={{ false: COLORS.border, true: COLORS.accentIndigo }}
                thumbColor={COLORS.surface}
              />
            </View>

            <View style={styles.divider} />

            {/* Chọn tòa nhà */}
            <Text style={styles.sectionLabel}>Tòa nhà / Khu vực</Text>
            <View style={styles.chipGrid}>
              {BUILDINGS.map((b) => {
                const isSelected = building === b.id;
                return (
                  <TouchableOpacity
                    key={b.id}
                    onPress={() => setBuilding(b.id)}
                    style={[
                      styles.chip,
                      isSelected ? styles.chipSelected : styles.chipUnselected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                      ]}
                    >
                      {b.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            {/* Sức chứa tối thiểu */}
            <Text style={styles.sectionLabel}>Sức chứa tối thiểu</Text>
            <View style={styles.chipGrid}>
              {CAPACITIES.map((c) => {
                const isSelected = minCapacity === c.value;
                return (
                  <TouchableOpacity
                    key={c.value}
                    onPress={() => setMinCapacity(c.value)}
                    style={[
                      styles.chip,
                      isSelected ? styles.chipSelected : styles.chipUnselected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                      ]}
                    >
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            {/* Tiện ích & Thiết bị */}
            <Text style={styles.sectionLabel}>Trang thiết bị & Tiện ích</Text>
            <View style={styles.amenitiesGrid}>
              {AMENITIES_LIST.map((item) => {
                const isChecked = amenities.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => toggleAmenity(item.id)}
                    style={[
                      styles.amenityItem,
                      isChecked && styles.amenityItemSelected,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={isChecked ? COLORS.accentIndigo : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.amenityName,
                        isChecked && styles.amenityNameSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {isChecked && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={COLORS.accentIndigo}
                        style={styles.checkIcon}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Nút hành động */}
          <View style={styles.footer}>
            <Button
              title="Đặt lại"
              onPress={handleReset}
              variant="outline"
              size="md"
              style={styles.resetBtn}
            />
            <Button
              title="Áp dụng bộ lọc"
              onPress={handleApply}
              variant="primary"
              size="md"
              style={styles.applyBtn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '85%',
    paddingTop: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollBody: {
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  switchSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  chipUnselected: {
    backgroundColor: COLORS.surfaceSubtle,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextUnselected: {
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.textWhite,
  },
  amenitiesGrid: {
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  amenityItemSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  amenityName: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  amenityNameSelected: {
    fontWeight: '600',
    color: COLORS.accentIndigo,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: SPACING.screenPadding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  resetBtn: {
    flex: 1,
  },
  applyBtn: {
    flex: 2,
  },
});
