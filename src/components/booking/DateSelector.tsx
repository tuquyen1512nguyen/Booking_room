import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface DateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  daysCount?: number;
}

interface DateOption {
  dateString: string; // "2026-09-27"
  dayName: string; // "CN", "T2"
  dayNumber: string; // "27"
  monthName: string; // "Thg 9"
  isToday: boolean;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
  daysCount = 14,
}) => {
  // Tạo danh sách các ngày kể từ ngày tham chiếu (27/09/2026)
  const dateOptions = React.useMemo(() => {
    const dates: DateOption[] = [];
    const baseDate = new Date(2026, 8, 27); // Tháng 9 (index 8)

    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < daysCount; i++) {
      const current = new Date(baseDate);
      current.setDate(baseDate.getDate() + i);

      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;

      dates.push({
        dateString,
        dayName: i === 0 ? 'Hôm nay' : dayNames[current.getDay()],
        dayNumber: String(current.getDate()),
        monthName: `Thg ${current.getMonth() + 1}`,
        isToday: i === 0,
      });
    }

    return dates;
  }, [daysCount]);

  const handleSelect = (dateStr: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    onSelectDate(dateStr);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Chọn ngày</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dateOptions.map((item) => {
          const isSelected = selectedDate === item.dateString;

          return (
            <TouchableOpacity
              key={item.dateString}
              onPress={() => handleSelect(item.dateString)}
              style={[
                styles.dateCard,
                isSelected ? styles.dateCardSelected : styles.dateCardUnselected,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayName,
                  isSelected ? styles.textSelected : styles.textUnselected,
                ]}
              >
                {item.dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected ? styles.textSelected : styles.dayNumberUnselected,
                ]}
              >
                {item.dayNumber}
              </Text>
              <Text
                style={[
                  styles.monthName,
                  isSelected ? styles.textSelectedLight : styles.textMuted,
                ]}
              >
                {item.monthName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.screenPadding,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
    gap: 10,
  },
  dateCard: {
    width: 68,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dateCardUnselected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  dateCardSelected: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  dayNumberUnselected: {
    color: COLORS.textPrimary,
  },
  monthName: {
    fontSize: 11,
    fontWeight: '500',
  },
  textUnselected: {
    color: COLORS.textSecondary,
  },
  textSelected: {
    color: COLORS.textWhite,
  },
  textSelectedLight: {
    color: '#94A3B8',
  },
  textMuted: {
    color: COLORS.textMuted,
  },
});
