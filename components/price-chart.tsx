"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUp, ArrowDown, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchPriceData } from "@/lib/api"
import { cn } from "@/lib/utils"

interface PriceData {
  current: number
  change: number
  changePercent: number
  high24h: number
  low24h: number
  chartData: Array<{
    timestamp: number
    price: number
  }>
}

const timeRanges = ["1D", "1W", "1M", "3M", "1Y", "ALL"]

export default function PriceChart() {
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("1D")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const getPriceData = async () => {
      try {
        setLoading(true)
        const data = await fetchPriceData(timeRange)
        setPriceData(data)
      } catch (error) {
        console.error("Failed to fetch price data:", error)
      } finally {
        setLoading(false)
      }
    }

    getPriceData()
  }, [timeRange])

  useEffect(() => {
    if (!priceData || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    const chartData = priceData.chartData
    if (chartData.length < 2) return

    // Find min and max values
    const prices = chartData.map((d) => d.price)
    const minPrice = Math.min(...prices) * 0.99
    const maxPrice = Math.max(...prices) * 1.01
    const priceRange = maxPrice - minPrice

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    if (priceData.change >= 0) {
      gradient.addColorStop(0, "rgba(0, 255, 128, 0.2)")
      gradient.addColorStop(1, "rgba(0, 255, 128, 0)")
    } else {
      gradient.addColorStop(0, "rgba(255, 0, 128, 0.2)")
      gradient.addColorStop(1, "rgba(255, 0, 128, 0)")
    }

    // Draw chart line
    ctx.beginPath()
    chartData.forEach((dataPoint, i) => {
      const x = (i / (chartData.length - 1)) * width
      const y = height - ((dataPoint.price - minPrice) / priceRange) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    // Complete the gradient area
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()

    ctx.fillStyle = gradient
    ctx.fill()

    // Draw the line
    ctx.beginPath()
    chartData.forEach((dataPoint, i) => {
      const x = (i / (chartData.length - 1)) * width
      const y = height - ((dataPoint.price - minPrice) / priceRange) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.strokeStyle = priceData.change >= 0 ? "#00ff80" : "#ff0080"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw dots at data points (optional, for larger timeframes)
    if (timeRange !== "1D" && chartData.length < 30) {
      chartData.forEach((dataPoint, i) => {
        const x = (i / (chartData.length - 1)) * width
        const y = height - ((dataPoint.price - minPrice) / priceRange) * height

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = priceData.change >= 0 ? "#00ff80" : "#ff0080"
        ctx.fill()
      })
    }
  }, [priceData, timeRange])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  if (!priceData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Failed to load price data</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-300">ETH/USD</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 rounded-full bg-gray-800/50 px-2 text-xs text-gray-400 hover:bg-gray-800 hover:text-cyan-400"
                >
                  ETH
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[120px] border-gray-800 bg-black/90 backdrop-blur-sm">
                <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-cyan-400">BTC</DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-cyan-400">SOL</DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-cyan-400">
                  AVAX
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-300">${priceData.current.toLocaleString()}</p>
            <div
              className={cn(
                "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
                priceData.change >= 0 ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400",
              )}
            >
              {priceData.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {priceData.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-md px-3 text-xs",
                timeRange === range
                  ? "bg-cyan-900/30 text-cyan-400"
                  : "text-gray-500 hover:bg-gray-800/50 hover:text-gray-300",
              )}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative h-[200px] w-full">
        <canvas ref={canvasRef} className="h-full w-full" width={800} height={400} />

        <div className="absolute bottom-2 left-2 flex gap-4 text-xs text-gray-500">
          <div>
            <span className="mr-1">H:</span>
            <span className="text-green-400">${priceData.high24h.toLocaleString()}</span>
          </div>
          <div>
            <span className="mr-1">L:</span>
            <span className="text-red-400">${priceData.low24h.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

