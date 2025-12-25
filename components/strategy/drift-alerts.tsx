"use client"

import { AlertTriangle, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const alerts = [
  {
    id: 1,
    strategy: "Volatility Arb",
    type: "Parameter Drift",
    message: "Lookback period may need adjustment due to increased market volatility",
    severity: "medium",
    time: "12 min ago",
  },
  {
    id: 2,
    strategy: "Momentum Alpha",
    type: "Performance Drift",
    message: "Strategy underperforming benchmark by 2.3% over last 5 sessions",
    severity: "low",
    time: "45 min ago",
  },
]

export function DriftAlerts() {
  return (
    <div className="glass-card rounded-xl p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
          <h3 className="text-sm font-medium text-foreground truncate">Drift Alerts</h3>
        </div>
        <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0">
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border overflow-hidden ${
              alert.severity === "high"
                ? "bg-red-500/10 border-red-500/20"
                : alert.severity === "medium"
                  ? "bg-yellow-500/10 border-yellow-500/20"
                  : "bg-secondary/50 border-border/50"
            }`}
          >
            <div className="flex flex-col gap-1 mb-1">
              <span className="text-xs font-medium text-foreground truncate">{alert.strategy}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded w-fit ${
                  alert.severity === "high"
                    ? "bg-red-500/20 text-red-400"
                    : alert.severity === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {alert.type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{alert.message}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="truncate">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
