"use client"

import { FileText, AlertTriangle } from "lucide-react"

interface TearSheetProps {
  isComplete: boolean
}

export function TearSheet({ isComplete }: TearSheetProps) {
  const metrics = [
    { label: "Total Return", value: "+32.4%", positive: true },
    { label: "CAGR", value: "+15.8%", positive: true },
    { label: "Sharpe Ratio", value: "2.12", positive: true },
    { label: "Sortino Ratio", value: "2.87", positive: true },
    { label: "Max Drawdown", value: "-8.3%", positive: false },
    { label: "Win Rate", value: "64.2%", positive: true },
    { label: "Profit Factor", value: "1.82", positive: true },
    { label: "Avg Trade", value: "+0.34%", positive: true },
  ]

  const aiInsights = [
    {
      type: "warning",
      message: "High drawdown potential during low-liquidity hours (11 PM - 3 AM EST).",
    },
    {
      type: "info",
      message: "Strategy performs best during high VIX environments (>20).",
    },
    {
      type: "warning",
      message: "Consider reducing position size during earnings season.",
    },
  ]

  if (!isComplete) return null

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Quantos Tear Sheet</h3>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-2 rounded-lg bg-secondary/30 text-center">
            <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
            <p className={`text-sm font-mono font-semibold ${metric.positive ? "text-green-400" : "text-red-400"}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">AI Risk Analysis</p>
        {aiInsights.map((insight, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg border ${
              insight.type === "warning" ? "bg-yellow-500/10 border-yellow-500/20" : "bg-primary/10 border-primary/20"
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertTriangle
                className={`h-3.5 w-3.5 mt-0.5 ${insight.type === "warning" ? "text-yellow-500" : "text-primary"}`}
              />
              <p className="text-xs text-foreground/80">{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
