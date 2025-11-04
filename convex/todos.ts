import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTodos = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").order("asc").collect();
    return todos.sort((a, b) => a.order - b.order);
  },
});

export const searchTodos = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, { searchTerm }) => {
    const todos = await ctx.db.query("todos").collect();

    if (!searchTerm.trim()) {
      return todos.sort((a, b) => a.order - b.order);
    }

    const filtered = todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => a.order - b.order);
  },
});

export const filterTodos = query({
  args: { filterType: v.union(v.literal("all"), v.literal("active"), v.literal("completed")) },
  handler: async (ctx, { filterType }) => {
    let todos = await ctx.db.query("todos").collect();

    if (filterType === "active") {
      todos = todos.filter((todo) => !todo.isCompleted);
    } else if (filterType === "completed") {
      todos = todos.filter((todo) => todo.isCompleted);
    }

    return todos.sort((a, b) => a.order - b.order);
  },
});

export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const todos = await ctx.db.query("todos").collect();
    const maxOrder = todos.reduce((max, todo) => Math.max(max, todo.order), -1);

    const todoId = await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      dueDate: args.dueDate,
      isCompleted: false,
      order: maxOrder + 1,
    });

    return todoId;
  },
});

export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    isCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, updates);
  },
});

export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) throw new Error("Todo not found");

    await ctx.db.patch(id, { isCompleted: !todo.isCompleted });
  },
});

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const reorderTodos = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("todos"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, { updates }) => {
    for (const update of updates) {
      await ctx.db.patch(update.id, { order: update.order });
    }
  },
});

export const clearCompleted = mutation({
  handler: async (ctx) => {
    const completed = await ctx.db
      .query("todos")
      .withIndex("by_completion", (q) => q.eq("isCompleted", true))
      .collect();

    for (const todo of completed) {
      await ctx.db.delete(todo._id);
    }
  },
});
