import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get recent activities (limit 50)
export const getActivities = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("activities").order("desc").take(50);
    },
});

// Create an activity entry
export const create = mutation({
    args: {
        type: v.union(
            v.literal("task_created"),
            v.literal("task_updated"),
            v.literal("message_sent"),
            v.literal("deliverable_created")
        ),
        agent: v.string(),
        taskId: v.optional(v.id("tasks")),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("activities", {
            type: args.type,
            agent: args.agent,
            taskId: args.taskId,
            message: args.message,
            createdAt: Date.now(),
        });
    },
});
