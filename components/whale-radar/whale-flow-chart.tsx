"use client"

import { useMemo } from "react"
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface WhaleFlowChartProps {
  selectedAsset: string
  timeframe: string
}

// Generate mock bubble data representing whale movements
const generateBubbleData = () => {
  const assets = [
    { symbol: "BTC", type: "smart" },
    { symbol: "ETH", type: "smart" },
    { symbol: "SOL", type: "retail" },
    { symbol: "NVDA", type: "smart" },
    { symbol: "AAPL", type: "retail" },
    { symbol: "TSLA", type: "retail" },
    { symbol: "MSFT", type: "smart" },
    { symbol: "AVAX", type: "retail" },
    { symbol: "LINK", type: "smart" },
    { symbol: "META", type: "smart" },
  ]

  return assets.map((asset, i) => ({
    x: Math.random() * 100 - 50, // Price change %
    y: Math.random() * 200 - 100, // Volume delta
    z: Math.random() * 500 + 100, // Flow size
    symbol: asset.symbol,
    type: asset.type,
    flow: asset.type === "smart" ? (Math.random() * 500 + 200).toFixed(1) : (Math.random() * 100 + 20).toFixed(1),
  }))
}

export function WhaleFlowChart({ selectedAsset, timeframe }: WhaleFlowChartProps) {
  const data = useMemo(() => generateBubbleData(), [selectedAsset, timeframe])

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: (typeof data)[0] }> }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload
      return (
        <div className="glass-card rounded-lg p-3 border border-border/50">
          <p className="text-sm font-semibold text-foreground">{d.symbol}</p>
          <p className="text-xs text-muted-foreground">
            Type:{" "}
            <span className={d.type === "smart" ? "text-primary" : "text-orange-400"}>{d.type.toUpperCase()}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Flow: <span className="text-foreground">${d.flow}M</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Price: <span className={d.x > 0 ? "text-green-400" : "text-red-400"}>{d.x.toFixed(1)}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-card rounded-xl p-4 h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Capital Flow Radar</h3>
          <p className="text-xs text-muted-foreground">Smart Money vs Retail movement</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Smart Money</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-orange-400" />
            <span className="text-muted-foreground">Retail</span>
          </div>
        </div>
      </div>

      <ChartContainer config={{}} className="!aspect-none h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="Price Change"
              unit="%"
              domain={[-60, 60]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 10 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Volume Delta"
              domain={[-120, 120]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 10 }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 1000]} />
            <ReferenceLine x={0} stroke="#374151" strokeDasharray="3 3" />
            <ReferenceLine y={0} stroke="#374151" strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={data} fillOpacity={0.7}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.type === "smart" ? "#006CFF" : "#F97316"}
                  stroke={entry.type === "smart" ? "#006CFF" : "#F97316"}
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
