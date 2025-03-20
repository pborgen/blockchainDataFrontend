"use client"

import { Menu, X, Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeTab?: string
}

export default function Header({ sidebarOpen, setSidebarOpen, activeTab = "dashboard" }: HeaderProps) {
  // Function to get the title based on the active tab
  const getTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard"
      case "transactions":
        return "Transactions"
      case "blocks":
        return "Blocks"
      case "wallet":
        return "Wallet"
      case "liquidity":
        return "Liquidity Pools"
      case "analytics":
        return "Analytics"
      case "settings":
        return "Settings"
      case "help":
        return "Help & Support"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="border-b border-gray-800/50 bg-black/60 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2 text-gray-400 hover:text-cyan-400"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500 blur-sm"></div>
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-black text-cyan-400">
                <span className="font-mono text-xs font-bold">BC</span>
              </div>
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
                HEXLIVE
              </h1>
              <p className="text-xs text-gray-500">{getTitle()}</p>
            </div>
          </div>
        </div>

        <div className="hidden flex-1 px-8 md:block">
          <div className="relative max-w-md">
            <Input
              placeholder="Search transactions, blocks, addresses..."
              className="border-gray-800 bg-black/40 pl-10 text-gray-300 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-cyan-400">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-500"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cyan-400">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-gray-800 bg-black/90 backdrop-blur-sm">
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-cyan-400">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-cyan-400">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-cyan-400">
                Disconnect Wallet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

