"use client"

import { TrendingUp, TrendingDown, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface MarketIndex {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface MarketWidgetProps {
  indices: MarketIndex[]
}

export function MarketWidget({ indices }: MarketWidgetProps) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/50 p-4 my-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20">
          <Globe className="h-3 w-3 text-primary" />
        </div>
        <span className="text-sm font-medium text-foreground">Market Overview</span>
      </div>

      <div className="grid gap-2">
        {indices.map((index) => {
          const isPositive = index.change >= 0
          return (
            <div key={index.ticker} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div>
                <p className="text-sm font-medium text-foreground">{index.name}</p>
                <p className="text-xs text-muted-foreground">{index.ticker}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">
                  ${index.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium justify-end",
                    isPositive ? "text-emerald-400" : "text-red-400",
                  )}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isPositive ? "+" : ""}
                  {index.changePercent}%
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
