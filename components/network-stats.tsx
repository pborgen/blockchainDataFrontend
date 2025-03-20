"use client"

import { useState, useEffect } from "react"
import { Activity, Zap, Clock, Database } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchNetworkStats } from "@/lib/api"
import { cn } from "@/lib/utils"

interface NetworkStatsData {
  price: number
  priceChange: number
  marketCap: number
  transactions: number
  tps: number
  blockTime: number
  difficulty: number
}

export default function NetworkStats() {
  const [stats, setStats] = useState<NetworkStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true)
        const data = await fetchNetworkStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch network stats:", error)
      } finally {
        setLoading(false)
      }
    }

    getStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-purple-400">Network Stats</h2>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Failed to load network stats</p>
      </div>
    )
  }

  const statItems = [
    {
      icon: Activity,
      label: "Price",
      value: `$${stats.price.toLocaleString()}`,
      change: stats.priceChange,
      color: "text-green-400",
    },
    {
      icon: Zap,
      label: "TPS",
      value: stats.tps.toFixed(1),
      color: "text-yellow-400",
    },
    {
      icon: Clock,
      label: "Block Time",
      value: `${stats.blockTime.toFixed(1)}s`,
      color: "text-blue-400",
    },
    {
      icon: Database,
      label: "Transactions",
      value: stats.transactions.toLocaleString(),
      color: "text-purple-400",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-purple-400">Network Stats</h2>
      <div className="space-y-4">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-black/40", item.color)}>
              <item.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
            <div className="flex items-center gap-1">
              <p className={cn("font-mono text-sm font-medium", item.color)}>{item.value}</p>
              {item.change !== undefined && (
                <span className={cn("text-xs", item.change >= 0 ? "text-green-400" : "text-red-400")}>
                  {item.change >= 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

