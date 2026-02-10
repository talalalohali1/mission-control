import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
    // Validate API key
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.WEBHOOK_API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    try {
        switch (action) {
            case "create_task":
                await convex.mutation(api.tasks.create, {
                    title: data.title,
                    description: data.description,
                    priority: data.priority || "medium",
                    assignee: data.assignee,
                    status: data.status || "inbox",
                });
                break;

            case "update_task":
                await convex.mutation(api.tasks.update, {
                    id: data.id,
                    ...data.updates,
                });
                break;

            case "post_chat":
                await convex.mutation(api.squadChat.post, {
                    agent: data.agent,
                    content: data.content,
                });
                break;

            case "add_deliverable":
                await convex.mutation(api.deliverables.create, {
                    title: data.title,
                    content: data.content,
                    type: data.type,
                    taskId: data.taskId,
                    agent: data.agent,
                });
                break;

            case "update_agent":
                await convex.mutation(api.agents.updateStatus, {
                    name: data.name,
                    status: data.status,
                });
                break;

            case "add_activity":
                await convex.mutation(api.activities.create, {
                    type: data.type,
                    agent: data.agent,
                    taskId: data.taskId,
                    message: data.message,
                });
                break;

            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
