"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Minus, Radio, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Signal {
  id: string
  symbol: string
  action: "BUY" | "SELL" | "HOLD"
  price: number
  change: number
  changePercent: number
  confidence: number
  timestamp: string
  volume: number
}

export function SignalsFeed() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)

  const fetchSignals = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/signals")
      const data = await res.json()

      if (data.signals) {
        setSignals(data.signals)
        setLastUpdated(new Date())
        setIsRateLimited(data.rateLimited || false)
      }
      if (data.error && !data.signals) {
        setError(data.error)
      }
    } catch (err) {
      setError("Failed to fetch signals")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSignals()
    const interval = setInterval(fetchSignals, 120000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col h-full p-3 overflow-hidden">
      <div className="mb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <Radio className="h-3.5 w-3.5 text-chart-2 animate-pulse" />
          <h3 className="text-xs font-semibold text-foreground">Live Signals</h3>
          {isRateLimited && (
            <Badge variant="outline" className="text-[9px] px-1 py-0 border-chart-3/30 bg-chart-3/10 text-chart-3">
              Cached
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={fetchSignals} disabled={loading}>
          <RefreshCw className={cn("h-2.5 w-2.5", loading && "animate-spin")} />
        </Button>
      </div>

      {error && !signals.length && (
        <div className="flex items-center gap-2 text-chart-4 text-[10px] mb-2 shrink-0">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5">
        {signals.slice(0, 4).map((signal) => (
          <div
            key={signal.id}
            className="flex items-center justify-between rounded-lg bg-secondary/40 p-2 hover:bg-secondary/60 transition-colors"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded shrink-0",
                  signal.action === "BUY"
                    ? "bg-chart-2/20"
                    : signal.action === "SELL"
                      ? "bg-chart-4/20"
                      : "bg-chart-3/20",
                )}
              >
                {signal.action === "BUY" ? (
                  <ArrowUpRight className="h-3 w-3 text-chart-2" />
                ) : signal.action === "SELL" ? (
                  <ArrowDownRight className="h-3 w-3 text-chart-4" />
                ) : (
                  <Minus className="h-3 w-3 text-chart-3" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-foreground">{signal.symbol}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] px-1 py-0",
                      signal.action === "BUY"
                        ? "border-chart-2/30 bg-chart-2/10 text-chart-2"
                        : signal.action === "SELL"
                          ? "border-chart-4/30 bg-chart-4/10 text-chart-4"
                          : "border-chart-3/30 bg-chart-3/10 text-chart-3",
                    )}
                  >
                    {signal.action}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-muted-foreground font-mono">${signal.price.toFixed(2)}</span>
                  <span
                    className={cn("text-[9px] font-mono", signal.changePercent >= 0 ? "text-chart-2" : "text-chart-4")}
                  >
                    {signal.changePercent >= 0 ? "+" : ""}
                    {signal.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] font-medium text-foreground">{signal.confidence}%</div>
              <p className="text-[9px] text-muted-foreground">{signal.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {lastUpdated && (
        <p className="text-[9px] text-muted-foreground mt-1.5 text-center shrink-0">
          Updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
