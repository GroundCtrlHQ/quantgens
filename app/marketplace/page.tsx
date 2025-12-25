"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"
import { ModelGrid } from "@/components/marketplace/model-grid"
import { ModelDetails } from "@/components/marketplace/model-details"
import { UploadModel } from "@/components/marketplace/upload-model"

export default function MarketplacePage() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [category, setCategory] = useState("all")
  const [tier, setTier] = useState("all")

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header title="Model Marketplace" subtitle="Discover, share, and monetize quantitative models" />

        <main className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left - Filters & Upload */}
            <div className="col-span-3 space-y-6">
              <MarketplaceFilters
                category={category}
                onCategoryChange={setCategory}
                tier={tier}
                onTierChange={setTier}
              />
              <UploadModel />
            </div>

            {/* Center - Model Grid */}
            <div className="col-span-6">
              <ModelGrid
                category={category}
                tier={tier}
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
              />
            </div>

            {/* Right - Model Details */}
            <div className="col-span-3">
              <ModelDetails modelId={selectedModel} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
