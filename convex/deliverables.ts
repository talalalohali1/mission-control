import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all deliverables
export const getDeliverables = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("deliverables").order("desc").collect();
    },
});

// Create a deliverable
export const create = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        await ctx.db.insert("deliverables", {
            title: args.title,
            content: args.content,
            type: args.type,
            taskId: args.taskId,
            agent: args.agent,
            createdAt: now,
        });

        // Log activity
        await ctx.db.insert("activities", {
            type: "deliverable_created",
            agent: args.agent,
            taskId: args.taskId,
            message: `Deliverable added: ${args.title}`,
            createdAt: now,
        });
    },
});
