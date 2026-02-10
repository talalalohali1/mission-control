"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getAgentColor } from "@/lib/utils";

const AGENT_INFO: Record<string, { role: string; desc: string; badge: string; badgeColor: string }> = {
    Jarvis: { role: "Squad Lead", desc: "Coordinates tasks and delegates", badge: "LEAD", badgeColor: "bg-orange-100 text-orange-700" },
    Fury: { role: "Customer Researcher", desc: "Digs into companies/people/markets", badge: "RES", badgeColor: "bg-purple-100 text-purple-700" },
    Shuri: { role: "Product Analyst", desc: "Analyzes requirements and fit", badge: "INT", badgeColor: "bg-blue-100 text-blue-700" },
    Vision: { role: "SEO Analyst", desc: "Keywords and search optimization", badge: "SEO", badgeColor: "bg-green-100 text-green-700" },
    Loki: { role: "Content Writer", desc: "Drafts copy and talking points", badge: "SPC", badgeColor: "bg-pink-100 text-pink-700" },
    Quill: { role: "Social Media", desc: "Turns wins into posts", badge: "SMM", badgeColor: "bg-cyan-100 text-cyan-700" },
    Wanda: { role: "Designer", desc: "Visuals and mockups", badge: "DES", badgeColor: "bg-rose-100 text-rose-700" },
    Pepper: { role: "Email Marketing", desc: "Sequences and outreach", badge: "MKT", badgeColor: "bg-amber-100 text-amber-700" },
    Friday: { role: "Developer", desc: "Builds and codes", badge: "DEV", badgeColor: "bg-indigo-100 text-indigo-700" },
    Wong: { role: "Documentation", desc: "Organizes deliverables", badge: "DOC", badgeColor: "bg-teal-100 text-teal-700" },
};

const DEFAULT_INFO = { role: "Agent", desc: "", badge: "INT", badgeColor: "bg-gray-100 text-gray-600" };

export default function AgentStatus() {
    const agents = useQuery(api.agents.getAgents);

    if (!agents) {
        return (
            <div className="space-y-2 p-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                        <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
                        <div className="flex-1">
                            <div className="skeleton h-3.5 w-20 mb-1" />
                            <div className="skeleton h-3 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-mc-border">
                <h2 className="text-xs font-bold tracking-widest text-mc-text-muted uppercase">
                    ✦ Agents
                </h2>
                <span className="text-[10px] bg-mc-border rounded px-1.5 py-0.5 font-mono text-mc-text-secondary">
                    {agents.length}
                </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {agents.map((agent) => {
                    const info = AGENT_INFO[agent.name] || DEFAULT_INFO;
                    return (
                        <div
                            key={agent._id}
                            className="flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-mc-border/40 transition-colors cursor-default group"
                            title={info.desc}
                        >
                            {/* Avatar */}
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: getAgentColor(agent.name) }}
                            >
                                {agent.name[0]}
                            </div>

                            {/* Name + Role + Description */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-semibold text-mc-text truncate">
                                        {agent.name}
                                    </span>
                                    <span className={`tag ${info.badgeColor}`}>
                                        {info.badge}
                                    </span>
                                </div>
                                <span className="text-[11px] text-mc-text-muted truncate block">
                                    {info.desc || info.role}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">
                                {agent.status === "online" && (
                                    <>
                                        <div className="relative">
                                            <div className="w-2 h-2 rounded-full bg-mc-green status-pulse" />
                                        </div>
                                        <span className="text-[10px] font-semibold text-mc-green uppercase tracking-wider">
                                            Working
                                        </span>
                                    </>
                                )}
                                {agent.status === "busy" && (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-mc-orange" />
                                        <span className="text-[10px] font-semibold text-mc-orange uppercase tracking-wider">
                                            Busy
                                        </span>
                                    </>
                                )}
                                {agent.status === "offline" && (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                            Offline
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
