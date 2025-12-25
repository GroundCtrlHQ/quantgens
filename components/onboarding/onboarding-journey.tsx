"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, LayoutDashboard, FlaskConical, Radar, Store, Settings, Key, Sparkles, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    id: 1,
    title: "Welcome to Quantgens",
    description: "Your AI-Powered Quantitative Trading Platform",
    icon: Sparkles,
    targetId: null,
    content: (
      <div className="space-y-4">
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Get Started with Your Quant Journey</h3>
          <p className="text-sm text-muted-foreground">
            Connect your Databricks workspace to unlock powerful quantitative models. We'll guide you through the key features of the platform.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Quantos AI Assistant",
    description: "Your AI co-pilot for quantitative trading insights",
    icon: Bot,
    targetId: "quantos-widget",
    content: (
      <div className="space-y-3">
        <div className="text-center py-2 mb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-2">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Quantos AI - Your Trading Co-Pilot</h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• Ask questions about stocks, news, and market conditions</p>
          <p>• Get real-time stock data and market overview</p>
          <p>• Understand model behavior and parameter tuning</p>
          <p>• Analyze strategy performance and risk metrics</p>
          <p>• Access AI-powered news search and insights</p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Command Center Dashboard",
    description: "Monitor your portfolio performance and live trading signals",
    icon: LayoutDashboard,
    targetId: "command-center-main",
    content: (
      <div className="space-y-3">
        <div className="text-center py-2 mb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Your Trading Dashboard</h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• View real-time portfolio metrics and P&L</p>
          <p>• Monitor active strategies and their performance</p>
          <p>• Track whale activity and market signals</p>
          <p>• Analyze performance charts and risk metrics</p>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Quantgens Lab",
    description: "Build, tune, and backtest your trading strategies",
    icon: FlaskConical,
    targetId: "sidebar-lab",
    content: (
      <div className="space-y-3">
        <div className="text-center py-2 mb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-2">
            <FlaskConical className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Strategy Development Lab</h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• Tune model parameters (GARCH, LSTM, XGBoost)</p>
          <p>• Compose multi-strategy portfolios</p>
          <p>• Run comprehensive backtests</p>
          <p>• Your Databricks models will appear here after connection</p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Connect Databricks API",
    description: "Enter your API key to sync your quantitative models",
    icon: Key,
    targetId: "settings-link",
    content: (
      <div className="space-y-3">
        <div className="text-center py-2 mb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-2">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Connect Your Models</h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>1. Go to Settings (in sidebar)</p>
          <p>2. Enter your Databricks API key</p>
          <p>3. Platform automatically detects your quant models</p>
          <p>4. Models sync and appear in the Lab</p>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Find your API key: Databricks → User Settings → Access Tokens
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Whale Radar",
    description: "Track institutional capital flows in real-time",
    icon: Radar,
    targetId: "sidebar-whale-radar",
    content: (
      <div className="space-y-3">
        <div className="text-center py-2 mb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-2">
            <Radar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Smart Money Tracking</h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• Monitor large institutional trades</p>
          <p>• Identify smart money vs retail flow</p>
          <p>• Get alerts on significant capital movements</p>
          <p>• Visualize flow patterns and market sentiment</p>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    title: "Model Marketplace",
    description: "Discover and share quantitative models",
    icon: Store,
    targetId: "sidebar-marketplace",
    content: (
      <div className="space-y-3">
        <div className="text-center py-2 mb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-2">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Model Ecosystem</h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• Browse community-contributed models</p>
          <p>• Share your own models</p>
          <p>• Monetize successful strategies</p>
          <p>• Discover new trading opportunities</p>
        </div>
      </div>
    ),
  },
]

interface OnboardingJourneyProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OnboardingJourney({ open, onOpenChange }: OnboardingJourneyProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]

  // Scroll to and highlight target element
  useEffect(() => {
    if (!open || !step.targetId) return

    const timer = setTimeout(() => {
      const element = document.querySelector(`[data-onboarding-target="${step.targetId}"]`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [currentStep, open, step.targetId])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onOpenChange(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <>
      {/* Overlay with cutout for highlighted element */}
      <OverlayWithCutout targetId={step.targetId} />

      {/* Tooltip/Content Card - Always centered */}
      <TooltipCard step={step} currentStep={currentStep} steps={steps} onNext={handleNext} onBack={handleBack} onSkip={handleSkip} />
    </>
  )
}

// Overlay that dims/blurs everything except the target element
function OverlayWithCutout({ targetId }: { targetId: string | null }) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!targetId) {
      setRect(null)
      return
    }

    const updateRect = () => {
      const element = document.querySelector(`[data-onboarding-target="${targetId}"]`)
      if (element) {
        setRect(element.getBoundingClientRect())
      }
    }

    updateRect()
    window.addEventListener("scroll", updateRect, true)
    window.addEventListener("resize", updateRect)

    return () => {
      window.removeEventListener("scroll", updateRect, true)
      window.removeEventListener("resize", updateRect)
    }
  }, [targetId])

  if (!targetId || !rect) {
    // If no target, show full overlay
    return (
      <div className="fixed inset-0 z-[100] pointer-events-none">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>
    )
  }

  const padding = 4
  const highlightRect = {
    top: rect.top - padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  }

  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Top overlay */}
      {highlightRect.top > 0 && (
        <div
          className="absolute bg-black/60 backdrop-blur-sm"
          style={{
            top: 0,
            left: 0,
            right: 0,
            height: `${highlightRect.top}px`,
          }}
        />
      )}
      {/* Bottom overlay */}
      {highlightRect.top + highlightRect.height < viewportHeight && (
        <div
          className="absolute bg-black/60 backdrop-blur-sm"
          style={{
            top: `${highlightRect.top + highlightRect.height}px`,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
      {/* Left overlay */}
      {highlightRect.left > 0 && (
        <div
          className="absolute bg-black/60 backdrop-blur-sm"
          style={{
            top: `${highlightRect.top}px`,
            left: 0,
            width: `${highlightRect.left}px`,
            height: `${highlightRect.height}px`,
          }}
        />
      )}
      {/* Right overlay */}
      {highlightRect.left + highlightRect.width < viewportWidth && (
        <div
          className="absolute bg-black/60 backdrop-blur-sm"
          style={{
            top: `${highlightRect.top}px`,
            left: `${highlightRect.left + highlightRect.width}px`,
            right: 0,
            height: `${highlightRect.height}px`,
          }}
        />
      )}
      {/* Border highlight around the clear area */}
      <div
        className="absolute border-2 border-primary rounded-lg pointer-events-none"
        style={{
          top: `${highlightRect.top}px`,
          left: `${highlightRect.left}px`,
          width: `${highlightRect.width}px`,
          height: `${highlightRect.height}px`,
          boxShadow: `0 0 0 2px rgba(0, 108, 255, 0.3), 0 0 20px rgba(0, 108, 255, 0.5), inset 0 0 20px rgba(0, 108, 255, 0.1)`,
        }}
      />
    </div>
  )
}

// Tooltip card component - always centered
function TooltipCard({ 
  step, 
  currentStep, 
  steps, 
  onNext, 
  onBack, 
  onSkip 
}: { 
  step: typeof steps[0]
  currentStep: number
  steps: typeof steps
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}) {

  const Icon = step.icon
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="fixed z-[101] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="glass-card rounded-xl border border-primary/50 shadow-2xl p-6 w-[400px] pointer-events-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onSkip} className="h-6 w-6 p-0 text-xs">
            ×
          </Button>
        </div>

        <Progress value={progress} className="h-1.5 mb-4" />

        <div className="mb-4">
          {step.content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={currentStep === 0}
            className="gap-2"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-1.5">
            {steps.map((s, index) => (
              <div
                key={s.id}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all",
                  index === currentStep ? "bg-primary w-6" : index < currentStep ? "bg-chart-2" : "bg-secondary"
                )}
              />
            ))}
          </div>
          <Button onClick={onNext} className="gap-2" size="sm">
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
