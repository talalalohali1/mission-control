import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    agents: defineTable({
        name: v.string(),
        role: v.string(),
        status: v.union(v.literal("online"), v.literal("offline"), v.literal("busy")),
        currentTaskId: v.optional(v.id("tasks")),
        lastSeenAt: v.number(),
    }),

    tasks: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        status: v.union(
            v.literal("inbox"),
            v.literal("in_progress"),
            v.literal("review"),
            v.literal("done"),
            v.literal("blocked")
        ),
        priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
        assignee: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),

    messages: defineTable({
        taskId: v.optional(v.id("tasks")),
        agent: v.string(),
        content: v.string(),
        type: v.union(v.literal("comment"), v.literal("status_change"), v.literal("assignment")),
        createdAt: v.number(),
    }),

    activities: defineTable({
        type: v.union(
            v.literal("task_created"),
            v.literal("task_updated"),
            v.literal("message_sent"),
            v.literal("deliverable_created")
        ),
        agent: v.string(),
        taskId: v.optional(v.id("tasks")),
        message: v.string(),
        createdAt: v.number(),
    }),

    deliverables: defineTable({
        title: v.string(),
        content: v.string(),
        type: v.union(
            v.literal("post"),
            v.literal("tweet"),
            v.literal("article"),
            v.literal("code"),
            v.literal("design"),
            v.literal("report"),
            v.literal("email"),
            v.literal("research")
        ),
        taskId: v.optional(v.id("tasks")),
        agent: v.string(),
        createdAt: v.number(),
    }),

    squadChat: defineTable({
        agent: v.string(),
        content: v.string(),
        createdAt: v.number(),
    }),
});
