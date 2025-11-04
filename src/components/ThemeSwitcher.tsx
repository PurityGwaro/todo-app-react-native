import React from 'react';
import { TouchableOpacity, Animated, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [animation] = React.useState(new Animated.Value(isDark ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDark]);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surface, theme.colors.surface],
  });

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
      ]}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconContainer, { backgroundColor }]}>
        {isDark ? (
          <Ionicons name="moon" size={20} color={theme.colors.primary} />
        ) : (
          <Ionicons name="sunny" size={20} color={theme.colors.primary} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  iconContainer: {
    borderRadius: 20,
    padding: 4,
  },
});
