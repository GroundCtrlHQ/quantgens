"use client"

import { Bot, Sparkles } from "lucide-react"
import { QuantosChat } from "@/components/quantos/quantos-chat"

export function QuantosPanel() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 glow-blue">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-semibold text-foreground">Quantos AI</h3>
          <p className="text-[10px] text-muted-foreground">XAI Co-pilot</p>
        </div>
        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 animate-pulse" />
      </div>

      {/* Chat area - takes remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <QuantosChat compact showHeader={false} className="h-full" />
      </div>
    </div>
  )
}
