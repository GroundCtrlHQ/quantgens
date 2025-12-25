"use client"

import { useState } from "react"
import { Code, Bot, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sampleCode = `def momentum_alpha(prices, lookback=60):
    """
    Momentum Alpha Strategy
    Generates signals based on rolling returns
    """
    returns = prices.pct_change(lookback)
    zscore = (returns - returns.mean()) / returns.std()
    
    signals = np.where(zscore > 1.5, 1,  # Long
              np.where(zscore < -1.5, -1,  # Short
              0))  # Neutral
    
    return signals`

const aiAnalysis = [
  {
    line: 7,
    type: "optimization",
    message: "Consider vectorized operations for 3x performance gain",
  },
  {
    line: 9,
    type: "risk",
    message: "Fixed threshold (1.5) may cause regime sensitivity",
  },
  {
    line: 3,
    type: "info",
    message: "Lookback period optimal range: 45-90 days based on historical analysis",
  },
]

export function CodeAnalytics() {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(sampleCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card rounded-xl p-4 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Code Analytics</h3>
        </div>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={copyCode}>
          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>

      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 h-8 mb-3">
          <TabsTrigger value="code" className="text-xs">
            Source Code
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs">
            AI Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 mt-0">
          <ScrollArea className="h-[480px]">
            <pre className="p-3 rounded-lg bg-[#0D0D0D] text-xs font-mono leading-relaxed">
              <code className="text-green-400">{sampleCode}</code>
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 mt-0">
          <ScrollArea className="h-[480px]">
            <div className="space-y-3">
              {aiAnalysis.map((item, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${
                    item.type === "risk"
                      ? "bg-red-500/10 border-red-500/20"
                      : item.type === "optimization"
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-primary/10 border-primary/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-mono text-muted-foreground">Line {item.line}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        item.type === "risk"
                          ? "bg-red-500/20 text-red-400"
                          : item.type === "optimization"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-primary/20 text-primary"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80">{item.message}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
