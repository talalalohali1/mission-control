import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "mc-bg": "#faf9f7",
                "mc-card": "#ffffff",
                "mc-border": "#e8e5e1",
                "mc-border-dark": "#d4d1cc",
                "mc-text": "#1a1a1a",
                "mc-text-secondary": "#6b6b6b",
                "mc-text-muted": "#9a9a9a",
                "mc-accent": "#e67e22",
                "mc-green": "#27ae60",
                "mc-orange": "#e67e22",
                "mc-blue": "#3498db",
                "mc-purple": "#8e44ad",
                "mc-red": "#e74c3c",
                "mc-sidebar": "#f5f3f0",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
            },
        },
    },
    plugins: [],
};
export default config;
