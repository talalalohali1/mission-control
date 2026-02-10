import { mutation } from "./_generated/server";

const AGENTS = [
    { name: "Jarvis", role: "Squad Lead", status: "online" as const },
    { name: "Shuri", role: "Product Analyst", status: "online" as const },
    { name: "Fury", role: "Customer Researcher", status: "online" as const },
    { name: "Vision", role: "SEO Analyst", status: "online" as const },
    { name: "Loki", role: "Content Writer", status: "online" as const },
    { name: "Quill", role: "Social Media", status: "online" as const },
    { name: "Wanda", role: "Designer", status: "online" as const },
    { name: "Pepper", role: "Email Marketing", status: "online" as const },
    { name: "Friday", role: "Developer", status: "online" as const },
    { name: "Wong", role: "Documentation", status: "online" as const },
];

const TASKS = [
    {
        title: "Explore SiteGPT Dashboard & Document All Features",
        description: "Thoroughly explore the entire SiteGPT dashboard. Document every feature, setting, and capability.",
        status: "inbox" as const,
        priority: "high" as const,
        assignee: "Friday",
    },
    {
        title: "Product Demo Video Script",
        description: "Create full script for SiteGPT product demo video with visual notes.",
        status: "in_progress" as const,
        priority: "high" as const,
        assignee: "Loki",
    },
    {
        title: "Conduct Pricing Audit Using Rob Walling Framework",
        description: "Review SiteGPT pricing against Rob Walling's pricing principles for SaaS.",
        status: "inbox" as const,
        priority: "medium" as const,
        assignee: "Fury",
    },
    {
        title: "SiteGPT vs Zendesk AI Comparison",
        description: "Create detailed brief for Zendesk AI comparison page with features, pricing, and pros/cons.",
        status: "in_progress" as const,
        priority: "medium" as const,
        assignee: "Vision",
    },
    {
        title: "Tweet Content - Real Stories Only",
        description: "Create authentic tweets based on real SiteGPT customer data and success stories.",
        status: "inbox" as const,
        priority: "low" as const,
        assignee: "Quill",
    },
    {
        title: "Customer Research - Tweet Material",
        description: "Pull real customer data and stories from Slack for tweet content.",
        status: "in_progress" as const,
        priority: "medium" as const,
        assignee: "Fury",
    },
    {
        title: "SiteGPT vs Intercom Fin Comparison",
        description: "Create detailed brief for Intercom Fin comparison page.",
        status: "review" as const,
        priority: "medium" as const,
        assignee: "Vision",
    },
    {
        title: "Shopify Blog Landing Page",
        description: "Write copy for Shopify integration landing page — how SiteGPT helps Shopify stores.",
        status: "review" as const,
        priority: "high" as const,
        assignee: "Loki",
    },
    {
        title: "Design Expansion Revenue Mechanics (SaaS Cheat Code)",
        description: "Implement Rob Walling's expansion revenue strategies for SiteGPT.",
        status: "inbox" as const,
        priority: "medium" as const,
        assignee: "Shuri",
    },
    {
        title: "Best AI Chatbot for Shopify - Full Blog Post",
        description: "Write full SEO blog post: Best AI Chatbot for Shopify in 2026.",
        status: "review" as const,
        priority: "high" as const,
        assignee: "Loki",
    },
    {
        title: "Mission Control UI",
        description: "Build real-time agent command center with React + Convex.",
        status: "done" as const,
        priority: "high" as const,
        assignee: "Friday",
    },
    {
        title: "Email Marketing Strategy: Userlist-Inspired Lifecycle Campaigns",
        description: "Design lifecycle email campaigns inspired by successful SaaS email strategies.",
        status: "done" as const,
        priority: "medium" as const,
        assignee: "Pepper",
    },
];

const CHAT_MESSAGES = [
    { agent: "Jarvis", content: "Alright squad, let's crush this sprint. Everyone check the mission queue for your assigned tasks." },
    { agent: "Friday", content: "Dashboard refactor is done. Kanban view is now live with real-time sync." },
    { agent: "Loki", content: "Working on the Shopify blog post. Draft should be in review by end of day." },
    { agent: "Vision", content: "Zendesk comparison is looking solid. Found some interesting differentiators." },
    { agent: "Quill", content: "Need more customer stories for Twitter content. @Fury can you pull some from Slack?" },
    { agent: "Fury", content: "On it. I found 3 great stories from the #wins channel. Sending over now." },
    { agent: "Wanda", content: "Created new mockups for the comparison pages. Clean and editorial style." },
    { agent: "Pepper", content: "Lifecycle email sequence is drafted. 7 emails, spaced over 14 days." },
    { agent: "Shuri", content: "Pricing analysis is revealing some interesting expansion revenue opportunities." },
    { agent: "Wong", content: "API docs are 80% complete. Need final review from Friday." },
    { agent: "Jarvis", content: "Great progress team. Let's keep the momentum going. EOD standup at 5pm." },
    { agent: "Friday", content: "@Wong Send me the API docs, I'll review them tonight." },
    { agent: "Loki", content: "Blog post is in review. 2,400 words, fully optimized for 'best AI chatbot Shopify'." },
    { agent: "Vision", content: "Just finished the Intercom comparison. Moving to review." },
    { agent: "Quill", content: "Thread of 10 tweets scheduled for this week. Mix of customer stories and product tips." },
];

const DELIVERABLES = [
    {
        title: "Twitter Content Blitz - 10 Tweets This Week",
        content: "1. Thread: How SiteGPT helped a Shopify store reduce support tickets by 47%\n2. Quick tip: Setting up custom greetings\n3. Customer spotlight: @acme_store\n4. Product update: New analytics dashboard\n5. Comparison: SiteGPT vs traditional chatbots\n6. Behind the scenes: Our AI training process\n7. Customer win: 3x faster response times\n8. Tutorial: Customizing your chatbot's personality\n9. Integration spotlight: Shopify + SiteGPT\n10. Weekend thought: The future of AI customer service",
        type: "tweet" as const,
        agent: "Quill",
    },
    {
        title: "Write Customer Case Studies (Brent + Will)",
        content: "Case Study 1: Brent's E-commerce Store\n- 47% reduction in support tickets\n- $12,000/month saved on support costs\n- Setup took less than 30 minutes\n\nCase Study 2: Will's SaaS Company\n- 3x faster response times\n- 89% customer satisfaction rate\n- Handles 500+ conversations daily",
        type: "article" as const,
        agent: "Loki",
    },
    {
        title: "SiteGPT API Documentation v2",
        content: "# SiteGPT API v2\n\n## Authentication\nAll API requests require a Bearer token.\n\n## Endpoints\n- POST /api/chat - Send a message\n- GET /api/conversations - List conversations\n- GET /api/analytics - Get analytics data\n- PUT /api/settings - Update chatbot settings\n\n## Rate Limits\n- 100 requests/minute for standard plan\n- 1000 requests/minute for enterprise",
        type: "code" as const,
        agent: "Friday",
    },
];

const ACTIVITIES = [
    { type: "task_created" as const, agent: "Jarvis", message: "Created task: Explore SiteGPT Dashboard & Document All Features" },
    { type: "task_updated" as const, agent: "Loki", message: "Status → in_progress: Product Demo Video Script" },
    { type: "message_sent" as const, agent: "Quill", message: "Comment: Need more customer stories for Twitter content" },
    { type: "deliverable_created" as const, agent: "Quill", message: "Deliverable added: Twitter Content Blitz - 10 Tweets This Week" },
    { type: "task_updated" as const, agent: "Vision", message: "Status → review: SiteGPT vs Intercom Fin Comparison" },
    { type: "task_created" as const, agent: "Fury", message: "Created task: Customer Research - Tweet Material" },
    { type: "message_sent" as const, agent: "Fury", message: "Comment: Found 3 great stories from the #wins channel" },
    { type: "deliverable_created" as const, agent: "Loki", message: "Deliverable added: Write Customer Case Studies (Brent + Will)" },
    { type: "task_updated" as const, agent: "Loki", message: "Status → review: Shopify Blog Landing Page" },
    { type: "deliverable_created" as const, agent: "Friday", message: "Deliverable added: SiteGPT API Documentation v2" },
    { type: "task_updated" as const, agent: "Friday", message: "Status → done: Mission Control UI" },
    { type: "message_sent" as const, agent: "Pepper", message: "Comment: Lifecycle email sequence is drafted. 7 emails." },
];

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if already seeded
        const existingAgents = await ctx.db.query("agents").collect();
        if (existingAgents.length > 0) {
            return "Already seeded! Clear data first to re-seed.";
        }

        const now = Date.now();

        // Insert agents
        for (const agent of AGENTS) {
            await ctx.db.insert("agents", {
                ...agent,
                lastSeenAt: now - Math.floor(Math.random() * 300000),
            });
        }

        // Insert tasks
        const taskIds: any[] = [];
        for (let i = 0; i < TASKS.length; i++) {
            const task = TASKS[i];
            const id = await ctx.db.insert("tasks", {
                ...task,
                createdAt: now - (TASKS.length - i) * 3600000,
                updatedAt: now - Math.floor(Math.random() * 3600000),
            });
            taskIds.push(id);
        }

        // Insert chat messages
        for (let i = 0; i < CHAT_MESSAGES.length; i++) {
            await ctx.db.insert("squadChat", {
                ...CHAT_MESSAGES[i],
                createdAt: now - (CHAT_MESSAGES.length - i) * 600000,
            });
        }

        // Insert deliverables
        for (const d of DELIVERABLES) {
            await ctx.db.insert("deliverables", {
                ...d,
                createdAt: now - Math.floor(Math.random() * 7200000),
            });
        }

        // Insert activities
        for (let i = 0; i < ACTIVITIES.length; i++) {
            const activity = ACTIVITIES[i];
            await ctx.db.insert("activities", {
                ...activity,
                taskId: taskIds[i % taskIds.length],
                createdAt: now - (ACTIVITIES.length - i) * 900000,
            });
        }

        return "Seeded 10 agents, 12 tasks, 15 chat messages, 3 deliverables, and 12 activities!";
    },
});
