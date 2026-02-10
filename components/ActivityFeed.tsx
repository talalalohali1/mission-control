"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getAgentColor } from "@/lib/utils";
import { useState } from "react";

type FilterTab = "all" | "tasks" | "comments" | "docs" | "deliverables";

export default function ActivityFeed() {
    const activities = useQuery(api.activities.getActivities);
    const agents = useQuery(api.agents.getAgents);
    const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
    const [selectedAgent, setSelectedAgent] = useState<string>("all");

    const filterTabs: { key: FilterTab; label: string }[] = [
        { key: "all", label: "All" },
        { key: "tasks", label: "Tasks" },
        { key: "comments", label: "Comments" },
        { key: "docs", label: "Docs" },
        { key: "deliverables", label: "Genius" },
    ];

    if (!activities) {
        return (
            <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b border-mc-border">
                    <div className="skeleton h-4 w-20 mb-3" />
                    <div className="flex gap-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="skeleton h-6 w-16 rounded" />
                        ))}
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i}>
                            <div className="skeleton h-3 w-32 mb-1" />
                            <div className="skeleton h-4 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Filter activities
    let filtered = activities;
    if (activeFilter === "tasks") {
        filtered = activities.filter((a) => a.type === "task_created" || a.type === "task_updated");
    } else if (activeFilter === "comments") {
        filtered = activities.filter((a) => a.type === "message_sent");
    } else if (activeFilter === "deliverables") {
        filtered = activities.filter((a) => a.type === "deliverable_created");
    }

    if (selectedAgent !== "all") {
        filtered = filtered.filter((a) => a.agent === selectedAgent);
    }

    const getActivityLabel = (type: string) => {
        switch (type) {
            case "task_created": return "created task";
            case "task_updated": return "updated";
            case "message_sent": return "commented on";
            case "deliverable_created": return "added deliverable";
            default: return "acted on";
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b border-mc-border">
                <h2 className="text-xs font-bold tracking-widest text-mc-text-muted uppercase mb-3">
                    ✦ Live Feed
                </h2>

                {/* Filter tabs */}
                <div className="flex gap-1 mb-3">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveFilter(tab.key)}
                            className={`text-[11px] px-2.5 py-1 rounded font-medium transition-colors ${activeFilter === tab.key
                                    ? "bg-mc-text text-white"
                                    : "text-mc-text-secondary hover:bg-mc-border"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Agent filter chips */}
                {agents && (
                    <div className="flex flex-wrap gap-1">
                        <button
                            onClick={() => setSelectedAgent("all")}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${selectedAgent === "all"
                                    ? "bg-mc-accent text-white"
                                    : "bg-mc-sidebar text-mc-text-secondary border border-mc-border hover:bg-mc-border"
                                }`}
                        >
                            All Agents
                        </button>
                        {agents.map((agent) => (
                            <button
                                key={agent._id}
                                onClick={() => setSelectedAgent(agent.name)}
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors flex items-center gap-1 ${selectedAgent === agent.name
                                        ? "text-white"
                                        : "bg-mc-sidebar text-mc-text-secondary border border-mc-border hover:bg-mc-border"
                                    }`}
                                style={
                                    selectedAgent === agent.name
                                        ? { backgroundColor: getAgentColor(agent.name) }
                                        : undefined
                                }
                            >
                                {agent.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Activity entries */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filtered.length === 0 ? (
                    <div className="text-center text-mc-text-muted text-xs py-8">
                        No activity matching filters
                    </div>
                ) : (
                    filtered.map((activity) => (
                        <div key={activity._id} className="group">
                            <p className="text-[13px] text-mc-text leading-snug">
                                <span
                                    className="font-semibold"
                                    style={{ color: getAgentColor(activity.agent) }}
                                >
                                    {activity.agent}
                                </span>{" "}
                                <span className="text-mc-text-secondary">
                                    {getActivityLabel(activity.type)}
                                </span>{" "}
                                <span className="font-medium">
                                    &ldquo;{activity.message.replace(/^(Created task: |Status → \w+: |Deliverable added: |Comment: |Assigned \w+ to: |Updated: )/, "")}&rdquo;
                                </span>
                            </p>
                            <span className="text-[10px] text-mc-text-muted mt-0.5 block">
                                about {formatTimeAgo(activity.createdAt)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
}
