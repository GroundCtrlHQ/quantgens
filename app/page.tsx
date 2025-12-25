"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MetricCard } from "@/components/dashboard/metric-card"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { StrategiesTable } from "@/components/dashboard/strategies-table"
import { SignalsFeed } from "@/components/dashboard/signals-feed"
import { WhaleActivity } from "@/components/dashboard/whale-activity"
import { RiskMetrics } from "@/components/dashboard/risk-metrics"
import { QuantosPanel } from "@/components/dashboard/quantos-panel"
import { QuantosWidget } from "@/components/quantos/quantos-widget"
import { OnboardingJourney } from "@/components/onboarding/onboarding-journey"
import { portfolioMetrics } from "@/lib/mock-data"
import { DollarSign, TrendingUp, Target, Activity } from "lucide-react"

export default function CommandCenter() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Always show onboarding on mount (sign in)
    setShowOnboarding(true)
  }, [])

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <QuantosWidget />

      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        {/* Header spans full width */}
        <Header />

        {/* Content area with main stage and right sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Stage */}
          <main className="flex-1 p-6 overflow-auto" data-onboarding-target="command-center-main">
            {/* Top Metrics Row */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-6">
              <MetricCard
                title="Portfolio Value"
                value={`$${portfolioMetrics.totalValue.toLocaleString()}`}
                change={portfolioMetrics.dailyPnLPercent}
                changeLabel="today"
                icon={DollarSign}
                iconColor="text-primary"
              />
              <MetricCard
                title="Daily P&L"
                value={`$${portfolioMetrics.dailyPnL.toLocaleString()}`}
                change={portfolioMetrics.dailyPnLPercent}
                changeLabel="vs yesterday"
                icon={TrendingUp}
                iconColor="text-chart-2"
              />
              <MetricCard
                title="Win Rate"
                value={`${portfolioMetrics.winRate}%`}
                change={2.3}
                changeLabel="this month"
                icon={Target}
                iconColor="text-chart-3"
              />
              <MetricCard
                title="Sharpe Ratio"
                value={portfolioMetrics.sharpeRatio.toFixed(2)}
                change={0.12}
                changeLabel="30d avg"
                icon={Activity}
                iconColor="text-primary"
              />
            </div>

            {/* Main Stage Content */}
            <div className="space-y-6">
              <PerformanceChart />
              <div className="grid gap-6 lg:grid-cols-2">
                <StrategiesTable />
                <WhaleActivity />
              </div>
            </div>
          </main>

          {/* Right Intelligence Panel */}
          <aside className="w-80 shrink-0 border-l border-border bg-sidebar flex flex-col overflow-hidden">
            {/* Quantos AI - fixed height */}
            <div className="h-[320px] shrink-0 border-b border-border overflow-hidden">
              <QuantosPanel />
            </div>
            {/* Live Signals - flexible height */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <SignalsFeed />
            </div>
            {/* Risk Overview - fixed height at bottom */}
            <div className="shrink-0">
              <RiskMetrics />
            </div>
          </aside>
        </div>
      </div>

      {/* Onboarding Journey Modal */}
      <OnboardingJourney open={showOnboarding} onOpenChange={setShowOnboarding} />
    </div>
  )
}
