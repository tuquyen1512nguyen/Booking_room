import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onFilterPress: () => void;
  hasActiveFilters?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  onFilterPress,
  hasActiveFilters = false,
  placeholder = 'Tìm kiếm theo tên phòng, tòa nhà...',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={COLORS.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={onClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={onFilterPress}
        style={[
          styles.filterButton,
          hasActiveFilters && styles.filterButtonActive,
        ]}
        activeOpacity={0.8}
      >
        <Ionicons
          name="options-outline"
          size={20}
          color={hasActiveFilters ? COLORS.textWhite : COLORS.textPrimary}
        />
        {hasActiveFilters && <View style={styles.activeDot} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.sm,
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  activeDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accentBlue,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
});
