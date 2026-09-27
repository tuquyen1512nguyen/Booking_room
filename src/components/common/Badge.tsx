import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { RoomStatus, BookingStatus } from '../../types';

interface BadgeProps {
  label: string;
  variant?: 'available' | 'occupied' | 'upcoming' | 'completed' | 'cancelled' | 'neutral' | 'indigo' | 'warning';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  icon,
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'available':
        return {
          bg: COLORS.successLight,
          text: COLORS.successDark,
          border: COLORS.successBorder,
          dot: COLORS.success,
        };
      case 'occupied':
        return {
          bg: COLORS.dangerLight,
          text: COLORS.dangerDark,
          border: COLORS.dangerBorder,
          dot: COLORS.danger,
        };
      case 'upcoming':
        return {
          bg: COLORS.blueLight,
          text: COLORS.accentBlue,
          border: COLORS.blueBorder,
          dot: COLORS.accentBlue,
        };
      case 'completed':
        return {
          bg: COLORS.surfaceSubtle,
          text: COLORS.textSecondary,
          border: COLORS.border,
          dot: COLORS.textSecondary,
        };
      case 'cancelled':
        return {
          bg: COLORS.dangerLight,
          text: COLORS.dangerDark,
          border: COLORS.dangerBorder,
          dot: COLORS.danger,
        };
      case 'indigo':
        return {
          bg: '#EEF2FF',
          text: COLORS.accentIndigo,
          border: '#C7D2FE',
          dot: COLORS.accentIndigo,
        };
      case 'warning':
        return {
          bg: COLORS.warningLight,
          text: COLORS.warningDark,
          border: COLORS.warningBorder,
          dot: COLORS.warning,
        };
      case 'neutral':
      default:
        return {
          bg: COLORS.surfaceSubtle,
          text: COLORS.textSecondary,
          border: COLORS.border,
          dot: null,
        };
    }
  };

  const colors = getColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 6 : 10,
        },
        style,
      ]}
    >
      {colors.dot && (
        <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      )}
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: isSmall ? 11 : 12,
            fontWeight: isSmall ? '500' : '600',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    textTransform: 'capitalize',
  },
});
