"use client"

import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown, ExternalLink, TrendingUp, DollarSign, Percent, ArrowUpDown, ChevronUp, Info } from "lucide-react"
import { fetchLiquidityPools } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface LiquidityPool {
  id: string
  tokenPair: string
  token0Symbol: string
  token1Symbol: string
  tvl: number
  apy: number
  volume24h: number
  feeTier: string
}

interface DexOption {
  id: string
  name: string
  logo: string
  color: string
}

const dexOptions: DexOption[] = [
  { id: "uniswap", name: "Uniswap", logo: "U", color: "text-pink-400" },
  { id: "sushiswap", name: "SushiSwap", logo: "🍣", color: "text-blue-400" },
  { id: "pancakeswap", name: "PancakeSwap", logo: "🥞", color: "text-yellow-400" },
  { id: "curve", name: "Curve", logo: "C", color: "text-red-400" },
  { id: "balancer", name: "Balancer", logo: "B", color: "text-purple-400" },
]

export default function LiquidityPoolGrid() {
  const [selectedDex, setSelectedDex] = useState<DexOption>(dexOptions[0])
  const [pools, setPools] = useState<LiquidityPool[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<keyof LiquidityPool>("tvl")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const isMobile = useMobile()

  useEffect(() => {
    const getLiquidityPools = async () => {
      try {
        setLoading(true)
        const data = await fetchLiquidityPools(selectedDex.id)
        setPools(data)
      } catch (error) {
        console.error("Failed to fetch liquidity pools:", error)
      } finally {
        setLoading(false)
      }
    }

    getLiquidityPools()
  }, [selectedDex])

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`
    } else {
      return `$${value.toFixed(2)}`
    }
  }

  const handleSort = (field: keyof LiquidityPool) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedPools = [...pools].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
  })

  const SortIcon = ({ field }: { field: keyof LiquidityPool }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
  }

  // Render mobile card view or desktop table view based on screen size
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-400">Liquidity Pools</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-blue-500/20 bg-black/40 text-gray-300 hover:bg-blue-900/20 hover:text-blue-400"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn("flex h-6 w-6 items-center justify-center rounded-full bg-black/60", selectedDex.color)}
                >
                  <span className="text-xs">{selectedDex.logo}</span>
                </div>
                <span>{selectedDex.name}</span>
              </div>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] border-gray-800 bg-black/90 backdrop-blur-sm">
            {dexOptions.map((dex) => (
              <DropdownMenuItem
                key={dex.id}
                onClick={() => setSelectedDex(dex)}
                className="text-gray-300 focus:bg-gray-800 focus:text-blue-400"
              >
                <div className="flex items-center gap-2">
                  <div className={cn("flex h-6 w-6 items-center justify-center rounded-full bg-black/60", dex.color)}>
                    <span className="text-xs">{dex.logo}</span>
                  </div>
                  <span>{dex.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isMobile ? (
        // Mobile card view
        <div className="space-y-3">
          {loading
            ? // Skeleton loading state for mobile
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="border-gray-800/50 bg-black/40 p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </Card>
                ))
            : sortedPools.map((pool) => (
                <Card
                  key={pool.id}
                  className="group relative overflow-hidden border-gray-800/50 bg-black/40 p-4 transition-all duration-300 hover:border-blue-500/30 hover:bg-black/60 hover:shadow-[0_0_15px_rgba(0,128,255,0.1)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 blur-xl transition-opacity duration-1000 group-hover:opacity-100"></div>

                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-8">
                          <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 ring-2 ring-black">
                            <span className="text-xs font-bold">{pool.token0Symbol}</span>
                          </div>
                          <div className="absolute left-6 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 ring-2 ring-black">
                            <span className="text-xs font-bold">{pool.token1Symbol}</span>
                          </div>
                        </div>
                        <span className="ml-4 font-medium text-gray-300">{pool.tokenPair}</span>
                      </div>
                      <div className="flex items-center gap-1 rounded-md bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-400">
                        <Percent className="h-3 w-3" />
                        {pool.feeTier}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1 rounded-md bg-black/30 p-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <DollarSign className="h-3 w-3" />
                          <span>TVL</span>
                        </div>
                        <p className="font-mono text-sm font-medium text-gray-300">{formatCurrency(pool.tvl)}</p>
                      </div>

                      <div className="space-y-1 rounded-md bg-black/30 p-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Percent className="h-3 w-3" />
                          <span>APY</span>
                        </div>
                        <p className="font-mono text-sm font-medium text-green-400">{pool.apy.toFixed(2)}%</p>
                      </div>

                      <div className="space-y-1 rounded-md bg-black/30 p-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <TrendingUp className="h-3 w-3" />
                          <span>Volume 24h</span>
                        </div>
                        <p className="font-mono text-sm font-medium text-gray-300">{formatCurrency(pool.volume24h)}</p>
                      </div>

                      <div className="flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-gray-500 hover:bg-blue-900/20 hover:text-blue-400"
                        >
                          <span>View Details</span>
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
        </div>
      ) : (
        // Desktop table view
        <div className="relative overflow-hidden rounded-lg border border-gray-800/50 bg-black/40 shadow-[0_0_15px_rgba(0,128,255,0.1)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/60 text-xs uppercase text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <button
                      onClick={() => handleSort("tokenPair")}
                      className="flex items-center font-medium text-blue-400 hover:text-blue-300"
                    >
                      Pool
                      <SortIcon field="tokenPair" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <button
                      onClick={() => handleSort("tvl")}
                      className="flex items-center font-medium text-blue-400 hover:text-blue-300"
                    >
                      TVL
                      <SortIcon field="tvl" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <button
                      onClick={() => handleSort("apy")}
                      className="flex items-center font-medium text-blue-400 hover:text-blue-300"
                    >
                      APY
                      <SortIcon field="apy" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <button
                      onClick={() => handleSort("volume24h")}
                      className="flex items-center font-medium text-blue-400 hover:text-blue-300"
                    >
                      Volume 24h
                      <SortIcon field="volume24h" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <button
                      onClick={() => handleSort("feeTier")}
                      className="flex items-center font-medium text-blue-400 hover:text-blue-300"
                    >
                      Fee Tier
                      <SortIcon field="feeTier" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? // Skeleton loading state
                    Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={index} className="border-b border-gray-800/30 bg-black/20">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-8 w-16 rounded-full" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-20" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-16" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-12" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-8 w-8 rounded-md" />
                          </td>
                        </tr>
                      ))
                  : sortedPools.map((pool) => (
                      <tr
                        key={pool.id}
                        className="border-b border-gray-800/30 bg-black/20 transition-colors hover:bg-blue-900/10"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-8">
                              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 ring-2 ring-black">
                                <span className="text-xs font-bold">{pool.token0Symbol}</span>
                              </div>
                              <div className="absolute left-6 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 ring-2 ring-black">
                                <span className="text-xs font-bold">{pool.token1Symbol}</span>
                              </div>
                            </div>
                            <span className="ml-4 font-medium text-gray-300">{pool.tokenPair}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-300">{formatCurrency(pool.tvl)}</td>
                        <td className="px-6 py-4 font-mono text-green-400">{pool.apy.toFixed(2)}%</td>
                        <td className="px-6 py-4 font-mono text-gray-300">{formatCurrency(pool.volume24h)}</td>
                        <td className="px-6 py-4">
                          <div className="flex w-fit items-center gap-1 rounded-md bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-400">
                            <Percent className="h-3 w-3" />
                            {pool.feeTier}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-500 hover:bg-blue-900/20 hover:text-blue-400"
                          >
                            <span>Details</span>
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && pools.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-lg border border-gray-800/50 bg-black/40 p-4">
          <p className="text-gray-500">No liquidity pools found</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Info className="h-3 w-3" />
        <p>
          {isMobile ? "Showing" : "Click on column headers to sort. Showing"} {sortedPools.length} pools from{" "}
          {selectedDex.name}
        </p>
      </div>
    </div>
  )
}

