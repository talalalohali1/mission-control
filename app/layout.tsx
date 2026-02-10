import type { Metadata } from "next";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";

export const metadata: Metadata = {
    title: "⚡ Mission Control",
    description: "Real-time command center for managing your AI agent squad",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased">
                <ConvexClientProvider>{children}</ConvexClientProvider>
            </body>
        </html>
    );
}
