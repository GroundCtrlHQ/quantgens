"use client"

import { cn } from "@/lib/utils"

const assets = [
  { id: "all", label: "All Assets" },
  { id: "btc", label: "BTC" },
  { id: "eth", label: "ETH" },
  { id: "sol", label: "SOL" },
  { id: "equities", label: "Equities" },
]

interface AssetFilterProps {
  selectedAsset: string
  onAssetChange: (asset: string) => void
}

export function AssetFilter({ selectedAsset, onAssetChange }: AssetFilterProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50">
      {assets.map((asset) => (
        <button
          key={asset.id}
          onClick={() => onAssetChange(asset.id)}
          className={cn(
            "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
            selectedAsset === asset.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {asset.label}
        </button>
      ))}
    </div>
  )
}
