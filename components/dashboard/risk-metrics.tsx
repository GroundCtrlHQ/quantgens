"use client"

import { riskMetrics } from "@/lib/mock-data"
import { Shield, AlertTriangle } from "lucide-react"

export function RiskMetrics() {
  return (
    <div className="p-3 border-t border-border">
      <div className="mb-2 flex items-center gap-1.5">
        <Shield className="h-3.5 w-3.5 text-primary" />
        <h3 className="text-xs font-semibold text-foreground">Risk Overview</h3>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-lg bg-secondary/40 p-2">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">VaR 95%</p>
          <p className="font-mono text-xs font-semibold text-foreground">${riskMetrics.var95.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-secondary/40 p-2">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Beta</p>
          <p className="font-mono text-xs font-semibold text-foreground">{riskMetrics.beta}</p>
        </div>
        <div className="rounded-lg bg-secondary/40 p-2">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Alpha</p>
          <p className="font-mono text-xs font-semibold text-chart-2">{(riskMetrics.alpha * 100).toFixed(1)}%</p>
        </div>
        <div className="rounded-lg bg-secondary/40 p-2">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Sharpe</p>
          <p className="font-mono text-xs font-semibold text-foreground">1.87</p>
        </div>
      </div>
      {/* Correlation warning */}
      <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-chart-4/10 p-2">
        <AlertTriangle className="h-3 w-3 text-chart-4 shrink-0" />
        <p className="text-[10px] text-chart-4">High correlation: {(riskMetrics.correlation * 100).toFixed(0)}%</p>
      </div>
    </div>
  )
}
