"use client";

import { getAgentColor } from "@/lib/utils";

const PRIORITY_COLORS: Record<string, string> = {
    high: "#e74c3c",
    medium: "#f39c12",
    low: "#27ae60",
};

const STATUS_BORDER_COLORS: Record<string, string> = {
    inbox: "#e67e22",
    in_progress: "#8e44ad",
    review: "#f39c12",
    done: "#27ae60",
    blocked: "#e74c3c",
};

interface TaskCardProps {
    task: {
        _id: string;
        title: string;
        description?: string;
        priority: "low" | "medium" | "high";
        status: string;
        assignee?: string;
        createdAt: number;
        updatedAt: number;
    };
    onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    const borderColor = STATUS_BORDER_COLORS[task.status] || "#d4d1cc";
    const tags = generateTags(task.title, task.description);

    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-mc-card rounded-lg p-3.5 task-card cursor-pointer border border-mc-border relative overflow-hidden"
        >
            {/* Colored left border */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                style={{ backgroundColor: borderColor }}
            />

            <div className="pl-2">
                {/* Priority indicator */}
                {task.priority === "high" && (
                    <div className="flex items-center gap-1 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRIORITY_COLORS.high }} />
                        <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">Urgent</span>
                    </div>
                )}

                {/* Title */}
                <h4 className="text-[13px] font-semibold text-mc-text leading-snug mb-1">
                    {task.title}
                </h4>

                {/* Description preview */}
                {task.description && (
                    <p className="text-[11px] text-mc-text-muted leading-relaxed mb-2 line-clamp-2">
                        {task.description}
                    </p>
                )}

                {/* Agent + time */}
                <div className="flex items-center gap-2 mb-2">
                    {task.assignee && (
                        <div className="flex items-center gap-1">
                            <div
                                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                                style={{ backgroundColor: getAgentColor(task.assignee) }}
                            >
                                {task.assignee[0]}
                            </div>
                            <span className="text-[11px] text-mc-text-secondary font-medium">
                                {task.assignee}
                            </span>
                        </div>
                    )}
                    <span className="text-[10px] text-mc-text-muted">
                        {formatTimeAgo(task.updatedAt)}
                    </span>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="tag bg-mc-sidebar text-mc-text-secondary border border-mc-border"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </button>
    );
}

function generateTags(title: string, description?: string): string[] {
    const text = `${title} ${description || ""}`.toLowerCase();
    const tags: string[] = [];
    const tagMap: Record<string, string[]> = {
        research: ["research", "analyze", "analysis", "audit", "competitor", "pricing"],
        content: ["blog", "post", "article", "write", "writing", "content", "copy"],
        design: ["design", "template", "brand", "visual", "ui", "ux", "mockup"],
        video: ["video", "demo", "script"],
        social: ["social", "tweet", "twitter", "linkedin", "instagram"],
        seo: ["seo", "keyword", "ranking", "landing page"],
        email: ["email", "newsletter", "outreach", "lifecycle"],
        documentation: ["doc", "documentation", "readme", "guide", "api"],
        strategy: ["strategy", "brief", "plan", "roadmap", "framework"],
        code: ["code", "api", "deploy", "build", "dev", "dashboard"],
        comparison: ["comparison", "vs", "versus", "competitor"],
        shopify: ["shopify", "ecommerce", "e-commerce", "store"],
    };
    for (const [tag, keywords] of Object.entries(tagMap)) {
        if (keywords.some((k) => text.includes(k))) tags.push(tag);
        if (tags.length >= 3) break;
    }
    return tags;
}

function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `about ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `about ${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}
