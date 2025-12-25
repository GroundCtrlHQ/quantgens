"use client"

import { useState } from "react"
import { Bot, Sparkles, X, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuantosChat } from "@/components/quantos/quantos-chat"
import { cn } from "@/lib/utils"

export function QuantosWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          data-onboarding-target="quantos-widget"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-all hover:scale-105 glow-blue"
        >
          <Bot className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      {/* Chat popup */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-card border border-border rounded-xl shadow-2xl flex flex-col transition-all duration-200",
            isExpanded ? "bottom-4 right-4 w-[500px] h-[600px]" : "bottom-6 right-6 w-[380px] h-[500px]",
          )}
        >
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
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Chat area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <QuantosChat compact showHeader={false} className="h-full" />
          </div>
        </div>
      )}
    </>
  )
}
