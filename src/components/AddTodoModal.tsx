import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../contexts/ThemeContext';
import { Input } from './Input';
import { Button } from './Button';
import { Todo } from '../types';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description?: string, dueDate?: number) => void;
  editingTodo?: Todo | null;
}

export const AddTodoModal: React.FC<AddTodoModalProps> = ({
  visible,
  onClose,
  onSave,
  editingTodo,
}) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
      setDueDate(editingTodo.dueDate ? new Date(editingTodo.dueDate) : undefined);
    } else {
      resetForm();
    }
  }, [editingTodo, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(undefined);
    setErrors({});
  };

  const handleSave = () => {
    if (!title.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }

    onSave(
      title.trim(),
      description.trim() || undefined,
      dueDate?.getTime()
    );

    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'No date selected';
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCancel}
        />

        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.background,
              ...theme.shadows.lg,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {editingTodo ? 'Edit Todo' : 'New Todo'}
            </Text>
            <TouchableOpacity onPress={handleCancel}>
              <Ionicons name="close" size={28} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Input
              label="Title *"
              placeholder="Enter todo title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setErrors({});
              }}
              error={errors.title}
              autoFocus
            />

            <Input
              label="Description"
              placeholder="Enter description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: 'top' }}
            />

            <View style={styles.dateSection}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Due Date
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.dateText,
                    { color: dueDate ? theme.colors.text : theme.colors.textSecondary },
                  ]}
                >
                  {formatDate(dueDate)}
                </Text>
              </TouchableOpacity>

              {dueDate && (
                <TouchableOpacity
                  style={styles.clearDateButton}
                  onPress={() => setDueDate(undefined)}
                >
                  <Text style={[styles.clearDateText, { color: theme.colors.error }]}>
                    Clear Date
                  </Text>
                </TouchableOpacity>
              )}

              {showDatePicker && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={handleCancel}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title={editingTodo ? 'Update' : 'Create'}
              variant="primary"
              onPress={handleSave}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderRadius: 24,
    paddingTop: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 24,
    maxHeight: 500,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  clearDateButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  clearDateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
  },
});
