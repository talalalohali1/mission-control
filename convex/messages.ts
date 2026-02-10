import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a comment/message on a task
export const create = mutation({
    args: {
        taskId: v.optional(v.id("tasks")),
        agent: v.string(),
        content: v.string(),
        type: v.union(v.literal("comment"), v.literal("status_change"), v.literal("assignment")),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        await ctx.db.insert("messages", {
            taskId: args.taskId,
            agent: args.agent,
            content: args.content,
            type: args.type,
            createdAt: now,
        });

        // Log activity
        await ctx.db.insert("activities", {
            type: "message_sent",
            agent: args.agent,
            taskId: args.taskId,
            message: `Comment: ${args.content.slice(0, 100)}`,
            createdAt: now,
        });
    },
});
