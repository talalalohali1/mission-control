"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getAgentColor } from "@/lib/utils";
import { useState } from "react";

export default function Deliverables() {
    const deliverables = useQuery(api.deliverables.getDeliverables);
    const [expanded, setExpanded] = useState<string | null>(null);

    if (!deliverables) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-mc-card border border-mc-border rounded-xl p-4">
                        <div className="skeleton h-8 w-8 rounded mb-3" />
                        <div className="skeleton h-5 w-3/4 mb-2" />
                        <div className="skeleton h-3 w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (deliverables.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-mc-text-muted">
                <span className="text-3xl mb-2">🎯</span>
                <p className="text-sm">No deliverables yet</p>
            </div>
        );
    }

    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            post: "📝", tweet: "🐦", article: "📰", code: "💻",
            design: "🎨", report: "📊", email: "✉️", research: "🔬",
        };
        return icons[type] || "📄";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliverables.map((d) => (
                <div key={d._id}>
                    <button
                        onClick={() => setExpanded(expanded === d._id ? null : d._id)}
                        className="w-full text-left bg-mc-card border border-mc-border rounded-xl p-4 task-card"
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">{getTypeIcon(d.type)}</span>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-mc-text mb-1 truncate">
                                    {d.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-mc-text-muted">
                                    <span className="capitalize">{d.type}</span>
                                    <span>·</span>
                                    <span>
                                        {new Date(d.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                    {d.agent && (
                                        <>
                                            <span>·</span>
                                            <span style={{ color: getAgentColor(d.agent) }} className="font-medium">
                                                {d.agent}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <span className="text-mc-text-muted text-xs mt-1">
                                {expanded === d._id ? "▲" : "▼"}
                            </span>
                        </div>
                    </button>
                    {expanded === d._id && (
                        <div className="mt-1 bg-mc-sidebar border border-mc-border rounded-xl p-4 text-sm text-mc-text-secondary leading-relaxed whitespace-pre-wrap">
                            {d.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
