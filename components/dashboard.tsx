"use client";

import { useState, useEffect } from "react";

import { useMobile } from "@/hooks/use-mobile";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeContentTab, setActiveContentTab] = useState("transactions");
  const isMobile = useMobile();

  // Map sidebar navigation to content tabs
  useEffect(() => {
    if (activeTab === "dashboard") {
      // Keep current content tab when on dashboard
    } else if (
      ["transactions", "blocks", "wallet", "liquidity", "analytics"].includes(
        activeTab
      )
    ) {
      setActiveContentTab(activeTab);
    }
  }, [activeTab]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="hidden flex-1 px-8 md:block">
            <div className="relative max-w-md">
              <Input
                placeholder="Token Address"
                className="border-gray-800 bg-black/40 pl-10 text-gray-300 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div className="flex flex-col gap-4"></div>
        </div>
      </div>
    </div>
  );
}
