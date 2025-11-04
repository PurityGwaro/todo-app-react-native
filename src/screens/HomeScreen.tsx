import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useTheme } from '../contexts/ThemeContext';
import { TodoItem } from '../components/TodoItem';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { AddTodoModal } from '../components/AddTodoModal';
import { Todo } from '../types';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

type FilterType = 'all' | 'active' | 'completed';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const todos = useQuery(api.todos.getTodos) || [];
  const createTodo = useMutation(api.todos.createTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const reorderTodos = useMutation(api.todos.reorderTodos);
  const clearCompleted = useMutation(api.todos.clearCompleted);

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'active') return !todo.isCompleted;
      if (filter === 'completed') return todo.isCompleted;
      return true;
    })
    .filter((todo) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        todo.title.toLowerCase().includes(query) ||
        todo.description?.toLowerCase().includes(query)
      );
    });

  const handleToggleTodo = useCallback(
    (id: string) => {
      toggleTodo({ id: id as Id<'todos'> });
    },
    [toggleTodo]
  );

  const handleDeleteTodo = useCallback(
    (id: string) => {
      deleteTodo({ id: id as Id<'todos'> });
    },
    [deleteTodo]
  );

  const handleEditTodo = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setIsAddModalVisible(true);
  }, []);

  const handleReorder = useCallback(
    (data: Todo[]) => {
      const updates = data.map((item, index) => ({
        id: item._id as Id<'todos'>,
        order: index,
      }));
      reorderTodos({ updates });
    },
    [reorderTodos]
  );

  const handleSaveTodo = useCallback(
    (title: string, description?: string, dueDate?: number) => {
      if (editingTodo) {
        updateTodo({
          id: editingTodo._id as Id<'todos'>,
          title,
          description,
          dueDate,
        });
      } else {
        createTodo({ title, description, dueDate });
      }
    },
    [editingTodo, createTodo, updateTodo]
  );

  const renderTodoItem = ({ item, drag, isActive }: RenderItemParams<Todo>) => (
    <ScaleDecorator>
      <TodoItem
        todo={item}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
        onEdit={handleEditTodo}
        drag={drag}
        isActive={isActive}
      />
    </ScaleDecorator>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-done-outline" size={80} color={theme.colors.inactive} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No todos yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Add a new todo to get started
      </Text>
    </View>
  );

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.isCompleted).length,
    completed: todos.filter((t) => t.isCompleted).length,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={theme.colors.text === '#F1F5F9' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.colors.text }]}>My Todos</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {stats.active} active, {stats.completed} completed
          </Text>
        </View>
        <ThemeSwitcher />
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search todos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Ionicons name="search" size={20} color={theme.colors.textSecondary} />}
        />
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterTab,
              {
                backgroundColor:
                  filter === filterType ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setFilter(filterType)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    filter === filterType ? '#FFFFFF' : theme.colors.textSecondary,
                },
              ]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {todos === undefined ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filteredTodos.length === 0 ? (
        <EmptyState />
      ) : (
        <DraggableFlatList
          data={filteredTodos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item._id}
          onDragEnd={({ data }) => handleReorder(data)}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            ...theme.shadows.lg,
          },
        ]}
        onPress={() => {
          setEditingTodo(null);
          setIsAddModalVisible(true);
        }}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {stats.completed > 0 && (
        <View style={styles.clearButtonContainer}>
          <Button
            title={`Clear ${stats.completed} Completed`}
            variant="outline"
            size="small"
            onPress={() => clearCompleted()}
          />
        </View>
      )}

      <AddTodoModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
  },
});
