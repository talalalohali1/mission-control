import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Map bot statuses → Convex statuses
const TASK_STATUS_MAP: Record<string, string> = {
    active: "in_progress",
    queued: "inbox",
    completed: "done",
    blocked: "blocked",
    inbox: "inbox",
    in_progress: "in_progress",
    review: "review",
    done: "done",
};

const AGENT_STATUS_MAP: Record<string, string> = {
    online: "online",
    busy: "busy",
    idle: "online",
    offline: "offline",
};

export async function POST(request: NextRequest) {
    // Validate API key
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.WEBHOOK_API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Support both formats
    const type = body.type || body.action;
    const payload = body.payload || body.data;

    try {
        switch (type) {
            // ─── TASK: CREATE OR UPDATE ───
            case "task_update":
            case "create_task": {
                // If payload has an `id`, update the existing task
                if (payload.id) {
                    const updates: Record<string, any> = {};
                    if (payload.status) updates.status = TASK_STATUS_MAP[payload.status] || payload.status;
                    if (payload.title) updates.title = payload.title;
                    if (payload.description) updates.description = payload.description;
                    if (payload.priority) updates.priority = payload.priority;
                    if (payload.assignedAgent !== undefined) updates.assignee = payload.assignedAgent;
                    if (payload.assignee !== undefined) updates.assignee = payload.assignee;

                    await convex.mutation(api.tasks.update, {
                        id: payload.id as Id<"tasks">,
                        ...updates,
                    });
                    return ok({ success: true, type, action: "updated", id: payload.id });
                }

                // No id → create new task
                const status = TASK_STATUS_MAP[payload.status] || "inbox";
                const taskId = await convex.mutation(api.tasks.create, {
                    title: payload.title,
                    description: payload.description || payload.notes || undefined,
                    priority: payload.priority || "medium",
                    assignee: payload.assignedAgent || payload.assignee || undefined,
                    status: status as any,
                });
                return ok({ success: true, type, action: "created", id: taskId });
            }

            case "update_task": {
                const updates: Record<string, any> = {};
                if (payload.status) updates.status = TASK_STATUS_MAP[payload.status] || payload.status;
                if (payload.title) updates.title = payload.title;
                if (payload.description) updates.description = payload.description;
                if (payload.priority) updates.priority = payload.priority;
                if (payload.assignedAgent !== undefined) updates.assignee = payload.assignedAgent;
                if (payload.assignee !== undefined) updates.assignee = payload.assignee;

                await convex.mutation(api.tasks.update, {
                    id: payload.id as Id<"tasks">,
                    ...updates,
                });
                return ok({ success: true, type, action: "updated" });
            }

            // ─── AGENT STATUS ───
            case "agent_update":
            case "update_agent": {
                const agentName = payload.name || payload.id;
                const agentStatus = AGENT_STATUS_MAP[payload.status] || "online";

                await convex.mutation(api.agents.updateStatus, {
                    name: agentName,
                    status: agentStatus as any,
                });
                return ok({ success: true, type, agent: agentName });
            }

            // ─── SQUAD CHAT ───
            case "chat_message":
            case "post_chat": {
                const agentName = payload.agent || payload.agentId || payload.name || "System";
                const content = payload.content || payload.message;

                await convex.mutation(api.squadChat.post, {
                    agent: agentName,
                    content: content,
                });
                return ok({ success: true, type, agent: agentName });
            }

            // ─── ACTIVITY LOG ───
            case "activity":
            case "add_activity": {
                const activityTypeMap: Record<string, string> = {
                    task_created: "task_created",
                    task_completed: "task_updated",
                    task_updated: "task_updated",
                    agent_assigned: "task_updated",
                    status_change: "task_updated",
                    message: "message_sent",
                };
                await convex.mutation(api.activities.create, {
                    type: (activityTypeMap[payload.type] || "task_updated") as any,
                    agent: payload.agentId || payload.agent || "System",
                    message: payload.message,
                });
                return ok({ success: true, type });
            }

            // ─── DELIVERABLES ───
            case "add_deliverable": {
                await convex.mutation(api.deliverables.create, {
                    title: payload.title,
                    content: payload.content,
                    type: payload.type || "report",
                    agent: payload.agent || payload.agentId || "System",
                });
                return ok({ success: true, type });
            }

            default:
                return NextResponse.json(
                    {
                        error: `Unknown type: ${type}`,
                        supported: [
                            "task_update — create or update a task (include id to update)",
                            "agent_update — update agent status",
                            "chat_message — post to squad chat",
                            "activity — log activity",
                            "add_deliverable — add a deliverable",
                        ],
                    },
                    { status: 400, headers: noCacheHeaders() }
                );
        }
    } catch (error: any) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Internal error", details: error.message, type, payload },
            { status: 500, headers: noCacheHeaders() }
        );
    }
}

function ok(data: any) {
    return NextResponse.json(data, { headers: noCacheHeaders() });
}

function noCacheHeaders() {
    return {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Vercel-CDN-Cache-Control": "no-store",
    };
}
