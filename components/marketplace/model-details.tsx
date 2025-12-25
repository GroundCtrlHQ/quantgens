"use client"

import { Shield, Download, Star, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const modelData: Record<
  string,
  {
    name: string
    author: string
    tier: string
    price: number
    rating: number
    downloads: number
    accuracy: number
    sharpe: number
    maxDrawdown: number
    description: string
    lastUpdated: string
  }
> = {
  "adaptive-momentum": {
    name: "Adaptive Momentum Pro",
    author: "QuantLab",
    tier: "premium",
    price: 299,
    rating: 4.8,
    downloads: 1240,
    accuracy: 86,
    sharpe: 2.34,
    maxDrawdown: -8.2,
    description:
      "Self-adjusting momentum strategy with regime detection. Uses volatility-adjusted position sizing and automatic parameter tuning based on market conditions.",
    lastUpdated: "2 days ago",
  },
  "ml-trend-follower": {
    name: "ML Trend Follower",
    author: "AlphaGen",
    tier: "premium",
    price: 499,
    rating: 4.9,
    downloads: 892,
    accuracy: 89,
    sharpe: 2.67,
    maxDrawdown: -6.8,
    description:
      "LSTM-based trend prediction with multi-timeframe analysis. Trained on 10+ years of market data with continuous learning capabilities.",
    lastUpdated: "5 days ago",
  },
}

interface ModelDetailsProps {
  modelId: string | null
}

export function ModelDetails({ modelId }: ModelDetailsProps) {
  if (!modelId) {
    return (
      <div className="glass-card rounded-xl p-6 h-[500px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">Select a model to view details</p>
      </div>
    )
  }

  const model = modelData[modelId]

  if (!model) {
    return (
      <div className="glass-card rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Model details not available</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-foreground">{model.name}</h3>
          <Badge
            variant="outline"
            className={
              model.tier === "premium" ? "border-yellow-500/30 text-yellow-500" : "border-green-500/30 text-green-400"
            }
          >
            {model.tier}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{model.author}</span>
          <span>•</span>
          <Clock className="h-3 w-3" />
          <span>{model.lastUpdated}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{model.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2 rounded-lg bg-secondary/30 text-center">
          <p className="text-xs text-muted-foreground">Accuracy</p>
          <p className="text-sm font-semibold text-green-400">{model.accuracy}%</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30 text-center">
          <p className="text-xs text-muted-foreground">Sharpe</p>
          <p className="text-sm font-semibold text-primary">{model.sharpe}</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30 text-center">
          <p className="text-xs text-muted-foreground">Max DD</p>
          <p className="text-sm font-semibold text-red-400">{model.maxDrawdown}%</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30 text-center">
          <p className="text-xs text-muted-foreground">Downloads</p>
          <p className="text-sm font-semibold text-foreground">{model.downloads}</p>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${star <= Math.floor(model.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-sm text-foreground ml-1">{model.rating}</span>
        </div>
        <span className="text-xs text-muted-foreground">{model.downloads} users</span>
      </div>

      {/* Security Badge */}
      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">Zero-Trust Sandbox</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Model executes in isolated environment to protect IP</p>
      </div>

      {/* Price & Action */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="text-xl font-bold text-foreground">{model.price === 0 ? "Free" : `$${model.price}`}</p>
        </div>
        {model.tier === "premium" && <p className="text-xs text-muted-foreground">15% commission on profits</p>}
      </div>

      <Button className="w-full bg-primary hover:bg-primary/90">
        <Download className="h-4 w-4 mr-2" />
        {model.price === 0 ? "Download" : "Purchase & Deploy"}
      </Button>
    </div>
  )
}
