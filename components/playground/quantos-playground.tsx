"use client"

import { useState } from "react"
import { QuantosChat } from "@/components/quantos/quantos-chat"

interface QuantosPlaygroundProps {
  model: string | null
  parameters: {
    lookbackPeriod: number
    confidenceLevel: number
    learningRate: number
    regularization: number
  }
}

const modelInsights: Record<string, string[]> = {
  garch: [
    "GARCH models excel at capturing volatility clustering in financial time series.",
    "Current parameters suggest moderate sensitivity to recent volatility shocks.",
    "Consider increasing lookback period for more stable volatility estimates.",
  ],
  lstm: [
    "LSTM networks can capture long-term dependencies in sequential data.",
    "The learning rate is well-tuned for gradual convergence.",
    "Watch for overfitting with extended training periods.",
  ],
  "random-forest": [
    "Random Forest provides robust predictions through ensemble averaging.",
    "Feature importance can help identify key market drivers.",
    "Current regularization helps prevent overfitting to noise.",
  ],
}

export function QuantosPlayground({ model, parameters }: QuantosPlaygroundProps) {
  const [message, setMessage] = useState("")
  const insights = model ? modelInsights[model] || [] : []

  const context = model
    ? `Active model: ${model}. Parameters: lookback=${parameters.lookbackPeriod} days, confidence=${parameters.confidenceLevel}%, learning_rate=${parameters.learningRate}, regularization=${parameters.regularization}`
    : undefined

  return (
    <div className="glass-card rounded-xl overflow-hidden h-full flex flex-col">
      <QuantosChat context={context} showHeader={true} />
    </div>
  )
}
