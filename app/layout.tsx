"use client";
import {ReactNode} from "react";
import "./globals.css";
import {SessionProvider} from "next-auth/react";
import Header from "@/components/Header";

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionProvider>

            <Header />

            {children}

        </SessionProvider>
        </body>
        </html>
    );
}