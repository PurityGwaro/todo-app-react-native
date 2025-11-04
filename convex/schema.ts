import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    isCompleted: v.boolean(),
    order: v.number(),
  })
  .index("by_order", ["order"])
  .index("by_completion", ["isCompleted"]),
});
