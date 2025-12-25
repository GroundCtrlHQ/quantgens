"use client"

import { cn } from "@/lib/utils"
import { Star, Download, Lock, Unlock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const models = [
  {
    id: "adaptive-momentum",
    name: "Adaptive Momentum Pro",
    author: "QuantLab",
    category: "momentum",
    tier: "premium",
    price: 299,
    rating: 4.8,
    downloads: 1240,
    accuracy: 86,
    description: "Self-adjusting momentum strategy with regime detection",
  },
  {
    id: "ml-trend-follower",
    name: "ML Trend Follower",
    author: "AlphaGen",
    category: "ml",
    tier: "premium",
    price: 499,
    rating: 4.9,
    downloads: 892,
    accuracy: 89,
    description: "LSTM-based trend prediction with multi-timeframe analysis",
  },
  {
    id: "mean-revert-stat",
    name: "Statistical Mean Revert",
    author: "OpenQuant",
    category: "mean-reversion",
    tier: "open-source",
    price: 0,
    rating: 4.5,
    downloads: 3420,
    accuracy: 78,
    description: "Classic mean reversion with Bollinger bands and RSI",
  },
  {
    id: "crypto-arb",
    name: "Cross-Exchange Arb",
    author: "CryptoQuant",
    category: "arbitrage",
    tier: "premium",
    price: 799,
    rating: 4.7,
    downloads: 456,
    accuracy: 92,
    description: "Real-time arbitrage detection across 15+ exchanges",
  },
  {
    id: "sentiment-alpha",
    name: "News Sentiment Alpha",
    author: "NLPTraders",
    category: "sentiment",
    tier: "premium",
    price: 349,
    rating: 4.6,
    downloads: 678,
    accuracy: 81,
    description: "NLP-powered sentiment analysis from news and social media",
  },
  {
    id: "pairs-basic",
    name: "Pairs Trading Starter",
    author: "OpenQuant",
    category: "arbitrage",
    tier: "open-source",
    price: 0,
    rating: 4.3,
    downloads: 2890,
    accuracy: 74,
    description: "Cointegration-based pairs trading framework",
  },
]

interface ModelGridProps {
  category: string
  tier: string
  selectedModel: string | null
  onSelectModel: (id: string) => void
}

export function ModelGrid({ category, tier, selectedModel, onSelectModel }: ModelGridProps) {
  const filteredModels = models.filter((m) => {
    if (category !== "all" && m.category !== category) return false
    if (tier !== "all" && m.tier !== tier) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filteredModels.length} models found</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredModels.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelectModel(model.id)}
            className={cn(
              "glass-card rounded-xl p-4 text-left transition-all border",
              selectedModel === model.id
                ? "border-primary/50 bg-primary/5"
                : "border-transparent hover:bg-secondary/30",
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{model.name}</h4>
                <p className="text-xs text-muted-foreground">{model.author}</p>
              </div>
              {model.tier === "premium" ? (
                <Lock className="h-4 w-4 text-yellow-500" />
              ) : (
                <Unlock className="h-4 w-4 text-green-400" />
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{model.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-foreground">{model.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Download className="h-3 w-3" />
                  {model.downloads}
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  model.tier === "premium"
                    ? "border-yellow-500/30 text-yellow-500"
                    : "border-green-500/30 text-green-400",
                )}
              >
                {model.price === 0 ? "Free" : `$${model.price}`}
              </Badge>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Accuracy</span>
                <span className={cn("font-mono", model.accuracy >= 85 ? "text-green-400" : "text-primary")}>
                  {model.accuracy}%
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
