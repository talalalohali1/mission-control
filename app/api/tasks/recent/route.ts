import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Disable Vercel edge caching — always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
    const tasks = await convex.query(api.tasks.getRecent);
    return NextResponse.json(tasks, {
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
        },
    });
}
