"use client"

import { AlertTriangle, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const alerts = [
  {
    id: 1,
    type: "large_inflow",
    asset: "BTC",
    amount: "$125M",
    exchange: "Binance",
    time: "2 min ago",
    severity: "high",
  },
  {
    id: 2,
    type: "large_outflow",
    asset: "ETH",
    amount: "$67M",
    exchange: "Coinbase",
    time: "8 min ago",
    severity: "medium",
  },
  {
    id: 3,
    type: "unusual_activity",
    asset: "SOL",
    amount: "$34M",
    exchange: "FTX",
    time: "15 min ago",
    severity: "low",
  },
  {
    id: 4,
    type: "large_inflow",
    asset: "NVDA",
    amount: "$89M",
    exchange: "Dark Pool",
    time: "23 min ago",
    severity: "medium",
  },
]

export function WhaleAlerts() {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Live Alerts</h3>
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${
                alert.severity === "high"
                  ? "bg-red-500/10 border-red-500/20"
                  : alert.severity === "medium"
                    ? "bg-yellow-500/10 border-yellow-500/20"
                    : "bg-secondary/50 border-border/50"
              }`}
            >
              <div className="flex items-start gap-2">
                {alert.type === "large_inflow" ? (
                  <TrendingUp className="h-4 w-4 text-green-400 mt-0.5" />
                ) : alert.type === "large_outflow" ? (
                  <TrendingDown className="h-4 w-4 text-red-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{alert.asset}</span>
                    <span className="text-xs font-mono text-primary">{alert.amount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.exchange}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
