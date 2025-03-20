"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import TransactionList from "@/components/transaction-list"
import BlockExplorer from "@/components/block-explorer"
import NetworkStats from "@/components/network-stats"
import WalletInfo from "@/components/wallet-info"
import PriceChart from "@/components/price-chart"
import LiquidityPoolGrid from "@/components/liquidity-pool-grid"
import { useMobile } from "@/hooks/use-mobile"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [activeContentTab, setActiveContentTab] = useState("transactions")
  const isMobile = useMobile()

  // Map sidebar navigation to content tabs
  useEffect(() => {
    if (activeTab === "dashboard") {
      // Keep current content tab when on dashboard
    } else if (["transactions", "blocks", "wallet", "liquidity", "analytics"].includes(activeTab)) {
      setActiveContentTab(activeTab)
    }
  }, [activeTab])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} />

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === "dashboard" ? (
            // Dashboard View
            <div className="grid gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="col-span-1 border-cyan-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(0,255,255,0.15)] backdrop-blur-sm md:col-span-2">
                  <PriceChart />
                </Card>
                <Card className="border-purple-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(128,0,255,0.15)] backdrop-blur-sm">
                  <NetworkStats />
                </Card>
              </div>

              <Tabs value={activeContentTab} onValueChange={setActiveContentTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-black/40 backdrop-blur-sm">
                  <TabsTrigger
                    value="transactions"
                    className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400"
                  >
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger
                    value="blocks"
                    className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400"
                  >
                    Blocks
                  </TabsTrigger>
                  <TabsTrigger
                    value="wallet"
                    className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400"
                  >
                    Wallet
                  </TabsTrigger>
                  <TabsTrigger
                    value="liquidity"
                    className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-400"
                  >
                    Liquidity
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="data-[state=active]:bg-pink-900/30 data-[state=active]:text-pink-400"
                  >
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="mt-4">
                  <Card className="border-cyan-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(0,255,255,0.15)] backdrop-blur-sm">
                    <TransactionList />
                  </Card>
                </TabsContent>

                <TabsContent value="blocks" className="mt-4">
                  <Card className="border-purple-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(128,0,255,0.15)] backdrop-blur-sm">
                    <BlockExplorer />
                  </Card>
                </TabsContent>

                <TabsContent value="wallet" className="mt-4">
                  <Card className="border-green-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(0,255,128,0.15)] backdrop-blur-sm">
                    <WalletInfo />
                  </Card>
                </TabsContent>

                <TabsContent value="liquidity" className="mt-4">
                  <Card className="border-blue-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(0,128,255,0.15)] backdrop-blur-sm">
                    <LiquidityPoolGrid />
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="mt-4">
                  <Card className="border-pink-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(255,0,128,0.15)] backdrop-blur-sm">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="border-pink-500/20 bg-black/40 p-4">
                        <h3 className="mb-2 text-lg font-bold text-pink-400">Gas Usage</h3>
                        <div className="h-[200px] w-full rounded-md border border-pink-500/20 bg-black/20"></div>
                      </Card>
                      <Card className="border-pink-500/20 bg-black/40 p-4">
                        <h3 className="mb-2 text-lg font-bold text-pink-400">Network Activity</h3>
                        <div className="h-[200px] w-full rounded-md border border-pink-500/20 bg-black/20"></div>
                      </Card>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Single Content View (when selected from sidebar)
            <div className="grid gap-6">
              {activeTab === "transactions" && (
                <Card className="border-cyan-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(0,255,255,0.15)] backdrop-blur-sm">
                  <TransactionList />
                </Card>
              )}

              {activeTab === "blocks" && (
                <Card className="border-purple-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(128,0,255,0.15)] backdrop-blur-sm">
                  <BlockExplorer />
                </Card>
              )}

              {activeTab === "wallet" && (
                <Card className="border-green-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(0,255,128,0.15)] backdrop-blur-sm">
                  <WalletInfo />
                </Card>
              )}

              {activeTab === "liquidity" && (
                <Card className="border-blue-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(0,128,255,0.15)] backdrop-blur-sm">
                  <LiquidityPoolGrid />
                </Card>
              )}

              {activeTab === "analytics" && (
                <Card className="border-pink-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(255,0,128,0.15)] backdrop-blur-sm">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-pink-500/20 bg-black/40 p-4">
                      <h3 className="mb-2 text-lg font-bold text-pink-400">Gas Usage</h3>
                      <div className="h-[200px] w-full rounded-md border border-pink-500/20 bg-black/20"></div>
                    </Card>
                    <Card className="border-pink-500/20 bg-black/40 p-4">
                      <h3 className="mb-2 text-lg font-bold text-pink-400">Network Activity</h3>
                      <div className="h-[200px] w-full rounded-md border border-pink-500/20 bg-black/20"></div>
                    </Card>
                  </div>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card className="border-gray-800/50 bg-black/60 p-4 shadow-[0_0_15px_rgba(128,128,128,0.15)] backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-gray-300">Settings</h2>
                  <p className="mt-2 text-gray-500">Settings panel coming soon...</p>
                </Card>
              )}

              {activeTab === "help" && (
                <Card className="border-gray-800/50 bg-black/60 p-4 shadow-[0_0_15px_rgba(128,128,128,0.15)] backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-gray-300">Help & Support</h2>
                  <p className="mt-2 text-gray-500">Help documentation coming soon...</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

