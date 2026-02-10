import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
    // Validate API key
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.WEBHOOK_API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await convex.query(api.tasks.getTasks);

    // Map to bot's expected format
    const mapped = tasks.map((t) => ({
        id: t._id,
        title: t.title,
        description: t.description || null,
        status: t.status === "in_progress" ? "active" : t.status === "inbox" ? "queued" : t.status === "done" ? "completed" : t.status,
        priority: t.priority,
        assignedAgent: t.assignee || null,
        createdAt: new Date(t.createdAt).toISOString(),
        updatedAt: new Date(t.updatedAt).toISOString(),
    }));

    return NextResponse.json(
        { tasks: mapped },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
}
