"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getAgentColor } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export default function SquadChat() {
    const messages = useQuery(api.squadChat.getSquadChat);
    const postMessage = useMutation(api.squadChat.post);

    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Reverse for display (query returns desc, we want asc)
    const sorted = messages ? [...messages].reverse() : null;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [sorted?.length]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1. Save to Convex (shows in UI)
        await postMessage({
            agent: "Talal",
            content: input.trim(),
        });

        // 2. Send to OpenClaw (so agents see it)
        fetch("/api/send-to-openclaw", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "chat_message",
                message: input.trim(),
            }),
        }).catch(() => { });

        setInput("");
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-[11px] font-bold tracking-widest text-mc-text-muted uppercase mb-3">
                💬 Squad Chat
            </h3>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-2.5 mb-3 min-h-0"
            >
                {!sorted ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex gap-2">
                                <div className="skeleton w-6 h-6 rounded-full flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="skeleton h-3 w-16 mb-1" />
                                    <div className="skeleton h-4 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="text-center text-mc-text-muted text-xs py-4">
                        No messages yet
                    </div>
                ) : (
                    sorted.map((msg) => (
                        <div key={msg._id} className="flex gap-2 group">
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: getAgentColor(msg.agent) }}
                            >
                                {msg.agent[0]}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-baseline gap-1.5">
                                    <span
                                        className="text-xs font-semibold"
                                        style={{ color: getAgentColor(msg.agent) }}
                                    >
                                        {msg.agent}
                                    </span>
                                    <span className="text-[10px] text-mc-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-mc-text-secondary leading-snug break-words">
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="border-t border-mc-border pt-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Message your squad..."
                        className="flex-1 bg-mc-bg border border-mc-border rounded-lg px-2.5 py-1.5 text-sm text-mc-text placeholder-mc-text-muted focus:outline-none focus:border-mc-border-dark"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="px-3 py-1.5 bg-mc-text text-white text-xs rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-30"
                    >
                        ↑
                    </button>
                </div>
            </div>
        </div>
    );
}
