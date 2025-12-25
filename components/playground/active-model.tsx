"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Save, Loader2 } from "lucide-react"

const modelDetails: Record<string, { name: string; type: string; accuracy: number }> = {
  "linear-regression": { name: "Linear Regression", type: "Statistical", accuracy: 62 },
  arima: { name: "ARIMA", type: "Statistical", accuracy: 68 },
  garch: { name: "GARCH", type: "Statistical", accuracy: 71 },
  "random-forest": { name: "Random Forest", type: "ML", accuracy: 74 },
  lstm: { name: "LSTM Network", type: "Deep Learning", accuracy: 79 },
  transformer: { name: "Transformer", type: "Deep Learning", accuracy: 82 },
  xgboost: { name: "XGBoost", type: "ML", accuracy: 76 },
  "kalman-filter": { name: "Kalman Filter", type: "Statistical", accuracy: 65 },
}

interface ActiveModelProps {
  model: string | null
  onRun?: () => void
  onPause?: () => void
  onReset?: () => void
  onSave?: () => void
  isRunning?: boolean
}

export function ActiveModel({ model, onRun, onPause, onReset, onSave, isRunning = false }: ActiveModelProps) {
  const [saving, setSaving] = useState(false)
  const details = model ? modelDetails[model] : null

  if (!details) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <p className="text-muted-foreground">Select a model from the library to begin</p>
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave?.()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">{details.name}</h2>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                {details.type}
              </Badge>
              {isRunning && (
                <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />
                  Running
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Base Accuracy: <span className="text-primary font-mono">{details.accuracy}%</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 bg-transparent" onClick={onReset} disabled={isRunning}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>

          {isRunning ? (
            <Button
              size="sm"
              variant="outline"
              className="h-8 bg-transparent border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              onClick={onPause}
            >
              <Pause className="h-3.5 w-3.5 mr-1" />
              Pause
            </Button>
          ) : (
            <Button size="sm" className="h-8 bg-primary hover:bg-primary/90" onClick={onRun}>
              <Play className="h-3.5 w-3.5 mr-1" />
              Run
            </Button>
          )}

          <Button size="sm" variant="outline" className="h-8 bg-transparent" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
