"use client"

import { TrendingUp, Users, Wallet } from "lucide-react"

export function SmartMoneyIndicator() {
  const smartMoneyRatio = 76 // Smart money as % of total flow

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-sm font-medium text-foreground mb-4">Smart Money Index</h3>

      <div className="relative flex items-center justify-center mb-4">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle cx="64" cy="64" r="56" stroke="#1F2937" strokeWidth="8" fill="none" />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="#006CFF"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${smartMoneyRatio * 3.52} 352`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-foreground">{smartMoneyRatio}%</span>
          <span className="text-xs text-muted-foreground">Smart</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-center">
          <Wallet className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Institutions</p>
          <p className="text-sm font-semibold text-foreground">$1.23B</p>
        </div>
        <div className="p-2 rounded-lg bg-orange-500/10 text-center">
          <Users className="h-4 w-4 text-orange-400 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Retail</p>
          <p className="text-sm font-semibold text-foreground">$382M</p>
        </div>
      </div>

      <div className="mt-4 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-400" />
          <span className="text-xs text-green-400 font-medium">Bullish Signal</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Smart money accumulation phase detected. Institutional inflows exceeding retail by 3.2x.
        </p>
      </div>
    </div>
  )
}
