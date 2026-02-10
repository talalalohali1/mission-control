import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { type, message } = body;

    // Format message for OpenClaw
    let openclawMessage = "";

    if (type === "new_task") {
        openclawMessage = `[MISSION CONTROL] New task created: "${body.title}". ${body.description || ""} Priority: ${body.priority}. ${body.assignee ? `Assigned to: ${body.assignee}` : "Unassigned."}`;
    } else if (type === "chat_message") {
        openclawMessage = `[MISSION CONTROL] Talal says: ${message}`;
    } else if (type === "task_update") {
        openclawMessage = `[MISSION CONTROL] Task "${body.title}" updated. New status: ${body.status}.`;
    }

    try {
        // Call OpenClaw Gateway API
        const response = await fetch(
            `${process.env.OPENCLAW_GATEWAY_URL}/api/sessions/send`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENCLAW_GATEWAY_TOKEN}`,
                },
                body: JSON.stringify({
                    sessionKey: "agent:main:main",
                    message: openclawMessage,
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to send to OpenClaw");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("OpenClaw error:", error);
        // Don't fail the request — OpenClaw might be offline
        return NextResponse.json(
            { success: false, warning: "Failed to notify agents" },
            { status: 200 }
        );
    }
}
