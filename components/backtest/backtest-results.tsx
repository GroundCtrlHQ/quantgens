"use client"

import { useMemo } from "react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Loader2 } from "lucide-react"

interface BacktestResultsProps {
  isComplete: boolean
  isRunning: boolean
}

export function BacktestResults({ isComplete, isRunning }: BacktestResultsProps) {
  const chartData = useMemo(() => {
    return Array.from({ length: 252 }, (_, i) => {
      const strategyReturn = 100 + Math.sin(i / 20) * 8 + i * 0.12 + (Math.random() * 4 - 2)
      const benchmarkReturn = 100 + Math.sin(i / 25) * 5 + i * 0.08 + (Math.random() * 2 - 1)
      return {
        day: i + 1,
        strategy: Number(strategyReturn.toFixed(2)),
        benchmark: Number(benchmarkReturn.toFixed(2)),
      }
    })
  }, [])

  const finalReturn = chartData[chartData.length - 1].strategy - 100
  const benchmarkReturn = chartData[chartData.length - 1].benchmark - 100

  return (
    <div className="glass-card rounded-xl p-4 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Equity Curve</h3>
          <p className="text-xs text-muted-foreground">Jan 2023 - Dec 2024</p>
        </div>
        {isComplete && (
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Strategy: </span>
              <span className={`font-mono ${finalReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
                {finalReturn >= 0 ? "+" : ""}
                {finalReturn.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Benchmark: </span>
              <span className={`font-mono ${benchmarkReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
                {benchmarkReturn >= 0 ? "+" : ""}
                {benchmarkReturn.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {isRunning ? (
        <div className="h-[280px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Running backtest simulation...</span>
          </div>
        </div>
      ) : (
        <ChartContainer
          config={{
            strategy: { label: "Strategy", color: "#006CFF" },
            benchmark: { label: "Benchmark", color: "#4B5563" },
          }}
          className="!aspect-none h-[280px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="backtestGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006CFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#006CFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 10 }}
                tickFormatter={(v) => (v % 50 === 0 ? `D${v}` : "")}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 10 }}
                domain={["dataMin - 5", "dataMax + 5"]}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine y={100} stroke="#374151" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="benchmark" stroke="#4B5563" strokeWidth={1} fill="none" dot={false} />
              <Area
                type="monotone"
                dataKey="strategy"
                stroke="#006CFF"
                strokeWidth={2}
                fill="url(#backtestGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  )
}
