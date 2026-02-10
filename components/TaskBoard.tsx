"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TaskCard from "./TaskCard";

interface TaskBoardProps {
    onTaskClick: (taskId: string) => void;
}

const COLUMNS = [
    { key: "inbox", label: "INBOX", color: "#e67e22" },
    { key: "in_progress", label: "IN PROGRESS", color: "#8e44ad" },
    { key: "review", label: "REVIEW", color: "#f39c12" },
    { key: "done", label: "DONE", color: "#27ae60" },
] as const;

export default function TaskBoard({ onTaskClick }: TaskBoardProps) {
    const tasks = useQuery(api.tasks.getTasks);

    if (!tasks) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full">
                {COLUMNS.map((col) => (
                    <div key={col.key} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <div className="skeleton h-4 w-24" />
                        </div>
                        <div className="space-y-3 flex-1">
                            <div className="skeleton h-28 w-full rounded-lg" />
                            <div className="skeleton h-24 w-full rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const tasksByStatus = COLUMNS.map((col) => ({
        ...col,
        tasks: tasks.filter((t) => t.status === col.key),
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full">
            {tasksByStatus.map((column) => (
                <div key={column.key} className="flex flex-col min-h-0">
                    {/* Column Header */}
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: column.color }}
                        />
                        <h3 className="text-[11px] font-bold tracking-widest text-mc-text-muted uppercase">
                            {column.label}
                        </h3>
                        <span className="text-[10px] bg-mc-border rounded px-1.5 py-0.5 font-mono text-mc-text-secondary ml-auto">
                            {column.tasks.length}
                        </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                        {column.tasks.length === 0 ? (
                            <div className="flex items-center justify-center h-24 text-mc-text-muted text-xs border border-dashed border-mc-border rounded-lg">
                                No tasks
                            </div>
                        ) : (
                            column.tasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onClick={() => onTaskClick(task._id)}
                                />
                            ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
