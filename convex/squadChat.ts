import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get recent squad chat messages (limit 100)
export const getSquadChat = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("squadChat").order("desc").take(100);
    },
});

// Post a squad chat message
export const post = mutation({
    args: {
        agent: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("squadChat", {
            agent: args.agent,
            content: args.content,
            createdAt: Date.now(),
        });
    },
});
