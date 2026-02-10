import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";

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

    // Support both formats:
    // Bot format:    { type: "task_update", payload: {...} }
    // Legacy format: { action: "create_task", data: {...} }
    const type = body.type || body.action;
    const payload = body.payload || body.data;

    try {
        switch (type) {
            // ─── TASK OPERATIONS ───
            case "task_update":
            case "create_task": {
                const status = TASK_STATUS_MAP[payload.status] || "inbox";
                await convex.mutation(api.tasks.create, {
                    title: payload.title,
                    description: payload.description || payload.notes,
                    priority: payload.priority || "medium",
                    assignee: payload.assignedAgent || payload.assignee,
                    status: status as any,
                });
                break;
            }

            case "update_task": {
                const updates: Record<string, any> = {};
                if (payload.status) updates.status = TASK_STATUS_MAP[payload.status] || payload.status;
                if (payload.title) updates.title = payload.title;
                if (payload.description) updates.description = payload.description;
                if (payload.priority) updates.priority = payload.priority;
                if (payload.assignedAgent || payload.assignee) updates.assignee = payload.assignedAgent || payload.assignee;
                await convex.mutation(api.tasks.update, {
                    id: payload.id,
                    ...updates,
                });
                break;
            }

            // ─── AGENT OPERATIONS ───
            case "agent_update":
            case "update_agent": {
                const agentStatus = AGENT_STATUS_MAP[payload.status] || "online";
                await convex.mutation(api.agents.updateStatus, {
                    name: payload.name || payload.id,
                    status: agentStatus as any,
                });
                break;
            }

            // ─── ACTIVITY LOG ───
            case "activity":
            case "add_activity": {
                const activityTypeMap: Record<string, string> = {
                    task_created: "task_created",
                    task_completed: "task_updated",
                    agent_assigned: "task_updated",
                    status_change: "task_updated",
                    message: "message_sent",
                };
                await convex.mutation(api.activities.create, {
                    type: (activityTypeMap[payload.type] || "task_updated") as any,
                    agent: payload.agentId || payload.agent || "System",
                    message: payload.message,
                });
                break;
            }

            // ─── CHAT ───
            case "post_chat": {
                await convex.mutation(api.squadChat.post, {
                    agent: payload.agent,
                    content: payload.content,
                });
                break;
            }

            // ─── DELIVERABLES ───
            case "add_deliverable": {
                await convex.mutation(api.deliverables.create, {
                    title: payload.title,
                    content: payload.content,
                    type: payload.type || "report",
                    agent: payload.agent,
                });
                break;
            }

            default:
                return NextResponse.json(
                    { error: `Unknown type: ${type}`, supported: ["task_update", "update_task", "agent_update", "activity", "post_chat", "add_deliverable"] },
                    { status: 400 }
                );
        }

        return NextResponse.json({ success: true, type });
    } catch (error: any) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Internal error", details: error.message },
            { status: 500 }
        );
    }
}
