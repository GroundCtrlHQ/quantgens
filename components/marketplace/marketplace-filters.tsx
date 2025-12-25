"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface MarketplaceFiltersProps {
  category: string
  onCategoryChange: (category: string) => void
  tier: string
  onTierChange: (tier: string) => void
}

const categories = [
  { id: "all", label: "All Models" },
  { id: "momentum", label: "Momentum" },
  { id: "mean-reversion", label: "Mean Reversion" },
  { id: "ml", label: "Machine Learning" },
  { id: "arbitrage", label: "Arbitrage" },
  { id: "sentiment", label: "Sentiment" },
]

const tiers = [
  { id: "all", label: "All Tiers" },
  { id: "open-source", label: "Open Source" },
  { id: "premium", label: "Premium" },
]

export function MarketplaceFilters({ category, onCategoryChange, tier, onTierChange }: MarketplaceFiltersProps) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Filters</h3>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search models..." className="pl-9 bg-secondary/50 border-border/50" />
      </div>

      {/* Category */}
      <div className="mb-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Category</Label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                category === cat.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tier */}
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Access Tier</Label>
        <div className="space-y-1">
          {tiers.map((t) => (
            <button
              key={t.id}
              onClick={() => onTierChange(t.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                tier === t.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
