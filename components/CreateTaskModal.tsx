"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

interface CreateTaskModalProps {
    onClose: () => void;
}

export default function CreateTaskModal({ onClose }: CreateTaskModalProps) {
    const agents = useQuery(api.agents.getAgents);
    const createTask = useMutation(api.tasks.create);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [assignee, setAssignee] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setIsSubmitting(true);

        // 1. Save to Convex
        await createTask({
            title: title.trim(),
            description: description.trim() || undefined,
            priority,
            assignee: assignee || undefined,
        });

        // 2. Notify OpenClaw agents
        fetch("/api/send-to-openclaw", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "new_task",
                title: title.trim(),
                description: description.trim(),
                priority,
                assignee: assignee || undefined,
            }),
        }).catch(() => { });

        setIsSubmitting(false);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-mc-card border border-mc-border rounded-2xl w-full max-w-lg shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-mc-border">
                    <h2 className="text-sm font-bold text-mc-text uppercase tracking-wider">New Task</h2>
                    <button
                        onClick={onClose}
                        className="text-mc-text-muted hover:text-mc-text transition-colors text-xl leading-none p-1"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-[11px] font-bold text-mc-text-muted mb-1.5 uppercase tracking-widest">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title..."
                            className="w-full bg-mc-bg border border-mc-border rounded-lg px-3 py-2.5 text-sm text-mc-text placeholder-mc-text-muted focus:outline-none focus:border-mc-border-dark transition-colors"
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[11px] font-bold text-mc-text-muted mb-1.5 uppercase tracking-widest">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details..."
                            rows={3}
                            className="w-full bg-mc-bg border border-mc-border rounded-lg px-3 py-2.5 text-sm text-mc-text placeholder-mc-text-muted focus:outline-none focus:border-mc-border-dark transition-colors resize-none"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-[11px] font-bold text-mc-text-muted mb-2 uppercase tracking-widest">
                            Priority
                        </label>
                        <div className="flex gap-2">
                            {(["low", "medium", "high"] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={`flex-1 text-xs px-3 py-2 rounded-lg border transition-all capitalize font-medium ${priority === p
                                            ? p === "high"
                                                ? "border-red-300 bg-red-50 text-red-700"
                                                : p === "medium"
                                                    ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                                                    : "border-green-300 bg-green-50 text-green-700"
                                            : "border-mc-border text-mc-text-muted hover:text-mc-text-secondary hover:border-mc-border-dark"
                                        }`}
                                >
                                    {p === "high" && "🔥 "}{p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Assign to */}
                    <div>
                        <label className="block text-[11px] font-bold text-mc-text-muted mb-1.5 uppercase tracking-widest">
                            Assign to
                        </label>
                        <select
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            className="w-full bg-mc-bg border border-mc-border rounded-lg px-3 py-2.5 text-sm text-mc-text focus:outline-none focus:border-mc-border-dark transition-colors"
                        >
                            <option value="">Unassigned — goes to Inbox</option>
                            {agents?.map((a) => (
                                <option key={a._id} value={a.name}>
                                    {a.name} — {a.role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-mc-text-secondary hover:text-mc-text transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim() || isSubmitting}
                            className="px-6 py-2 bg-mc-text text-white text-sm rounded-lg font-semibold hover:bg-black transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
