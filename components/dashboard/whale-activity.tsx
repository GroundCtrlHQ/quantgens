"use client"

import { useRouter } from "next/navigation"
import { whaleActivity } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Radar, ExternalLink } from "lucide-react"

export function WhaleActivity() {
  const router = useRouter()

  const handleExpand = () => {
    router.push("/whale-radar")
  }

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 glow-blue">
            <Radar className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Whale Radar</h3>
            <p className="text-xs text-muted-foreground">Smart Money vs Retail</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs" onClick={handleExpand}>
          <ExternalLink className="mr-1 h-3 w-3" />
          Expand
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-lg bg-secondary/40 p-3">
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Net Flow (24h)</p>
          <p className="font-mono text-lg font-semibold text-chart-2">+$847M</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Smart Money</p>
          <p className="font-mono text-lg font-semibold text-primary">68%</p>
        </div>
      </div>

      <div className="space-y-2">
        {whaleActivity.slice(0, 4).map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between rounded-lg bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  activity.flow === "inflow" ? "bg-chart-2/20 glow-green" : "bg-chart-4/20 glow-red",
                )}
              >
                {activity.flow === "inflow" ? (
                  <ArrowUpRight className="h-4 w-4 text-chart-2" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-chart-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{activity.symbol}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] capitalize",
                      activity.flow === "inflow"
                        ? "border-chart-2/30 bg-chart-2/10 text-chart-2"
                        : "border-chart-4/30 bg-chart-4/10 text-chart-4",
                    )}
                  >
                    {activity.flow}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{activity.exchange}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono font-semibold text-foreground">${(activity.amount / 1000000).toFixed(1)}M</p>
              <p className="text-[10px] text-muted-foreground">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
