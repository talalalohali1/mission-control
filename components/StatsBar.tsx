"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function StatsBar() {
    const stats = useQuery(api.tasks.getStats);
    const tasks = useQuery(api.tasks.getTasks);

    const totalTasks = tasks?.length || 0;
    const agentsActive = stats?.agentsOnline || 0;

    return (
        <div className="flex items-center gap-8">
            {/* Agents Active */}
            <div className="text-center">
                <div className="text-3xl font-bold font-mono text-mc-text">
                    {stats ? agentsActive : "—"}
                </div>
                <div className="text-[10px] font-semibold tracking-widest text-mc-text-muted uppercase">
                    Agents Active
                </div>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-mc-border" />

            {/* Tasks in Queue */}
            <div className="text-center">
                <div className="text-3xl font-bold font-mono text-mc-text">
                    {stats ? totalTasks : "—"}
                </div>
                <div className="text-[10px] font-semibold tracking-widest text-mc-text-muted uppercase">
                    Tasks in Queue
                </div>
            </div>
        </div>
    );
}
