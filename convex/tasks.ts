import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all tasks sorted by updatedAt
export const getTasks = query({
    args: {},
    handler: async (ctx) => {
        const tasks = await ctx.db.query("tasks").order("desc").collect();
        return tasks;
    },
});

// Get single task by ID with comments and deliverables
export const getTaskById = query({
    args: { taskId: v.id("tasks") },
    handler: async (ctx, args) => {
        const task = await ctx.db.get(args.taskId);
        if (!task) return null;

        const messages = await ctx.db
            .query("messages")
            .filter((q) => q.eq(q.field("taskId"), args.taskId))
            .order("asc")
            .collect();

        const deliverables = await ctx.db
            .query("deliverables")
            .filter((q) => q.eq(q.field("taskId"), args.taskId))
            .order("desc")
            .collect();

        return { ...task, messages, deliverables };
    },
});

// Dashboard stats
export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const tasks = await ctx.db.query("tasks").collect();
        const agents = await ctx.db.query("agents").collect();

        return {
            inProgress: tasks.filter((t) => t.status === "in_progress").length,
            completed: tasks.filter((t) => t.status === "done").length,
            review: tasks.filter((t) => t.status === "review").length,
            inbox: tasks.filter((t) => t.status === "inbox").length,
            blocked: tasks.filter((t) => t.status === "blocked").length,
            total: tasks.length,
            agentsOnline: agents.filter((a) => a.status === "online").length,
            agentsTotal: agents.length,
        };
    },
});

// Create a task
export const create = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
        assignee: v.optional(v.string()),
        status: v.optional(
            v.union(
                v.literal("inbox"),
                v.literal("in_progress"),
                v.literal("review"),
                v.literal("done"),
                v.literal("blocked")
            )
        ),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const taskId = await ctx.db.insert("tasks", {
            title: args.title,
            description: args.description,
            priority: args.priority,
            assignee: args.assignee,
            status: args.status || "inbox",
            createdAt: now,
            updatedAt: now,
        });

        // Log activity
        await ctx.db.insert("activities", {
            type: "task_created",
            agent: args.assignee || "System",
            taskId,
            message: `Created task: ${args.title}`,
            createdAt: now,
        });

        return taskId;
    },
});

// Update a task
export const update = mutation({
    args: {
        id: v.id("tasks"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        status: v.optional(
            v.union(
                v.literal("inbox"),
                v.literal("in_progress"),
                v.literal("review"),
                v.literal("done"),
                v.literal("blocked")
            )
        ),
        priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
        assignee: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const task = await ctx.db.get(id);
        if (!task) throw new Error("Task not found");

        const now = Date.now();
        const patch: Record<string, any> = { updatedAt: now };

        if (updates.title !== undefined) patch.title = updates.title;
        if (updates.description !== undefined) patch.description = updates.description;
        if (updates.status !== undefined) patch.status = updates.status;
        if (updates.priority !== undefined) patch.priority = updates.priority;
        if (updates.assignee !== undefined) patch.assignee = updates.assignee;

        await ctx.db.patch(id, patch);

        // Log activity
        const msg = updates.status
            ? `Status → ${updates.status}: ${task.title}`
            : updates.assignee
                ? `Assigned ${updates.assignee} to: ${task.title}`
                : `Updated: ${task.title}`;

        await ctx.db.insert("activities", {
            type: "task_updated",
            agent: updates.assignee || task.assignee || "System",
            taskId: id,
            message: msg,
            createdAt: now,
        });
    },
});
