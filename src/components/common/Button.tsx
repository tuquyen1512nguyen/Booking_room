import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.97, { damping: 12, stiffness: 200 });
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const getContainerStyles = () => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.md,
      width: fullWidth ? '100%' : undefined,
    };

    // Size
    switch (size) {
      case 'sm':
        base.paddingVertical = SPACING.xs;
        base.paddingHorizontal = SPACING.sm;
        base.borderRadius = RADIUS.sm;
        break;
      case 'lg':
        base.paddingVertical = SPACING.md;
        base.paddingHorizontal = SPACING.xl;
        base.borderRadius = RADIUS.lg;
        break;
      case 'md':
      default:
        base.paddingVertical = 12;
        base.paddingHorizontal = SPACING.lg;
        break;
    }

    // Variant
    switch (variant) {
      case 'secondary':
        base.backgroundColor = COLORS.blueLight;
        base.borderWidth = 1;
        base.borderColor = COLORS.blueBorder;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1.5;
        base.borderColor = COLORS.borderDark;
        break;
      case 'danger':
        base.backgroundColor = COLORS.danger;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'primary':
      default:
        base.backgroundColor = COLORS.primaryDark;
        break;
    }

    if (disabled) {
      base.opacity = 0.5;
    }

    return base;
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return COLORS.accentBlue;
      case 'outline':
        return COLORS.textPrimary;
      case 'ghost':
        return COLORS.textPrimary;
      case 'danger':
        return COLORS.textWhite;
      case 'primary':
      default:
        return COLORS.textWhite;
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[styles.base, getContainerStyles(), animatedStyle, style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={styles.loader}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Animated.View style={styles.iconLeft}>{icon}</Animated.View>
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: size === 'sm' ? 13 : size === 'lg' ? 16 : 14,
                fontWeight: '600',
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Animated.View style={styles.iconRight}>{icon}</Animated.View>
          )}
        </>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    letterSpacing: -0.2,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loader: {
    paddingVertical: 2,
  },
});
