"use client"

import { Target, TrendingUp, Shield, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface StrategyHealthProps {
  strategies: string[]
}

export function StrategyHealth({ strategies }: StrategyHealthProps) {
  // Mock health metrics based on selected strategies
  const overallAccuracy = strategies.length > 0 ? 83 : 0
  const targetAccuracy = 83

  const metrics = [
    { label: "Combined Accuracy", value: overallAccuracy, target: targetAccuracy, icon: Target, color: "primary" },
    { label: "Portfolio Alpha", value: 2.34, unit: "%", icon: TrendingUp, color: "green" },
    { label: "Risk Score", value: 2.8, max: 5, icon: Shield, color: "yellow" },
    { label: "Drift Warnings", value: strategies.length > 1 ? 1 : 0, icon: AlertTriangle, color: "red" },
  ]

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Strategy Health Dashboard</h3>
          <p className="text-xs text-muted-foreground">Target Accuracy: {targetAccuracy}%</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            overallAccuracy >= targetAccuracy ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {overallAccuracy >= targetAccuracy ? "On Target" : "Below Target"}
        </div>
      </div>

      {/* Accuracy Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Combined Accuracy</span>
          <span className="text-sm font-mono text-primary">{overallAccuracy}%</span>
        </div>
        <div className="relative">
          <Progress value={overallAccuracy} className="h-3" />
          <div
            className="absolute top-0 h-3 w-0.5 bg-white/50"
            style={{ left: `${targetAccuracy}%` }}
            title={`Target: ${targetAccuracy}%`}
          />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-3 rounded-lg bg-secondary/30 text-center">
            <metric.icon
              className={`h-5 w-5 mx-auto mb-2 ${
                metric.color === "primary"
                  ? "text-primary"
                  : metric.color === "green"
                    ? "text-green-400"
                    : metric.color === "yellow"
                      ? "text-yellow-400"
                      : "text-red-400"
              }`}
            />
            <p className="text-lg font-semibold text-foreground">
              {metric.value}
              {metric.unit || ""}
            </p>
            <p className="text-xs text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
