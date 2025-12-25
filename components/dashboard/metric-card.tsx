import { cn } from "@/lib/utils"
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon: LucideIcon
  iconColor?: string
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = "text-primary",
}: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0

  return (
    <div className="glass-card rounded-xl p-4 overflow-hidden">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold text-foreground truncate">{value}</p>
        </div>
        <div className={cn("rounded-lg bg-secondary/50 p-2 shrink-0", iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1 flex-wrap">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-chart-2 shrink-0" />
          ) : (
            <TrendingDown className="h-3 w-3 text-chart-3 shrink-0" />
          )}
          <span className={cn("text-xs font-medium", isPositive ? "text-chart-2" : "text-chart-3")}>
            {isPositive ? "+" : ""}
            {change.toFixed(2)}%
          </span>
          {changeLabel && <span className="text-[10px] text-muted-foreground">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}
