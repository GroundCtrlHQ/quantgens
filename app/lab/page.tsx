"use client"

import { useState, useCallback, useEffect } from "react"
import { mutate } from "swr"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FlaskConical, Layers, TestTube } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Model Tuning components
import { ParameterTuning } from "@/components/playground/parameter-tuning"
import { PlaygroundChart } from "@/components/playground/playground-chart"
import { ActiveModel } from "@/components/playground/active-model"
import { PreviousRuns } from "@/components/playground/previous-runs"

// Strategy Composer components
import { StrategyHealth } from "@/components/strategy/strategy-health"
import { PortfolioComposer } from "@/components/strategy/portfolio-composer"
import { StrategyList } from "@/components/strategy/strategy-list"
import { DriftAlerts } from "@/components/strategy/drift-alerts"
import { PerformanceComparison } from "@/components/strategy/performance-comparison"

// Backtest components
import { BacktestConfig } from "@/components/backtest/backtest-config"
import { BacktestResults } from "@/components/backtest/backtest-results"
import { TearSheet } from "@/components/backtest/tear-sheet"
import { OverfittingGuard } from "@/components/backtest/overfitting-guard"
import { CodeAnalytics } from "@/components/backtest/code-analytics"

import { QuantosWidget } from "@/components/quantos/quantos-widget"

import { ErrorBoundary } from "@/components/error-boundary"

const DEFAULT_PARAMETERS = {
  lookbackPeriod: 60,
  confidenceLevel: 95,
  learningRate: 0.01,
  regularization: 0.1,
}

interface DataPoint {
  day: number
  strategy: number
  benchmark: number
}

export default function LabPage() {
  const [activeTab, setActiveTab] = useState("model-tuning")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { toast } = useToast()

  // Read tab from URL query params on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get("tab")
      if (tab && ["model-tuning", "strategy-composer", "backtest"].includes(tab)) {
        setActiveTab(tab)
      }
    }
  }, [])

  // ... existing code for state ...
  // Model Tuning state
  const [selectedModel, setSelectedModel] = useState<string | null>("garch")
  const [parameters, setParameters] = useState(DEFAULT_PARAMETERS)
  const [isRunning, setIsRunning] = useState(false)
  const [runData, setRunData] = useState<DataPoint[] | null>(null)

  // Strategy Composer state
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(["momentum-alpha", "mean-reversion"])

  // Backtest state
  const [backtestRunning, setBacktestRunning] = useState(false)
  const [backtestComplete, setBacktestComplete] = useState(true)

  // Model Tuning handlers
  const handleRun = useCallback(async () => {
    if (!selectedModel) {
      toast({ title: "No Model Selected", description: "Please select a model first", variant: "destructive" })
      return
    }
    setIsRunning(true)
    setRunData(null)
    try {
      const response = await fetch("/api/playground/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedModel, parameters }),
      })
      const data = await response.json()
      if (data.dataPoints) {
        setRunData(data.dataPoints)
        toast({
          title: "Simulation Complete",
          description: `${selectedModel.toUpperCase()} returned ${data.finalReturn > 0 ? "+" : ""}${data.finalReturn.toFixed(2)}%`,
        })
        mutate("/api/playground/runs")
      }
    } catch {
      toast({ title: "Simulation Failed", description: "Please try again", variant: "destructive" })
    } finally {
      setIsRunning(false)
    }
  }, [selectedModel, parameters, toast])

  const handlePause = useCallback(() => {
    setIsRunning(false)
    toast({ title: "Simulation Paused", description: "Model execution has been paused" })
  }, [toast])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setParameters(DEFAULT_PARAMETERS)
    setRunData(null)
    toast({ title: "Parameters Reset", description: "All parameters restored to defaults" })
  }, [toast])

  const handleSave = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast({
      title: "Configuration Saved",
      description: `${selectedModel?.toUpperCase()} model configuration saved successfully`,
    })
  }, [selectedModel, toast])

  const handleSelectRun = useCallback(
    (run: { model: string; parameters: Record<string, number> }) => {
      const normalizedModel = run.model.toLowerCase().replace(/\s+/g, "-")
      setSelectedModel(normalizedModel)
      setParameters({
        lookbackPeriod: run.parameters.lookbackPeriod || run.parameters.lookback || DEFAULT_PARAMETERS.lookbackPeriod,
        confidenceLevel:
          run.parameters.confidenceLevel || run.parameters.confidence || DEFAULT_PARAMETERS.confidenceLevel,
        learningRate: run.parameters.learningRate || DEFAULT_PARAMETERS.learningRate,
        regularization: run.parameters.regularization || DEFAULT_PARAMETERS.regularization,
      })
      toast({ title: "Run Loaded", description: `Loaded ${run.model} configuration` })
    },
    [toast],
  )

  // Backtest handler
  const runBacktest = () => {
    setBacktestRunning(true)
    setBacktestComplete(false)
    setTimeout(() => {
      setBacktestRunning(false)
      setBacktestComplete(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar selectedModel={selectedModel} onSelectModel={setSelectedModel} onCollapsedChange={setSidebarCollapsed} />

      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64",
        )}
      >
        <Header title="Quantgens Lab" subtitle="Build, compose, and validate your trading strategies" />

        <div className="flex-1 p-6 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-lg grid-cols-3 mb-6">
              <TabsTrigger value="model-tuning" className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                <span className="hidden sm:inline">Model Tuning</span>
              </TabsTrigger>
              <TabsTrigger value="strategy-composer" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Strategy Composer</span>
              </TabsTrigger>
              <TabsTrigger value="backtest" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                <span className="hidden sm:inline">Backtest</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Model Tuning */}
            <TabsContent value="model-tuning" className="mt-0">
              <div className="flex gap-6">
                <div className="flex-1 min-w-0 space-y-4">
                  <ErrorBoundary>
                    <ActiveModel
                      model={selectedModel}
                      isRunning={isRunning}
                      onRun={handleRun}
                      onPause={handlePause}
                      onReset={handleReset}
                      onSave={handleSave}
                    />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <PlaygroundChart
                      model={selectedModel}
                      parameters={parameters}
                      isRunning={isRunning}
                      runData={runData}
                    />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <ParameterTuning parameters={parameters} onParametersChange={setParameters} />
                  </ErrorBoundary>
                </div>
                <div className="w-72 shrink-0">
                  <ErrorBoundary>
                    <PreviousRuns onSelectRun={handleSelectRun} />
                  </ErrorBoundary>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Strategy Composer - Fixed overflow with better grid */}
            <TabsContent value="strategy-composer" className="mt-0">
              <div className="flex gap-6">
                <div className="w-64 shrink-0">
                  <StrategyList selectedStrategies={selectedStrategies} onSelectionChange={setSelectedStrategies} />
                </div>
                <div className="flex-1 min-w-0 space-y-6 overflow-hidden">
                  <StrategyHealth strategies={selectedStrategies} />
                  <div className="overflow-hidden">
                    <PerformanceComparison strategies={selectedStrategies} />
                  </div>
                </div>
                <div className="w-64 shrink-0 space-y-6">
                  <PortfolioComposer selectedStrategies={selectedStrategies} />
                  <DriftAlerts />
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Backtest - Fixed overflow with better grid */}
            <TabsContent value="backtest" className="mt-0">
              <div className="flex gap-6">
                <div className="w-64 shrink-0 space-y-6">
                  <BacktestConfig onRunBacktest={runBacktest} isRunning={backtestRunning} />
                  <OverfittingGuard />
                </div>
                <div className="flex-1 min-w-0 space-y-6 overflow-hidden">
                  <div className="overflow-hidden">
                    <BacktestResults isComplete={backtestComplete} isRunning={backtestRunning} />
                  </div>
                  <TearSheet isComplete={backtestComplete} />
                </div>
                <div className="w-64 shrink-0">
                  <CodeAnalytics />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <QuantosWidget />
    </div>
  )
}
