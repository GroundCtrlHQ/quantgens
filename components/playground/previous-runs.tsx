"use client"

import type React from "react"
import { useState } from "react"
import useSWR from "swr"
import { Trash2, TrendingUp, TrendingDown, History, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Run {
  id: string
  model: string
  parameters: Record<string, number>
  status: string
  final_return: number | null
  started_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface PreviousRunsProps {
  onSelectRun: (run: { model: string; parameters: Record<string, number> }) => void
}

export function PreviousRuns({ onSelectRun }: PreviousRunsProps) {
  const { data, mutate, isLoading, error } = useSWR<{ runs: Run[]; error?: string }>("/api/playground/runs", fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeletingId(id)
    try {
      await fetch(`/api/playground/runs?id=${id}`, { method: "DELETE" })
      mutate()
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Unknown"
    }
  }

  const modelNames: Record<string, string> = {
    lstm: "LSTM",
    transformer: "Transformer",
    garch: "GARCH",
    xgboost: "XGBoost",
    "random-forest": "Random Forest",
    arima: "ARIMA",
    "kalman-filter": "Kalman Filter",
    "linear-regression": "Linear Regression",
    "LSTM Network": "LSTM",
    "Random Forest": "Random Forest",
    ARIMA: "ARIMA",
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Previous Runs</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-red-400 text-center">Failed to load runs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-4 max-h-[600px] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Previous Runs</h3>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : !data?.runs?.length ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground text-center">
            No runs yet.
            <br />
            Click Run to start a simulation.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {data.runs.map((run) => {
            const finalReturn = Number(run.final_return) || 0
            const isPositive = finalReturn > 0
            return (
              <div
                key={run.id}
                onClick={() => onSelectRun(run)}
                className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-primary/20"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{modelNames[run.model] || run.model}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDelete(run.id, e)}
                    disabled={deletingId === run.id}
                  >
                    {deletingId === run.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-400" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{formatDate(run.started_at)}</span>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-mono",
                      isPositive ? "text-green-400" : "text-red-400",
                    )}
                  >
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isPositive ? "+" : ""}
                    {finalReturn.toFixed(2)}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
