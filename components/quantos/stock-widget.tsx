"use client"

import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StockWidgetProps {
  ticker: string
  price: number
  open: number
  high: number
  low: number
  volume: number
  change: number
  changePercent: number
}

export function StockWidget({ ticker, price, open, high, low, volume, change, changePercent }: StockWidgetProps) {
  const isPositive = change >= 0

  return (
    <div className="rounded-lg border border-border/50 bg-card/50 p-4 my-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              isPositive ? "bg-emerald-500/20" : "bg-red-500/20",
            )}
          >
            <BarChart3 className={cn("h-4 w-4", isPositive ? "text-emerald-500" : "text-red-500")} />
          </div>
          <span className="text-lg font-bold text-foreground">{ticker}</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
            isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400",
          )}
        >
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPositive ? "+" : ""}
          {changePercent}%
        </div>
      </div>

      <div className="text-2xl font-bold text-foreground mb-3">
        ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <span className={cn("text-sm ml-2", isPositive ? "text-emerald-400" : "text-red-400")}>
          {isPositive ? "+" : ""}${change.toFixed(2)}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-secondary/50 rounded p-2">
          <p className="text-muted-foreground">Open</p>
          <p className="text-foreground font-medium">${open.toFixed(2)}</p>
        </div>
        <div className="bg-secondary/50 rounded p-2">
          <p className="text-muted-foreground">High</p>
          <p className="text-emerald-400 font-medium">${high.toFixed(2)}</p>
        </div>
        <div className="bg-secondary/50 rounded p-2">
          <p className="text-muted-foreground">Low</p>
          <p className="text-red-400 font-medium">${low.toFixed(2)}</p>
        </div>
        <div className="bg-secondary/50 rounded p-2">
          <p className="text-muted-foreground">Volume</p>
          <p className="text-foreground font-medium">{(volume / 1000000).toFixed(1)}M</p>
        </div>
      </div>
    </div>
  )
}
