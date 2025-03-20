"use client"

import { useState, useEffect } from "react"
import { CuboidIcon as Cube, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchBlocks } from "@/lib/api"

interface Block {
  id: string
  number: number
  hash: string
  timestamp: number
  transactions: number
  miner: string
  gasUsed: string
}

export default function BlockExplorer() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getBlocks = async () => {
      try {
        setLoading(true)
        const data = await fetchBlocks()
        setBlocks(data)
      } catch (error) {
        console.error("Failed to fetch blocks:", error)
      } finally {
        setLoading(false)
      }
    }

    getBlocks()
  }, [])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000)
    const diff = now - timestamp

    if (diff < 60) return `${diff} sec ago`
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-purple-400">Latest Blocks</h2>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-800/50 bg-black/40 p-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple-400">Latest Blocks</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-purple-500/20 bg-black/40 text-purple-400 hover:bg-purple-900/20"
        >
          View All
        </Button>
      </div>

      {blocks.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-gray-800/50 bg-black/40 p-4">
          <p className="text-gray-500">No blocks found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="group relative overflow-hidden rounded-lg border border-gray-800/50 bg-black/40 p-4 transition-all duration-300 hover:border-purple-500/30 hover:bg-black/60 hover:shadow-[0_0_15px_rgba(128,0,255,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 blur-xl transition-opacity duration-1000 group-hover:opacity-100"></div>

              <div className="relative flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-900/20 text-purple-400">
                  <Cube className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-sm font-medium text-gray-300">
                      Block #{block.number.toLocaleString()}
                    </h3>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-purple-400">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{formatAddress(block.hash)}</span>
                    <span className="ml-2 text-gray-600">•</span>
                    <span>{formatTimestamp(block.timestamp)}</span>
                    <span className="ml-2 text-gray-600">•</span>
                    <span>{block.transactions} txns</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Miner</span>
                  <span className="font-mono text-purple-400">{formatAddress(block.miner)}</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-500 hover:bg-purple-900/20 hover:text-purple-400"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

