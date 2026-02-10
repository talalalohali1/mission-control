import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
    // Validate API key
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.WEBHOOK_API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await convex.query(api.squadChat.getSquadChat);

    // Map to bot's expected format (newest first, already desc from Convex)
    const mapped = messages.map((m) => ({
        id: m._id,
        agentId: m.agent,
        message: m.content,
        timestamp: new Date(m.createdAt).toISOString(),
    }));

    return NextResponse.json(
        { messages: mapped, _ts: Date.now() },
        {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate",
                "Vercel-CDN-Cache-Control": "no-store",
            },
        }
    );
}
