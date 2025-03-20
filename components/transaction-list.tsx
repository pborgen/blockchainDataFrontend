"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchTransactions } from "@/lib/api"

interface Transaction {
  id: string
  hash: string
  from: string
  to: string
  value: string
  timestamp: number
  type: "in" | "out"
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getTransactions = async () => {
      try {
        setLoading(true)
        const data = await fetchTransactions()
        setTransactions(data)
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    getTransactions()
  }, [])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-cyan-400">Recent Transactions</h2>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-800/50 bg-black/40 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-cyan-400">Recent Transactions</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-cyan-500/20 bg-black/40 text-cyan-400 hover:bg-cyan-900/20"
        >
          View All
        </Button>
      </div>

      {transactions.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-gray-800/50 bg-black/40 p-4">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="group relative overflow-hidden rounded-lg border border-gray-800/50 bg-black/40 p-4 transition-all duration-300 hover:border-cyan-500/30 hover:bg-black/60 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 blur-xl transition-opacity duration-1000 group-hover:opacity-100"></div>

              <div className="relative flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    tx.type === "in" ? "bg-green-900/20 text-green-400" : "bg-pink-900/20 text-pink-400",
                  )}
                >
                  {tx.type === "in" ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-sm font-medium text-gray-300">{formatAddress(tx.hash)}</h3>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-cyan-400">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{formatAddress(tx.from)}</span>
                    <span>→</span>
                    <span>{formatAddress(tx.to)}</span>
                    <span className="ml-2 text-gray-600">•</span>
                    <span>{formatTimestamp(tx.timestamp)}</span>
                  </div>
                </div>

                <div
                  className={cn("font-mono text-sm font-medium", tx.type === "in" ? "text-green-400" : "text-pink-400")}
                >
                  {tx.type === "in" ? "+" : "-"}
                  {tx.value} ETH
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

