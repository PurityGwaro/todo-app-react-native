import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
          borderBottomColor: theme.colors.border,
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
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.content} onPress={() => onEdit(todo)}>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                textDecorationLine: todo.isCompleted ? 'line-through' : 'none',
                opacity: todo.isCompleted ? 0.5 : 1,
              },
            ]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>

          {todo.dueDate && (
            <View style={styles.dueDateContainer}>
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
                  styles.dueDate,
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
        </View>
      </TouchableOpacity>

      <TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
        <Ionicons name="menu" size={24} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onDelete(todo._id)}
        style={styles.deleteButton}
      >
        <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  checkbox: {
    marginRight: 16,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  dueDate: {
    fontSize: 13,
  },
  dragHandle: {
    padding: 4,
    marginLeft: 8,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
});
