"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { performanceData } from "@/lib/mock-data"

export function PerformanceChart() {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Performance</h3>
          <p className="text-sm text-muted-foreground">Portfolio vs Benchmark</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#4ade80" }} />
            <span className="text-muted-foreground">Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#60a5fa" }} />
            <span className="text-muted-foreground">Benchmark</span>
          </div>
        </div>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(30, 32, 45, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number) => [`${value}%`, ""]}
            />
            <Area
              type="monotone"
              dataKey="portfolio"
              stroke="#4ade80"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
              name="Portfolio"
            />
            <Area
              type="monotone"
              dataKey="benchmark"
              stroke="#60a5fa"
              strokeWidth={2}
              fill="url(#benchmarkGradient)"
              name="Benchmark"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
