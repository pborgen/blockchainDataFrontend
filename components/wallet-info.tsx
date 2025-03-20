"use client"

import { useState, useEffect } from "react"
import { Wallet, Copy, ExternalLink, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { fetchWalletInfo } from "@/lib/api"
import { cn } from "@/lib/utils"

interface WalletData {
  address: string
  balance: {
    eth: number
    usd: number
  }
  tokens: Array<{
    id: string
    symbol: string
    name: string
    balance: number
    value: number
    change24h: number
  }>
}

export default function WalletInfo() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getWalletInfo = async () => {
      try {
        setLoading(true)
        const data = await fetchWalletInfo()
        setWalletData(data)
      } catch (error) {
        console.error("Failed to fetch wallet info:", error)
      } finally {
        setLoading(false)
      }
    }

    getWalletInfo()
  }, [])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="mt-1 h-4 w-32" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid gap-3 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!walletData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Wallet className="mx-auto h-12 w-12 text-green-400 opacity-50" />
          <h3 className="mt-4 text-lg font-medium text-gray-300">No Wallet Connected</h3>
          <p className="mt-2 text-sm text-gray-500">Connect your wallet to view your assets</p>
          <Button className="mt-4 bg-green-500 text-black hover:bg-green-400">Connect Wallet</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">Wallet</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-900/20 text-green-400">
            <Wallet className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm font-medium text-gray-300">{formatAddress(walletData.address)}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-500 hover:text-green-400"
                onClick={() => navigator.clipboard.writeText(walletData.address)}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-green-400">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-lg font-bold text-green-400">
              {walletData.balance.eth.toFixed(4)} ETH
              <span className="ml-2 text-sm text-gray-500">(${walletData.balance.usd.toLocaleString()})</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-green-500 text-black hover:bg-green-400">
              <ArrowDownLeft className="mr-1 h-4 w-4" />
              Receive
            </Button>
            <Button size="sm" className="bg-pink-500 text-black hover:bg-pink-400">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-green-400">Tokens</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {walletData.tokens.map((token) => (
            <div
              key={token.id}
              className="group relative overflow-hidden rounded-lg border border-gray-800/50 bg-black/40 p-4 transition-all duration-300 hover:border-green-500/30 hover:bg-black/60 hover:shadow-[0_0_15px_rgba(0,255,128,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent opacity-0 blur-xl transition-opacity duration-1000 group-hover:opacity-100"></div>

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-800"></div>
                    <div>
                      <h4 className="font-medium text-gray-300">{token.symbol}</h4>
                      <p className="text-xs text-gray-500">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-300">{token.balance.toFixed(4)}</p>
                    <p className="text-xs text-gray-500">${token.value.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Progress
                    value={50 + token.change24h}
                    className="h-1 bg-gray-800"
                    indicatorClassName={token.change24h >= 0 ? "bg-green-500" : "bg-red-500"}
                  />
                  <span className={cn("text-xs", token.change24h >= 0 ? "text-green-400" : "text-red-400")}>
                    {token.change24h >= 0 ? "+" : ""}
                    {token.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

