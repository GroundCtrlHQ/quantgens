"use client"

import { cn } from "@/lib/utils"
import { Check, TrendingUp, TrendingDown, Pause } from "lucide-react"

const strategies = [
  {
    id: "momentum-alpha",
    name: "Momentum Alpha",
    accuracy: 87,
    pnl: 12453,
    status: "active",
    type: "ML",
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    accuracy: 82,
    pnl: 8921,
    status: "active",
    type: "Statistical",
  },
  {
    id: "volatility-arb",
    name: "Volatility Arb",
    accuracy: 71,
    pnl: -1234,
    status: "paused",
    type: "Statistical",
  },
  {
    id: "sector-rotation",
    name: "Sector Rotation",
    accuracy: 79,
    pnl: 6789,
    status: "active",
    type: "ML",
  },
  {
    id: "pairs-trading",
    name: "Pairs Trading",
    accuracy: 84,
    pnl: 4521,
    status: "active",
    type: "Statistical",
  },
  {
    id: "lstm-predictor",
    name: "LSTM Predictor",
    accuracy: 76,
    pnl: 3245,
    status: "active",
    type: "Deep Learning",
  },
]

interface StrategyListProps {
  selectedStrategies: string[]
  onSelectionChange: (strategies: string[]) => void
}

export function StrategyList({ selectedStrategies, onSelectionChange }: StrategyListProps) {
  const toggleStrategy = (id: string) => {
    if (selectedStrategies.includes(id)) {
      onSelectionChange(selectedStrategies.filter((s) => s !== id))
    } else {
      onSelectionChange([...selectedStrategies, id])
    }
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Available Strategies</h3>
        <span className="text-xs text-muted-foreground">{selectedStrategies.length} selected</span>
      </div>

      <div className="space-y-2">
        {strategies.map((strategy) => {
          const isSelected = selectedStrategies.includes(strategy.id)
          return (
            <button
              key={strategy.id}
              onClick={() => toggleStrategy(strategy.id)}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all border overflow-hidden",
                isSelected
                  ? "bg-primary/10 border-primary/30"
                  : "bg-secondary/30 border-transparent hover:bg-secondary",
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{strategy.name}</span>
                    {strategy.status === "paused" && <Pause className="h-3 w-3 text-yellow-500 shrink-0" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{strategy.type}</span>
                </div>
                <div
                  className={cn(
                    "h-5 w-5 rounded border flex items-center justify-center shrink-0 ml-2",
                    isSelected ? "bg-primary border-primary" : "border-border",
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Accuracy:</span>
                  <span
                    className={cn(
                      "text-xs font-mono",
                      strategy.accuracy >= 83
                        ? "text-green-400"
                        : strategy.accuracy >= 75
                          ? "text-primary"
                          : "text-yellow-400",
                    )}
                  >
                    {strategy.accuracy}%
                  </span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    strategy.pnl >= 0 ? "text-green-400" : "text-red-400",
                  )}
                >
                  {strategy.pnl >= 0 ? (
                    <TrendingUp className="h-3 w-3 shrink-0" />
                  ) : (
                    <TrendingDown className="h-3 w-3 shrink-0" />
                  )}
                  <span className="font-mono truncate">
                    {strategy.pnl >= 0 ? "+" : ""}${Math.abs(strategy.pnl).toLocaleString()}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
