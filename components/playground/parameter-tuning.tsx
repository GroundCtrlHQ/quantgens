"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal } from "lucide-react"

interface Parameters {
  lookbackPeriod: number
  confidenceLevel: number
  learningRate: number
  regularization: number
}

interface ParameterTuningProps {
  parameters: Parameters
  onParametersChange: (params: Parameters) => void
}

export function ParameterTuning({ parameters, onParametersChange }: ParameterTuningProps) {
  const updateParam = (key: keyof Parameters, value: number) => {
    onParametersChange({ ...parameters, [key]: value })
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Parameter Tuning</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Lookback Period</Label>
            <span className="text-xs font-mono text-primary">{parameters.lookbackPeriod} days</span>
          </div>
          <Slider
            value={[parameters.lookbackPeriod]}
            onValueChange={([v]) => updateParam("lookbackPeriod", v)}
            min={10}
            max={252}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Confidence Level</Label>
            <span className="text-xs font-mono text-primary">{parameters.confidenceLevel}%</span>
          </div>
          <Slider
            value={[parameters.confidenceLevel]}
            onValueChange={([v]) => updateParam("confidenceLevel", v)}
            min={80}
            max={99}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Learning Rate</Label>
            <span className="text-xs font-mono text-primary">{parameters.learningRate.toFixed(3)}</span>
          </div>
          <Slider
            value={[parameters.learningRate * 1000]}
            onValueChange={([v]) => updateParam("learningRate", v / 1000)}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Regularization</Label>
            <span className="text-xs font-mono text-primary">{parameters.regularization.toFixed(2)}</span>
          </div>
          <Slider
            value={[parameters.regularization * 100]}
            onValueChange={([v]) => updateParam("regularization", v / 100)}
            min={1}
            max={50}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
