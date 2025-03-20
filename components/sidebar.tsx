"use client";
import {
  LayoutDashboard,
  BarChart3,
  Wallet,
  Layers,
  Settings,
  HelpCircle,
  X,
  Droplets,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
  open,
  setOpen,
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const isMobile = useMobile();

  const links = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", name: "Transactions", icon: Layers },
    { id: "blocks", name: "Blocks", icon: Layers },
    { id: "wallet", name: "Wallet", icon: Wallet },
    { id: "liquidity", name: "Liquidity Pools", icon: Droplets },
  ];

  const handleNavigation = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobile) {
      setOpen(false);
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform border-r border-gray-800/50 bg-black/80 backdrop-blur-md transition-all duration-200 ease-in-out md:relative md:z-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-20" : "w-64",
          "flex flex-col"
        )}
      >
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="absolute right-2 top-2 text-gray-400 hover:text-cyan-400 md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        <div className="relative mt-8 flex flex-1 flex-col gap-6 p-4">
          <div
            className={cn(
              "flex items-center gap-2 px-2",
              collapsed ? "justify-center" : ""
            )}
          >
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500 blur-sm"></div>
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-black text-cyan-400">
                <span className="font-mono text-xs font-bold">BC</span>
              </div>
            </div>
            {!collapsed && (
              <h2 className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
                HEXLIVE
              </h2>
            )}
          </div>

          <TooltipProvider delayDuration={0}>
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "justify-start gap-3 px-2 text-gray-400 hover:bg-gray-800/50 hover:text-cyan-400",
                        activeTab === link.id && "bg-cyan-900/20 text-cyan-400",
                        collapsed && "justify-center px-0"
                      )}
                      onClick={() => handleNavigation(link.id)}
                    >
                      <link.icon className="h-5 w-5" />
                      {!collapsed && <span>{link.name}</span>}
                    </Button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" className="z-[60]">
                      {link.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </nav>
          </TooltipProvider>

          {!collapsed && (
            <div className="mt-auto rounded-lg border border-purple-500/20 bg-purple-900/10 p-4 shadow-[0_0_10px_rgba(128,0,255,0.1)]">
              <h3 className="text-sm font-medium text-purple-400">
                Network Status
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-400">Ethereum Mainnet</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Gas</span>
                <span className="text-xs font-medium text-green-400">
                  12 Gwei
                </span>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="mt-auto flex justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-900/20 text-purple-400">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border border-gray-800 bg-black text-gray-400 hover:text-cyan-400"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </aside>
    </>
  );
}
