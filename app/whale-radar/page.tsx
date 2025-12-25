"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { WhaleFlowChart } from "@/components/whale-radar/whale-flow-chart"
import { FlowMetrics } from "@/components/whale-radar/flow-metrics"
import { ExchangeBreakdown } from "@/components/whale-radar/exchange-breakdown"
import { WhaleAlerts } from "@/components/whale-radar/whale-alerts"
import { SmartMoneyIndicator } from "@/components/whale-radar/smart-money-indicator"
import { AssetFilter } from "@/components/whale-radar/asset-filter"

export default function WhaleRadarPage() {
  const [selectedAsset, setSelectedAsset] = useState("all")
  const [timeframe, setTimeframe] = useState("24h")

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header title="Whale Radar" subtitle="Track institutional capital flows in real-time" />

        <main className="p-6">
          {/* Top Bar - Filters */}
          <div className="flex items-center justify-between mb-6">
            <AssetFilter selectedAsset={selectedAsset} onAssetChange={setSelectedAsset} />
            <div className="flex gap-2">
              {["1h", "24h", "7d", "30d"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    timeframe === tf
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Row 1: Metrics + Chart */}
            <div className="flex gap-6">
              {/* Left - Metrics */}
              <div className="w-48 shrink-0 space-y-6">
                <FlowMetrics timeframe={timeframe} />
                <SmartMoneyIndicator />
              </div>

              {/* Center - Chart in its own contained section */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <WhaleFlowChart selectedAsset={selectedAsset} timeframe={timeframe} />
              </div>
            </div>

            {/* Row 2: Exchange Breakdown + Alerts side by side */}
            <div className="grid grid-cols-2 gap-6">
              <ExchangeBreakdown />
              <WhaleAlerts />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
