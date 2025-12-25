"use client"

import { Shield, Check, X, AlertTriangle } from "lucide-react"

const checks = [
  { id: 1, name: "Walk-Forward Validation", status: "pass", score: 92 },
  { id: 2, name: "Out-of-Sample Test", status: "pass", score: 87 },
  { id: 3, name: "Parameter Sensitivity", status: "warning", score: 68 },
  { id: 4, name: "Regime Robustness", status: "pass", score: 84 },
  { id: 5, name: "Transaction Cost Impact", status: "pass", score: 91 },
]

export function OverfittingGuard() {
  const passCount = checks.filter((c) => c.status === "pass").length

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Overfitting Guard</h3>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            passCount >= 4 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {passCount}/{checks.length} Passed
        </span>
      </div>

      <div className="space-y-2">
        {checks.map((check) => (
          <div key={check.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2">
              {check.status === "pass" ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : check.status === "warning" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
              ) : (
                <X className="h-3.5 w-3.5 text-red-400" />
              )}
              <span className="text-xs text-foreground">{check.name}</span>
            </div>
            <span
              className={`text-xs font-mono ${
                check.score >= 80 ? "text-green-400" : check.score >= 60 ? "text-yellow-400" : "text-red-400"
              }`}
            >
              {check.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
