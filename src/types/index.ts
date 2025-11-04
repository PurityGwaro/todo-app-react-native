export interface Todo {
  _id: string;
  _creationTime: number;
  title: string;
  description?: string;
  dueDate?: number;
  isCompleted: boolean;
  order: number;
}

export type TodoInput = Omit<Todo, '_id' | '_creationTime' | 'order'>;

export type TodoUpdate = Partial<TodoInput> & { _id: string };
