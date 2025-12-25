"use client"

import { useMemo } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PerformanceComparisonProps {
  strategies: string[]
}

const strategyColors: Record<string, string> = {
  "momentum-alpha": "#006CFF",
  "mean-reversion": "#10B981",
  "volatility-arb": "#F59E0B",
  "sector-rotation": "#8B5CF6",
  "pairs-trading": "#EC4899",
  "lstm-predictor": "#06B6D4",
}

export function PerformanceComparison({ strategies }: PerformanceComparisonProps) {
  const chartData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const data: Record<string, number | string> = { day: `D${i + 1}` }
      strategies.forEach((s) => {
        const base = 100
        const trend = Math.sin(i / (5 + strategies.indexOf(s))) * 3 + i * 0.15
        const noise = Math.random() * 2 - 1
        data[s] = Number((base + trend + noise).toFixed(2))
      })
      return data
    })
  }, [strategies])

  const config = strategies.reduce(
    (acc, s) => {
      acc[s] = {
        label: s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        color: strategyColors[s] || "#6B7280",
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>,
  )

  return (
    <div className="glass-card rounded-xl p-4 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Performance Comparison</h3>
          <p className="text-xs text-muted-foreground">30-day normalized returns</p>
        </div>
      </div>

      {strategies.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
          Select strategies to compare performance
        </div>
      ) : (
        <ChartContainer config={config} className="!aspect-none h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 10 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 10 }}
                domain={["dataMin - 2", "dataMax + 2"]}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend
                wrapperStyle={{ fontSize: "10px" }}
                formatter={(value) => <span className="text-muted-foreground">{config[value]?.label || value}</span>}
              />
              {strategies.map((s) => (
                <Line key={s} type="monotone" dataKey={s} stroke={strategyColors[s]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  )
}
