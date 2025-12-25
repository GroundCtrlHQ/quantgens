"use client"

import { useState } from "react"
import { Calendar, Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface BacktestConfigProps {
  onRunBacktest: () => void
  isRunning: boolean
}

export function BacktestConfig({ onRunBacktest, isRunning }: BacktestConfigProps) {
  const [strategy, setStrategy] = useState("momentum-alpha")
  const [startDate, setStartDate] = useState("2023-01-01")
  const [endDate, setEndDate] = useState("2024-12-01")

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Backtest Configuration</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Strategy</Label>
          <Select value={strategy} onValueChange={setStrategy}>
            <SelectTrigger className="bg-secondary/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="momentum-alpha">Momentum Alpha</SelectItem>
              <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
              <SelectItem value="volatility-arb">Volatility Arb</SelectItem>
              <SelectItem value="sector-rotation">Sector Rotation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-secondary/50 border-border/50 text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-secondary/50 border-border/50 text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Initial Capital</Label>
          <Input defaultValue="$1,000,000" className="bg-secondary/50 border-border/50" />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Benchmark</Label>
          <Select defaultValue="spy">
            <SelectTrigger className="bg-secondary/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spy">SPY (S&P 500)</SelectItem>
              <SelectItem value="qqq">QQQ (Nasdaq)</SelectItem>
              <SelectItem value="btc">BTC-USD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90" onClick={onRunBacktest} disabled={isRunning}>
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Backtest
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
