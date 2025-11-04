import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  drag?: () => void;
  isActive?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  drag,
  isActive = false,
}) => {
  const { theme } = useTheme();

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (timestamp?: number) => {
    if (!timestamp) return false;
    return timestamp < Date.now() && !todo.isCompleted;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
        isActive && { opacity: 0.5 },
      ]}
    >
      <TouchableOpacity
        onPress={() => onToggle(todo._id)}
        style={styles.checkbox}
      >
        <View
          style={[
            styles.checkboxInner,
            {
              borderColor: todo.isCompleted
                ? theme.colors.completed
                : theme.colors.border,
              backgroundColor: todo.isCompleted
                ? theme.colors.completed
                : 'transparent',
            },
          ]}
        >
          {todo.isCompleted && (
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.content}
        onPress={() => onEdit(todo)}
      >
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
              textDecorationLine: todo.isCompleted ? 'line-through' : 'none',
              opacity: todo.isCompleted ? 0.6 : 1,
            },
          ]}
          numberOfLines={1}
        >
          {todo.title}
        </Text>

        {todo.description && (
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textDecorationLine: todo.isCompleted ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={2}
          >
            {todo.description}
          </Text>
        )}

        {todo.dueDate && (
          <View style={styles.dateContainer}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={
                isOverdue(todo.dueDate)
                  ? theme.colors.error
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.date,
                {
                  color: isOverdue(todo.dueDate)
                    ? theme.colors.error
                    : theme.colors.textSecondary,
                },
              ]}
            >
              {formatDate(todo.dueDate)}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.actions}>
        {drag && (
          <TouchableOpacity onLongPress={drag} style={styles.dragButton}>
            <Ionicons
              name="reorder-two"
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => onDelete(todo._id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  dragButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
});
