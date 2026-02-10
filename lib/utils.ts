export function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `about ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `about ${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function getAgentColor(name: string): string {
    const colors: Record<string, string> = {
        Jarvis: "#e67e22",
        Shuri: "#e74c3c",
        Fury: "#8e44ad",
        Vision: "#3498db",
        Loki: "#27ae60",
        Quill: "#d35400",
        Wanda: "#c0392b",
        Pepper: "#f39c12",
        Friday: "#2980b9",
        Wong: "#16a085",
        Bhanu: "#e67e22",
        Talal: "#1a1a1a",
        System: "#6b7280",
    };
    return colors[name] || "#6b7280";
}

export function cn(...classes: (string | false | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
