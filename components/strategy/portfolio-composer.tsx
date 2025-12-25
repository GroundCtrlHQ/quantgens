"use client"

import { useState } from "react"
import { Layers, Save, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface PortfolioComposerProps {
  selectedStrategies: string[]
}

const strategyNames: Record<string, string> = {
  "momentum-alpha": "Momentum Alpha",
  "mean-reversion": "Mean Reversion",
  "volatility-arb": "Volatility Arb",
  "sector-rotation": "Sector Rotation",
  "pairs-trading": "Pairs Trading",
  "lstm-predictor": "LSTM Predictor",
}

export function PortfolioComposer({ selectedStrategies }: PortfolioComposerProps) {
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    selectedStrategies.forEach((s) => {
      initial[s] = Math.floor(100 / selectedStrategies.length)
    })
    return initial
  })

  const updateWeight = (strategyId: string, value: number) => {
    setWeights((prev) => ({ ...prev, [strategyId]: value }))
  }

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)

  return (
    <div className="glass-card rounded-xl p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="h-4 w-4 text-primary shrink-0" />
        <h3 className="text-sm font-medium text-foreground truncate">Portfolio Composer</h3>
      </div>

      {selectedStrategies.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground text-sm">Select strategies to compose a portfolio</div>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {selectedStrategies.map((strategyId) => (
              <div key={strategyId} className="space-y-2">
                <div className="flex items-center justify-between min-w-0">
                  <span className="text-xs text-foreground truncate mr-2">
                    {strategyNames[strategyId] || strategyId}
                  </span>
                  <span className="text-xs font-mono text-primary shrink-0">{weights[strategyId] || 0}%</span>
                </div>
                <Slider
                  value={[weights[strategyId] || 0]}
                  onValueChange={([v]) => updateWeight(strategyId, v)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div
            className={`p-2 rounded-lg text-center text-xs mb-4 ${
              totalWeight === 100 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            Total Weight: {totalWeight}%
          </div>

          <div className="flex flex-col gap-2">
            <Button size="sm" variant="outline" className="w-full bg-transparent text-xs">
              <Save className="h-3 w-3 mr-1 shrink-0" />
              Save
            </Button>
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-xs" disabled={totalWeight !== 100}>
              <Play className="h-3 w-3 mr-1 shrink-0" />
              Deploy
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
