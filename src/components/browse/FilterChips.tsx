import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { RoomCategory } from '../../types';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface FilterChipsProps {
  selectedCategory: RoomCategory;
  onSelectCategory: (category: RoomCategory) => void;
}

interface ChipItem {
  id: RoomCategory;
  label: string;
}

const CATEGORY_CHIPS: ChipItem[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'available', label: '🟢 Còn trống' },
  { id: 'lab', label: '💻 Phòng Lab' },
  { id: 'library', label: '📚 Thư viện' },
  { id: 'large', label: '👥 Sức chứa lớn (>25)' },
  { id: 'meeting', label: '🎯 Phòng họp' },
];

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const handleSelect = (id: RoomCategory) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    onSelectCategory(id);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORY_CHIPS.map((chip) => {
          const isSelected = selectedCategory === chip.id;
          return (
            <TouchableOpacity
              key={chip.id}
              onPress={() => handleSelect(chip.id)}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                ]}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  chipUnselected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextUnselected: {
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.textWhite,
  },
});
