"use client"

import { useRouter } from "next/navigation"
import { activeStrategies } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Play, Pause } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function StrategiesTable() {
  const router = useRouter()

  const handleViewAll = () => {
    router.push("/lab?tab=strategy-composer")
  }

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Active Strategies</h3>
          <p className="text-sm text-muted-foreground">{activeStrategies.length} strategies running</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
          onClick={handleViewAll}
        >
          View All
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Strategy
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                P&L
              </th>
              <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Positions
              </th>
              <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Risk
              </th>
              <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {activeStrategies.map((strategy) => (
              <tr key={strategy.id} className="hover:bg-secondary/30 transition-colors">
                <td className="py-3.5">
                  <span className="font-medium text-foreground">{strategy.name}</span>
                </td>
                <td className="py-3.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      strategy.status === "active"
                        ? "border-chart-2/30 bg-chart-2/10 text-chart-2"
                        : "border-chart-4/30 bg-chart-4/10 text-chart-4",
                    )}
                  >
                    {strategy.status === "active" ? (
                      <Play className="mr-1 h-3 w-3" />
                    ) : (
                      <Pause className="mr-1 h-3 w-3" />
                    )}
                    {strategy.status}
                  </Badge>
                </td>
                <td className="py-3.5 text-right">
                  <span className={cn("font-mono font-medium", strategy.pnl >= 0 ? "text-chart-2" : "text-chart-3")}>
                    {strategy.pnl >= 0 ? "+" : ""}${strategy.pnl.toLocaleString()}
                  </span>
                  <span className={cn("ml-1 text-xs", strategy.pnlPercent >= 0 ? "text-chart-2" : "text-chart-3")}>
                    ({strategy.pnlPercent >= 0 ? "+" : ""}
                    {strategy.pnlPercent}%)
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <span className="text-foreground">{strategy.positions}</span>
                </td>
                <td className="py-3.5">
                  <div className="flex justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "h-2 w-2 rounded-full",
                          level <= strategy.riskScore
                            ? strategy.riskScore <= 2
                              ? "bg-chart-2"
                              : strategy.riskScore <= 3
                                ? "bg-chart-4"
                                : "bg-chart-3"
                            : "bg-secondary",
                        )}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card">
                      <DropdownMenuItem>Edit Strategy</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-chart-3">Stop Strategy</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
