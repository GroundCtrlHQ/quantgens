"use client"

import { useMemo } from "react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"

interface DataPoint {
  day: number
  strategy: number
  benchmark: number
}

interface PlaygroundChartProps {
  model: string | null
  parameters: {
    lookbackPeriod: number
    confidenceLevel: number
    learningRate: number
    regularization: number
  }
  isRunning?: boolean
  runData?: DataPoint[] | null
}

// Deterministic seeded random function for consistent SSR/CSR
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function PlaygroundChart({ model, parameters, isRunning, runData }: PlaygroundChartProps) {
  const chartData = useMemo(() => {
    if (runData && runData.length > 0) {
      return runData
    }

    // Preview data when no run has been executed
    // Use deterministic values based on model and parameters to avoid hydration mismatch
    const baseMultiplier = model === "lstm" ? 1.3 : model === "garch" ? 1.1 : 1.0
    const paramEffect = (parameters.learningRate * 10 + parameters.regularization) / 2
    const seed = (model?.charCodeAt(0) || 0) + parameters.lookbackPeriod + parameters.confidenceLevel

    return Array.from({ length: 30 }, (_, i) => {
      // Use seeded random for deterministic noise
      const noise = (seededRandom(seed + i) * 2 - 1) * 0.5
      const trend = Math.sin(i / 10) * 3 + i * 0.05
      const value = 100 + trend * baseMultiplier + noise * paramEffect
      const benchmark = 100 + Math.sin(i / 12) * 2 + i * 0.03

      return {
        day: i + 1,
        strategy: Number(value.toFixed(2)),
        benchmark: Number(benchmark.toFixed(2)),
      }
    })
  }, [model, parameters, runData])

  const performance = chartData.length > 0 ? chartData[chartData.length - 1].strategy - 100 : 0
  const isPositive = performance > 0

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">{runData ? "Simulation Results" : "Live Performance"}</h3>
          <p className="text-xs text-muted-foreground">
            {runData ? `${chartData.length} days simulated` : "Preview - Click Run to simulate"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          <div className={`flex items-center gap-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-mono font-medium">
              {isPositive ? "+" : ""}
              {performance.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <ChartContainer
        config={{
          strategy: { label: "Strategy", color: "#006CFF" },
          benchmark: { label: "Benchmark", color: "#4B5563" },
        }}
        className="!aspect-none h-[280px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="strategyGradient" x1="0" y1="0" x2="0" y2="1">
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
              tickFormatter={(v) => `D${v}`}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 10 }}
              domain={["dataMin - 2", "dataMax + 2"]}
              width={50}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ReferenceLine y={100} stroke="#374151" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="benchmark" stroke="#4B5563" strokeWidth={1} fill="none" dot={false} />
            <Area
              type="monotone"
              dataKey="strategy"
              stroke="#006CFF"
              strokeWidth={2}
              fill="url(#strategyGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
