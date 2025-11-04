import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
  TextInput,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useTheme } from '../contexts/ThemeContext';
import { TodoItem } from '../components/TodoItem';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
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
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const handleAddTodo = useCallback(() => {
    if (newTodoText.trim()) {
      createTodo({
        title: newTodoText.trim(),
        dueDate: newTodoDueDate?.getTime()
      });
      setNewTodoText('');
      setNewTodoDueDate(undefined);
      setIsTyping(false);
      Keyboard.dismiss();
    }
  }, [newTodoText, newTodoDueDate, createTodo]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewTodoDueDate(selectedDate);
    }
  };

  const handleEditTodo = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setIsModalVisible(true);
  }, []);

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
      setEditingTodo(null);
    },
    [editingTodo, createTodo, updateTodo]
  );

  const handleCloseSearch = useCallback(() => {
    setIsSearchVisible(false);
    setSearchQuery('');
  }, []);

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

  const ListFooter = () => (
    <View style={[styles.statsRow, { borderTopColor: theme.colors.border }]}>
      <Text style={[styles.statsText, { color: theme.colors.textSecondary }]}>
        {stats.active} items left
      </Text>
      {stats.completed > 0 && (
        <TouchableOpacity onPress={() => clearCompleted()}>
          <Text style={[styles.clearText, { color: theme.colors.textSecondary }]}>
            Clear Completed
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.isCompleted).length,
    completed: todos.filter((t) => t.isCompleted).length,
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-done-outline" size={80} color={theme.colors.inactive} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No todos yet
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.colors.text === '#F1F5F9' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Gradient Header */}
      <LinearGradient
        colors={theme.colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.headerContainer}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <Text style={styles.title}>T O D O</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={() => {
                    if (isSearchVisible) {
                      handleCloseSearch();
                    } else {
                      setIsSearchVisible(true);
                    }
                  }}
                  style={styles.searchIcon}
                >
                  <Ionicons
                    name={isSearchVisible ? "close" : "search"}
                    size={28}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                <ThemeSwitcher />
              </View>
            </View>

            {/* Search Input (Collapsible) */}
            {isSearchVisible && (
              <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
                <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: theme.colors.text }]}
                  placeholder="Search todos..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Add Todo Input - Only show when search is not visible */}
            {!isSearchVisible && (
              <View style={[styles.addTodoContainer, { backgroundColor: theme.colors.card }]}>
                <TextInput
                  style={[styles.addTodoInput, { color: theme.colors.text }]}
                  placeholder="Create a new todo..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newTodoText}
                  onChangeText={setNewTodoText}
                  onSubmitEditing={handleAddTodo}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color={newTodoDueDate ? theme.colors.primary : theme.colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { backgroundColor: theme.colors.primary }
                  ]}
                  onPress={handleAddTodo}
                  disabled={!newTodoText.trim()}
                >
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={newTodoDueDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>
            )}
          </SafeAreaView>
        </View>
      </LinearGradient>

      {/* Todo List - Card Background */}
      <View style={[styles.listContainer, { backgroundColor: theme.colors.background }]}>
        {todos === undefined ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : filteredTodos.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.desktopContainer}>
            <View style={[styles.todoCard, { backgroundColor: theme.colors.card }]}>
              <DraggableFlatList
                data={filteredTodos}
                renderItem={renderTodoItem}
                keyExtractor={(item) => item._id}
                onDragEnd={({ data }) => handleReorder(data)}
                ListFooterComponent={ListFooter}
                contentContainerStyle={styles.listContent}
              />
            </View>

            {/* Bottom Section - Sticky - Only show when there are todos */}
            {todos.length > 0 && (
              <View style={[styles.bottomSection, { backgroundColor: theme.colors.card }]}>
                {/* Filter Tabs */}
                <View style={styles.filterContainer}>
                  {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
                    <TouchableOpacity
                      key={filterType}
                      style={[
                        styles.filterTab,
                        filter === filterType && {
                          borderBottomWidth: 2,
                          borderBottomColor: theme.colors.primary,
                        },
                      ]}
                      onPress={() => setFilter(filterType)}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          {
                            color:
                              filter === filterType ? theme.colors.primary : theme.colors.textSecondary,
                            fontWeight: filter === filterType ? '600' : '400',
                          },
                        ]}
                      >
                        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.dragText, { color: theme.colors.textSecondary }]}>
                  Drag and drop to reorder list
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Add/Edit Todo Modal */}
      <AddTodoModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  desktopContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  headerContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  gradientHeader: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 60
  },
  safeArea: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchIcon: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  addTodoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  addTodoInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  iconButton: {
    padding: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
    marginTop: 0,
    paddingTop: 20,
  },
  todoCard: {
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    marginTop: -40
  },
  listContent: {
    paddingBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  statsText: {
    fontSize: 14,
  },
  clearText: {
    fontSize: 14,
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
  bottomSection: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 16,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterText: {
    fontSize: 14,
  },
  dragText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
