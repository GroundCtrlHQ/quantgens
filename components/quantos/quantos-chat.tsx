"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Bot, Send, Sparkles, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { StockWidget } from "./stock-widget"
import { NewsWidget } from "./news-widget"
import { MarketWidget } from "./market-widget"
import type { QuantosMessage } from "@/app/api/chat/route"

interface QuantosChatProps {
  context?: string
  className?: string
  compact?: boolean
  showHeader?: boolean
}

function MarkdownText({ text }: { text: string }) {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      {text.split("\n").map((line, i) => (
        <p key={i} className="mb-1 last:mb-0">
          {line || "\u00A0"}
        </p>
      ))}
    </div>
  )
}

export function QuantosChat({ context, className, compact = false, showHeader = true }: QuantosChatProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [localInput, setLocalInput] = useState("")

  const { messages, sendMessage, status } = useChat<QuantosMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    initialMessages: context
      ? [
          {
            id: "system-context",
            role: "user" as const,
            parts: [{ type: "text", text: `Context: ${context}` }],
          },
        ]
      : [],
  })

  const isLoading = status === "streaming" || status === "submitted"

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!localInput.trim() || isLoading) return
    sendMessage({ text: localInput })
    setLocalInput("")
  }

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [messages])

  const displayMessages = messages.filter((m) => m.id !== "system-context")

  const renderMessageParts = (message: QuantosMessage) => {
    if (!message.parts || message.parts.length === 0) {
      return null
    }

    return message.parts.map((part, index) => {
      switch (part.type) {
        case "text":
          return <MarkdownText key={index} text={part.text} />

        case "tool-getStockData": {
          if (part.state === "input-available" || part.state === "output-available") {
            const output = part.state === "output-available" ? part.output : null
            if (output?.state === "ready") {
              return (
                <StockWidget
                  key={index}
                  ticker={output.ticker}
                  price={output.price}
                  change={output.change}
                  changePercent={output.changePercent}
                  open={output.open}
                  high={output.high}
                  low={output.low}
                  volume={output.volume}
                  signal={output.signal}
                  confidence={output.confidence}
                />
              )
            } else if (output?.state === "error") {
              return (
                <div key={index} className="text-sm text-red-400">
                  {output.message}
                </div>
              )
            }
            return (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground my-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Fetching stock data...
              </div>
            )
          }
          break
        }

        case "tool-getNews": {
          if (part.state === "input-available" || part.state === "output-available") {
            const output = part.state === "output-available" ? part.output : null
            if (output?.state === "ready" && output.articles) {
              return <NewsWidget key={index} query={output.query || ""} articles={output.articles} />
            }
            return (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground my-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching news...
              </div>
            )
          }
          break
        }

        case "tool-getMarketOverview": {
          if (part.state === "input-available" || part.state === "output-available") {
            const output = part.state === "output-available" ? part.output : null
            if (output?.state === "ready" && output.indices) {
              return <MarketWidget key={index} indices={output.indices} />
            } else if (output?.state === "error") {
              return (
                <div key={index} className="text-sm text-red-400">
                  {output.message}
                </div>
              )
            }
            return (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground my-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading market data...
              </div>
            )
          }
          break
        }

        default:
          return null
      }
    })
  }

  return (
    <div className={cn("flex flex-col", compact ? "h-full" : "h-[600px]", className)}>
      {showHeader && (
        <div className={cn("border-b border-border/50 shrink-0", compact ? "p-3" : "p-4")}>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 glow-blue">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Quantos AI</h3>
              <p className="text-xs text-muted-foreground">XAI Co-pilot</p>
            </div>
            <Sparkles className="h-4 w-4 text-primary ml-auto animate-pulse" />
          </div>
        </div>
      )}

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="space-y-4">
          {displayMessages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Ask me about models, strategies, or market analysis</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {["What's AAPL price?", "News on Tesla", "Market overview"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setLocalInput(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {displayMessages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-lg text-sm",
                  message.role === "user" ? "bg-primary text-primary-foreground px-3 py-2" : "text-foreground",
                )}
              >
                {renderMessageParts(message)}
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && displayMessages[displayMessages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-secondary/70 rounded-lg px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className={cn("border-t border-border/50 shrink-0", compact ? "p-3" : "p-4")}>
        <div className="flex gap-2">
          <Input
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Ask Quantos..."
            className="flex-1 bg-secondary/50 border-border/50 text-sm"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !localInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
