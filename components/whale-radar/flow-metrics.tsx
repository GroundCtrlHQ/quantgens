"use client"

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface FlowMetricsProps {
  timeframe: string
}

export function FlowMetrics({ timeframe }: FlowMetricsProps) {
  const metrics = [
    {
      label: "Net Flow",
      value: "+$847.2M",
      change: 12.4,
      positive: true,
    },
    {
      label: "Smart Money",
      value: "$1.23B",
      change: 8.7,
      positive: true,
    },
    {
      label: "Retail Flow",
      value: "$382.1M",
      change: -3.2,
      positive: false,
    },
    {
      label: "Exchange Balance",
      value: "2.14M BTC",
      change: 0,
      positive: null,
    },
  ]

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Flow Metrics</h3>
        <span className="text-xs text-muted-foreground">{timeframe}</span>
      </div>

      <div className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
            <div>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="text-sm font-semibold text-foreground">{metric.value}</p>
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                metric.positive === true
                  ? "text-green-400"
                  : metric.positive === false
                    ? "text-red-400"
                    : "text-muted-foreground"
              }`}
            >
              {metric.positive === true ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : metric.positive === false ? (
                <ArrowDownRight className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              {metric.change !== 0 ? `${Math.abs(metric.change)}%` : "Stable"}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
