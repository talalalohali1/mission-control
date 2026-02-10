"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAgentColor } from "@/lib/utils";
import { useState } from "react";

interface TaskModalProps {
    taskId: string;
    onClose: () => void;
}

const STATUS_OPTIONS = [
    { value: "inbox", label: "Inbox", color: "bg-gray-100 text-gray-700" },
    { value: "in_progress", label: "In Progress", color: "bg-purple-100 text-purple-700" },
    { value: "review", label: "Review", color: "bg-yellow-100 text-yellow-700" },
    { value: "done", label: "Done", color: "bg-green-100 text-green-700" },
    { value: "blocked", label: "Blocked", color: "bg-red-100 text-red-700" },
] as const;

export default function TaskModal({ taskId, onClose }: TaskModalProps) {
    const task = useQuery(api.tasks.getTaskById, {
        taskId: taskId as Id<"tasks">,
    });
    const agents = useQuery(api.agents.getAgents);
    const updateTask = useMutation(api.tasks.update);
    const createMessage = useMutation(api.messages.create);

    const [comment, setComment] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    if (!task) {
        return (
            <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4">
                <div className="bg-mc-card border border-mc-border rounded-2xl w-full max-w-2xl p-6">
                    <div className="skeleton h-8 w-64 mb-4" />
                    <div className="skeleton h-4 w-full mb-2" />
                    <div className="skeleton h-4 w-3/4" />
                </div>
            </div>
        );
    }

    const statusInfo = STATUS_OPTIONS.find((s) => s.value === task.status);

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        await updateTask({
            id: taskId as Id<"tasks">,
            status: newStatus as any,
        });
        // Notify OpenClaw
        fetch("/api/send-to-openclaw", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "task_update",
                title: task.title,
                status: newStatus,
            }),
        }).catch(() => { });
        setIsUpdating(false);
    };

    const handleAssign = async (agentName: string) => {
        setIsUpdating(true);
        await updateTask({
            id: taskId as Id<"tasks">,
            assignee: agentName || undefined,
        });
        setIsUpdating(false);
    };

    const handleComment = async () => {
        if (!comment.trim()) return;
        await createMessage({
            taskId: taskId as Id<"tasks">,
            agent: "Talal",
            content: comment,
            type: "comment",
        });
        setComment("");
    };

    return (
        <div
            className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-mc-card border border-mc-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-mc-card border-b border-mc-border p-6 rounded-t-2xl">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 mr-4">
                            <h2 className="text-lg font-bold text-mc-text mb-2">{task.title}</h2>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`${statusInfo?.color} text-xs px-2.5 py-1 rounded-full font-semibold`}>
                                    {statusInfo?.label}
                                </span>
                                {task.priority === "high" && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 font-medium">
                                        🔥 High Priority
                                    </span>
                                )}
                                {task.priority === "medium" && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 font-medium">
                                        Medium
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-mc-text-muted hover:text-mc-text transition-colors text-xl leading-none p-1"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Description */}
                    {task.description && (
                        <div>
                            <h3 className="text-[11px] font-bold text-mc-text-muted mb-2 uppercase tracking-widest">Description</h3>
                            <p className="text-sm text-mc-text-secondary leading-relaxed">{task.description}</p>
                        </div>
                    )}

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-[11px] font-bold text-mc-text-muted mb-1 uppercase tracking-widest">Assigned To</h3>
                            {task.assignee ? (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                                        style={{ backgroundColor: getAgentColor(task.assignee) }}
                                    >
                                        {task.assignee[0]}
                                    </div>
                                    <span className="text-sm font-medium text-mc-text">{task.assignee}</span>
                                </div>
                            ) : (
                                <span className="text-sm text-mc-text-muted">Unassigned</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-[11px] font-bold text-mc-text-muted mb-1 uppercase tracking-widest">Created</h3>
                            <span className="text-sm text-mc-text">
                                {new Date(task.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border border-mc-border rounded-xl p-4 space-y-3">
                        <h3 className="text-[11px] font-bold text-mc-text-muted uppercase tracking-widest">Actions</h3>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((s) => (
                                <button
                                    key={s.value}
                                    onClick={() => handleStatusChange(s.value)}
                                    disabled={isUpdating || task.status === s.value}
                                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${task.status === s.value
                                        ? "border-mc-text bg-mc-text text-white"
                                        : "border-mc-border text-mc-text-secondary hover:text-mc-text hover:border-mc-border-dark"
                                        } disabled:opacity-50`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                        {agents && (
                            <div>
                                <label className="text-xs text-mc-text-muted mb-1 block">Assign to:</label>
                                <select
                                    value={task.assignee || ""}
                                    onChange={(e) => handleAssign(e.target.value)}
                                    className="bg-mc-bg border border-mc-border rounded-lg text-sm text-mc-text px-3 py-1.5 w-full focus:outline-none focus:border-mc-border-dark"
                                >
                                    <option value="">Unassigned</option>
                                    {agents.map((a) => (
                                        <option key={a._id} value={a.name}>
                                            {a.name} — {a.role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Agent Collaboration Timeline */}
                    <div>
                        <h3 className="text-[11px] font-bold text-mc-text-muted mb-3 uppercase tracking-widest">
                            Agent Work Timeline ({task.messages?.length || 0})
                        </h3>
                        <div className="relative mb-4 max-h-72 overflow-y-auto">
                            {task.messages?.length === 0 && (
                                <p className="text-mc-text-muted text-sm py-2">No agent activity on this task yet.</p>
                            )}
                            {task.messages?.map((msg, i) => (
                                <div key={msg._id} className="flex gap-3 relative">
                                    {/* Connecting line */}
                                    {i < (task.messages?.length || 0) - 1 && (
                                        <div className="absolute left-[11px] top-7 bottom-0 w-px bg-mc-border" />
                                    )}
                                    {/* Avatar */}
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5 z-10"
                                        style={{ backgroundColor: getAgentColor(msg.agent) }}
                                    >
                                        {msg.agent[0]}
                                    </div>
                                    {/* Content */}
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-baseline gap-2 mb-0.5">
                                            <span
                                                className="text-sm font-semibold"
                                                style={{ color: getAgentColor(msg.agent) }}
                                            >
                                                {msg.agent}
                                            </span>
                                            <span className="text-[10px] text-mc-text-muted">
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-mc-text-secondary leading-relaxed bg-mc-sidebar rounded-lg px-3 py-2">
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                                placeholder="Add a comment..."
                                className="flex-1 bg-mc-bg border border-mc-border rounded-lg px-3 py-2 text-sm text-mc-text placeholder-mc-text-muted focus:outline-none focus:border-mc-border-dark"
                            />
                            <button
                                onClick={handleComment}
                                disabled={!comment.trim()}
                                className="px-4 py-2 bg-mc-text text-white text-sm rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                    {/* Deliverables */}
                    {task.deliverables && task.deliverables.length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-bold text-mc-text-muted mb-3 uppercase tracking-widest">
                                Deliverables ({task.deliverables.length})
                            </h3>
                            <div className="space-y-2">
                                {task.deliverables.map((d) => (
                                    <div
                                        key={d._id}
                                        className="bg-mc-sidebar border border-mc-border rounded-lg p-3 flex items-center gap-3"
                                    >
                                        <span className="text-lg">
                                            {d.type === "post" ? "📝" : d.type === "email" ? "✉️" : d.type === "code" ? "💻" : d.type === "research" ? "🔬" : "📄"}
                                        </span>
                                        <div>
                                            <p className="text-sm text-mc-text font-medium">{d.title}</p>
                                            <p className="text-xs text-mc-text-muted capitalize">{d.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
