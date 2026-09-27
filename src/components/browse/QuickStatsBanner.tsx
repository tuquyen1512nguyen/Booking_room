import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { useCampusStats } from '../../services/roomApi';

export const QuickStatsBanner: React.FC = () => {
  const { data: stats } = useCampusStats();

  return (
    <View style={[styles.container, SHADOWS.subtle]}>
      <View style={styles.statItem}>
        <View style={[styles.iconCircle, { backgroundColor: COLORS.successLight }]}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
        </View>
        <View>
          <Text style={styles.statValue}>{stats?.availableRooms ?? 6} Phòng trống</Text>
          <Text style={styles.statLabel}>Sẵn sàng đặt chỗ</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <View style={[styles.iconCircle, { backgroundColor: COLORS.blueLight }]}>
          <Ionicons name="time" size={20} color={COLORS.accentBlue} />
        </View>
        <View>
          <Text style={styles.statValue}>07:30 - 22:00</Text>
          <Text style={styles.statLabel}>Giờ mở cửa </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
});
