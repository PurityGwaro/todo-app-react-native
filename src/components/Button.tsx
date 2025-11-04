import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = false,
  style,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: variant === 'outline' ? 1 : 0,
    };

    if (size === 'small') {
      baseStyle.paddingVertical = theme.spacing.xs;
      baseStyle.paddingHorizontal = theme.spacing.md;
    } else if (size === 'large') {
      baseStyle.paddingVertical = theme.spacing.md;
      baseStyle.paddingHorizontal = theme.spacing.xl;
    } else {
      baseStyle.paddingVertical = theme.spacing.sm;
      baseStyle.paddingHorizontal = theme.spacing.lg;
    }

    if (variant === 'primary') {
      baseStyle.backgroundColor = disabled ? theme.colors.inactive : theme.colors.primary;
    } else if (variant === 'secondary') {
      baseStyle.backgroundColor = disabled ? theme.colors.inactive : theme.colors.secondary;
    } else if (variant === 'outline') {
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderColor = disabled ? theme.colors.inactive : theme.colors.primary;
    } else if (variant === 'ghost') {
      baseStyle.backgroundColor = 'transparent';
    }

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };

    if (size === 'small') {
      baseStyle.fontSize = theme.typography.caption.fontSize;
    } else if (size === 'large') {
      baseStyle.fontSize = theme.typography.h3.fontSize;
    } else {
      baseStyle.fontSize = theme.typography.body.fontSize;
    }

    if (variant === 'primary' || variant === 'secondary') {
      baseStyle.color = '#FFFFFF';
    } else if (variant === 'outline' || variant === 'ghost') {
      baseStyle.color = disabled ? theme.colors.inactive : theme.colors.primary;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : theme.colors.primary} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
