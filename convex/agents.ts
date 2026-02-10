import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all agents
export const getAgents = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("agents").collect();
    },
});

// Update agent status by name
export const updateStatus = mutation({
    args: {
        name: v.string(),
        status: v.union(v.literal("online"), v.literal("offline"), v.literal("busy")),
    },
    handler: async (ctx, args) => {
        const agents = await ctx.db
            .query("agents")
            .filter((q) => q.eq(q.field("name"), args.name))
            .collect();

        if (agents.length === 0) {
            // Create agent if doesn't exist
            await ctx.db.insert("agents", {
                name: args.name,
                role: "Agent",
                status: args.status,
                lastSeenAt: Date.now(),
            });
            return;
        }

        await ctx.db.patch(agents[0]._id, {
            status: args.status,
            lastSeenAt: Date.now(),
        });
    },
});
