"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import StatsBar from "./StatsBar";
import TaskBoard from "./TaskBoard";
import TaskModal from "./TaskModal";
import CreateTaskModal from "./CreateTaskModal";
import ActivityFeed from "./ActivityFeed";
import AgentStatus from "./AgentStatus";
import SquadChat from "./SquadChat";

export default function Dashboard() {
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [toast, setToast] = useState<string | null>(null);

    const seed = useMutation(api.seed.seed);
    const tasks = useQuery(api.tasks.getTasks);

    // Live clock
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Toast auto-dismiss
    useEffect(() => {
        if (toast) {
            const timeout = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timeout);
        }
    }, [toast]);

    // Keyboard shortcuts
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
        if (e.key === "n") {
            e.preventDefault();
            setShowCreateTask(true);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const handleSeed = async () => {
        const result = await seed();
        setToast(typeof result === "string" ? result : "Seeded!");
    };

    const activeTasks = tasks?.filter((t) => t.status !== "done").length || 0;

    return (
        <div className="h-screen flex flex-col bg-mc-bg overflow-hidden">
            {/* ─── HEADER ─── */}
            <header className="border-b border-mc-border bg-mc-card px-5 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg">◉</span>
                        <h1 className="text-sm font-extrabold tracking-wider uppercase text-mc-text">
                            Mission Control
                        </h1>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-mc-border" />

                    {/* Stats */}
                    <StatsBar />
                </div>

                <div className="flex items-center gap-3">
                    {/* Seed button */}
                    <button
                        onClick={handleSeed}
                        className="text-[11px] px-3 py-1.5 rounded border border-mc-border text-mc-text-secondary hover:text-mc-text hover:border-mc-border-dark transition-all font-medium"
                        title="Seed demo data"
                    >
                        🌱 Seed
                    </button>

                    {/* New Task */}
                    <button
                        onClick={() => setShowCreateTask(true)}
                        className="text-[11px] px-3 py-1.5 rounded bg-mc-text text-white font-medium hover:bg-black transition-colors"
                        title="New task (N)"
                    >
                        + New Task
                    </button>

                    {/* Divider */}
                    <div className="w-px h-6 bg-mc-border" />

                    {/* Docs */}
                    <button className="text-[11px] px-2.5 py-1.5 rounded border border-mc-border text-mc-text-secondary hover:text-mc-text transition-colors font-medium">
                        ◈ Docs
                    </button>

                    {/* Time */}
                    <div className="text-right">
                        <div className="text-sm font-mono font-semibold text-mc-text">
                            {currentTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })}
                        </div>
                        <div className="text-[9px] font-semibold tracking-widest text-mc-text-muted uppercase">
                            {currentTime.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            })}
                        </div>
                    </div>

                    {/* Online badge */}
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                        <div className="w-2 h-2 rounded-full bg-mc-green relative status-pulse" />
                        <span className="text-[10px] font-bold text-mc-green uppercase tracking-wider">
                            Online
                        </span>
                    </div>
                </div>
            </header>

            {/* ─── MAIN 3-COLUMN LAYOUT ─── */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* LEFT SIDEBAR — Agents */}
                <aside className="w-64 border-r border-mc-border bg-mc-card flex-shrink-0 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <AgentStatus />
                    </div>
                </aside>

                {/* CENTER — Mission Queue + Squad Chat */}
                <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    {/* Queue Header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-mc-border">
                        <h2 className="text-xs font-bold tracking-widest text-mc-text-muted uppercase">
                            ✦ Mission Queue
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-mc-border rounded px-2 py-0.5 font-mono text-mc-text-secondary">
                                ⊙ {activeTasks}
                            </span>
                            <span className="text-[10px] text-mc-text-muted font-medium">
                                {tasks?.length || 0} active
                            </span>
                        </div>
                    </div>

                    {/* Kanban Board */}
                    <div className="flex-1 overflow-x-auto overflow-y-auto p-5 min-h-0">
                        <TaskBoard onTaskClick={(id) => setSelectedTaskId(id)} />
                    </div>

                    {/* Squad Chat — Full Width Bottom Panel */}
                    <div className="border-t border-mc-border bg-mc-card flex-shrink-0" style={{ height: "280px" }}>
                        <div className="h-full p-4">
                            <SquadChat />
                        </div>
                    </div>
                </main>

                {/* RIGHT SIDEBAR — Live Feed */}
                <aside className="w-80 border-l border-mc-border bg-mc-card flex-shrink-0 overflow-hidden flex flex-col">
                    <ActivityFeed />
                </aside>
            </div>

            {/* ─── MODALS ─── */}
            {selectedTaskId && (
                <TaskModal
                    taskId={selectedTaskId}
                    onClose={() => setSelectedTaskId(null)}
                />
            )}
            {showCreateTask && (
                <CreateTaskModal onClose={() => setShowCreateTask(false)} />
            )}

            {/* ─── TOAST ─── */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 toast-enter">
                    <div className="bg-mc-card border border-mc-border rounded-xl px-4 py-3 shadow-lg">
                        <p className="text-sm text-mc-text">{toast}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
