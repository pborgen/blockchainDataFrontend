"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-black text-gray-100">
          <Sidebar
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          <div className="flex flex-1 flex-col">
            <Header
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              activeTab={activeTab}
            />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
