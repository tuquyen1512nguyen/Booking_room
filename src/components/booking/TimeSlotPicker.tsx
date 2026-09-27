import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TIME_SLOTS } from '../../data/mockRooms';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface TimeSlotPickerProps {
  bookedSlots: string[];
  selectedSlots: string[];
  onToggleSlot: (slot: string) => void;
  maxSlots?: number;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  bookedSlots,
  selectedSlots,
  onToggleSlot,
  maxSlots = 3,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isNarrowScreen = windowWidth < 360;

  const handleSlotPress = (slot: string, isBooked: boolean) => {
    if (isBooked) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {}
      return;
    }

    try {
      Haptics.selectionAsync();
    } catch {}
    onToggleSlot(slot);
  };

  // Nhóm slot theo Sáng, Chiều, Tối
  const morningSlots = TIME_SLOTS.slice(0, 4); // 08:00 - 12:00
  const afternoonSlots = TIME_SLOTS.slice(4, 8); // 12:00 - 16:00
  const eveningSlots = TIME_SLOTS.slice(8); // 16:00 - 21:00

  const renderSlotGrid = (slots: string[], title: string, icon: keyof typeof Ionicons.glyphMap) => {
    return (
      <View style={styles.periodGroup}>
        <View style={styles.periodHeader}>
          <Ionicons name={icon} size={16} color={COLORS.textSecondary} />
          <Text style={styles.periodTitle}>{title}</Text>
        </View>

        <View style={styles.grid}>
          {slots.map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            const isSelected = selectedSlots.includes(slot);

            return (
              <TouchableOpacity
                key={slot}
                onPress={() => handleSlotPress(slot, isBooked)}
                disabled={isBooked}
                style={[
                  styles.slotChip,
                  isNarrowScreen && styles.slotChipNarrow,
                  isSelected && styles.slotSelected,
                  isBooked && styles.slotBooked,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.slotContent}>
                  <Text
                    style={[
                      styles.slotTimeText,
                      isNarrowScreen && { fontSize: 13 },
                      isSelected && styles.slotTimeTextSelected,
                      isBooked && styles.slotTimeTextBooked,
                    ]}
                  >
                    {slot.split(' - ')[0]}
                  </Text>
                  <Text
                    style={[
                      styles.slotEndTimeText,
                      isSelected && styles.slotEndTimeTextSelected,
                      isBooked && styles.slotEndTimeTextBooked,
                    ]}
                  >
                    đến {slot.split(' - ')[1]}
                  </Text>
                </View>

                {isBooked ? (
                  <View style={styles.bookedBadge}>
                    <Text style={styles.bookedBadgeText}>Đã đặt</Text>
                  </View>
                ) : isSelected ? (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color={COLORS.textWhite} />
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Chọn khung giờ</Text>
        <Text style={styles.limitHint}>Tối đa {maxSlots}h/buổi</Text>
      </View>

      {/* Chú thích màu */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.surface, borderColor: COLORS.border }]} />
          <Text style={styles.legendLabel}>Còn trống</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.accentIndigo }]} />
          <Text style={styles.legendLabel}>Đang chọn</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.dangerLight, borderColor: COLORS.dangerBorder }]} />
          <Text style={styles.legendLabel}>Đã có người đặt</Text>
        </View>
      </View>

      {renderSlotGrid(morningSlots, 'Buổi sáng (08:00 - 12:00)', 'sunny-outline')}
      {renderSlotGrid(afternoonSlots, 'Buổi chiều (12:00 - 16:00)', 'partly-sunny-outline')}
      {renderSlotGrid(eveningSlots, 'Buổi tối (16:00 - 21:00)', 'moon-outline')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  limitHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  legendLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  periodGroup: {
    marginBottom: SPACING.md,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  periodTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotChip: {
    flexBasis: '47%',
    flexGrow: 1,
    minWidth: 135,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  slotChipNarrow: {
    minWidth: 120,
    paddingHorizontal: 8,
  },
  slotSelected: {
    backgroundColor: COLORS.accentIndigo,
    borderColor: COLORS.accentIndigo,
  },
  slotBooked: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    opacity: 0.85,
  },
  slotContent: {
    flexDirection: 'column',
  },
  slotTimeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  slotTimeTextSelected: {
    color: COLORS.textWhite,
  },
  slotTimeTextBooked: {
    color: COLORS.dangerDark,
    textDecorationLine: 'line-through',
  },
  slotEndTimeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  slotEndTimeTextSelected: {
    color: '#E0E7FF',
  },
  slotEndTimeTextBooked: {
    color: COLORS.danger,
  },
  bookedBadge: {
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
  },
  bookedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.dangerDark,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
